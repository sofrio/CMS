/*
 * Coded by kojima@sofrio.com
 *	2015/11/29
 */

Main.RELOAD_RSRCS		= 6400;//240;//
Main.RELOAD_WAIT		= 500;
Main.CHECK_INTERVAL		= 5*1000;		// 5秒
Main.SYNC_MARGIN		= 5*1000;		// 5秒

Main.args			= ParseQuery();
Main.$map			= null;
Main.map			= null;
Main.cameraManager	= null;
Main.cameraID		= 0;
Main.startTime		= 0;
Main.nRsrc			= 0;
Main.sync			= [];	// 準備完了を伝えてきた(同期を取るべき)相手のMain
Main.detect			= false;

Main.Initialize = function()
{	'use strict';
	Main.startTime=new Date().getTime();
	var playTime=Args.GetPlayTime(Main.args);	
	Main.detect=Head.Setup((playTime)?playTime:Main.startTime,Main.args['detect']);
	CheckSystem();
		
	if(Main.IS_RELOAD){
		Main.args=ParseQuery(Main.RELOAD_ARGS);
		playTime=Number(Main.args['playTime']);
	}
	return playTime;
}

Main.CreateMap = function($map,lat,lng,zoom)
{	'use strict';
	Main.$map=$map;	
	if(Main.args['lat'] && Main.args['lng']){
		lat=Number(Main.args['lat']);
		lng=Number(Main.args['lng']);
	}
	if(Main.args['zoom']){
		zoom=Number(Main.args['zoom']);
	}							
	var mapOptions = {
		center: new google.maps.LatLng(lat,lng),
		zoom: zoom,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false
	};
	Main.map=new google.maps.Map(Main.$map[0],mapOptions);
	google.maps.event.addDomListener(window,'load',function(){
		'use strict';
		console.info("map loaded.");
	});
}

$(function(){
	'use strict';	
	document.getElementById("debug-info").style.visibility="visible";
	$(window).on("beforeunload",Main.Close);
	
	if(Main.BROWSER!='ie') setInterval(Main.checkReload,Main.CHECK_INTERVAL);
});

Main.checkReload = function()
{	'use strict';
	var rsrc=Main.getTotalRsrcCount();
	if(Main.DEBUG>1) console.log("Main.checkReload(): nRsrc = "+Main.nRsrc+"/"+rsrc.count);
	if(rsrc.count<=Main.RELOAD_RSRCS) return;
	
	var main=(rsrc.main)?rsrc.main:Main;
	var wait=function(){
		'use strict';
		if(main.sync.length<=0){
			main.ForceReload(rsrc.count);
		} else {
			setTimeout(wait,main.RELOAD_WAIT);
		}
	};
	wait();
}

Main.getTotalRsrcCount = function()
{	'use strict';
	var nRsrc=Main.nRsrc,max=Main.nRsrc,maxMain=Main;
	if(!Main.IS_PLAYER){
		var cameraList=Main.cameraManager.cameraList;
		for(var cameraID in cameraList){
			var camera=cameraList[cameraID];
			if(!camera) continue;
			var main=Main.getMain(camera.playerWindow);
			if(!main) continue;
			if(main.nRsrc>max){
				maxMain=main;
				max=main.nRsrc
			}
			nRsrc+=main.nRsrc;
		}
	}
	return { main: maxMain, count: nRsrc };
}

Main.ForceReload = function(nRsrc)
{	'use strict';
	var now=new Date();
	var age=FormatDate((now.getTime()-Main.startTime)+(now.getTimezoneOffset()*60*1000));
	age=age.hh+":"+age.mm+":"+age.ss;
	console.error("TOO MANY RESOURCES : "+Main.nRsrc+"/"+nRsrc+" within "+age+".");
	Head.Alert("再起動します...");

	var args=[];
	args['nReload']=(Main.args['nReload'])?Main.args['nReload']:0;
	args['nReload']++;
	if(Main.map){	
		var O=Main.map.getBounds().getCenter();
		args['lat']=O.lat();
		args['lng']=O.lng();
		args['zoom']=Main.map.zoom;
	}
	Main.cameraManager.SetReloadArgs(args);
	
	var $form=$('<form method="POST">').append($('<input name="args">').val(MakeQuery(args)));
	$form.hide().appendTo('body').submit();
}

Main.CheckSync = function()
{	'use strict';
	if(Main.IS_PLAYER){
		var openMain=Main.getMain(opener);
		if(openMain){
			var cameraID=Main.cameraID;
			console.log("telling #"+cameraID+" is ready to opener...");
			// RPC...
			var mute=openMain.SetPlayerStatus(cameraID,true,true);
			if(Main.needSync(openMain)){
				if(Main.args['mute']) mute=(Main.args['mute']=="true");
				Main.cameraManager.player.mute=mute;
				if(Main.IS_MOBILE) mute=true;
				Main.SetSoundButton(cameraID,true);
				// RPC...
				if(openMain.askSync(Main)){
					console.log("waiting sync from opener...");
					return true;
				}
			}
		}
	} else {
		var cameraList=Main.cameraManager.cameraList;
		for(var cameraID in cameraList){
			var camera=cameraList[cameraID];
			if(!camera) continue;
			var syncMain=Main.getMain(camera.playerWindow);
			if(Main.needSync(syncMain)){
				// RPC...
				if(syncMain.askSync(Main)){
					console.log("waiting sync from camera #"+cameraID+"...");
					return true;
				}
			}
		}
	}
	return false;
}

Main.getMain = function(instance)
{	'use strict';
	if(!instance) return null;
	try{
		return instance.window.Main;
	}
	catch(e){
		console.error("@Main.getMain("+instance+"): " + e);
	}
	return null;
}

Main.needSync = function(syncMain)
{	'use strict';
	if(!syncMain) return false;
	var diff=syncMain.cameraManager.playTime-Main.cameraManager.playTime;
	if(diff<-Main.SYNC_MARGIN || +Main.SYNC_MARGIN<diff) return false;;
	return true;
}

Main.askSync = function(syncMain)
{	'use strict';
	if(!Main.cameraManager.renderOK) return false;
	Main.sync.push(syncMain);
	return true;
}

Main.DoSync = function()
{	'use strict';
	for(var i=0,n=Main.sync.length;i<n;i++){
		var manager=Main.sync.shift().cameraManager;
		var player=manager.player;
		var target=(player)?"camera #"+player.cameraID:"opener";
		console.info("starting "+target+" render...");
		// RPC...
		manager.StartRender(Main.cameraManager.playTime+Main.RENDER_INTERVAL);
	}
}

Main.SyncMute = function(cameraID,mute)	// called by player...
{	'use strict';
	if(!Main.IS_MOBILE){
		var openMain=Main.getMain(opener);
		if(openMain){
			// RPC...
			openMain.cameraManager.SetMute(cameraID,mute);
		}
	}
}

Main.SetPlayerStatus = function(cameraID,ready,mute)	// called by player...
{	'use strict';
	var camera=Main.cameraManager.cameraList[cameraID];
	if(!camera) return false;
	return camera.SetPlayerStatus(ready,mute);
}

Main.SetSoundButton = function(cameraID,mute)
{	'use strict';
	var camera=Main.cameraManager.cameraList[cameraID];
	if(camera && camera.$soundBtn){
		camera.$soundBtn.text((mute)?"音声":"消音");
	}
}

Main.Close = function()
{	'use strict';
	Main.cameraManager.SetPause(true);
	var openMain=Main.getMain(opener);
	if(openMain){
		console.log("telling #"+Main.cameraID+" is away to opener...");
		// RPC...
		openMain.SetPlayerStatus(Main.cameraID,false,Main.cameraManager.player.mute);
	}
}
