/*
 * Coded by kojima@sofrio.com
 *	2015/11/07
 */

//全域的な定数なので、Main内に定義しておく 
Main.CAMERA_MAP		= "cameramap";
Main.NUMBER_PLATE	= "numberplate";
var getMapID = function()
{	'use strict';
	if(location.pathname.indexOf(Main.NUMBER_PLATE)>=0){
		return Main.NUMBER_PLATE;
	}
	return Main.CAMERA_MAP;
}
Main.mapID				= getMapID();
Main.NPTS				= (Main.mapID==Main.NUMBER_PLATE)
Main.GPS				= (Main.NPTS)?"GPS端末":"カメラ";
Main.INFO_SPAN			= 30*1000;	// 2018.02.13 山岡さんの指示により2倍に変更	//15*1000;	// 15秒
Main.LIST_INTERVAL		= 60*1000;	//  1分

var setTrackTest = function(trackTest)
{	'use strict';
	Main.TRACK_TEST=trackTest;
	if(Main.TRACK_TEST){
		Main.RENDER_INTERVAL	= 10;
		Main.REAL_TIME_LATENCY	= 20;
	} else {
		Main.RENDER_INTERVAL	= 1*1000;	//  1秒
		Main.REAL_TIME_LATENCY	= 2*Main.LIST_INTERVAL;	//  2分
	}
}
setTrackTest(Main.TRACK_TEST)		
	
CameraManager = function(timeShift,playTime,$nowTime){
	'use strict';
	this.timeShift=timeShift;
	this.playTime=this.limitPlayTime(playTime);
	this.playLatency=(timeShift)?new Date().getTime()-this.playTime:Main.REAL_TIME_LATENCY;
	if(!Main.IS_RELOAD && !this.timeShift) Head.SetDate(this.playTime);
	
	this.$nowTime=$nowTime;
	this.player=null;
	this.markList=new OrderedList(true);
	this.cameraList=[];
	this.waitList=0;
	this.lastList=0;
	this.preloading=false;
	this.renderInterval=null;
	this.nCheckPreload=0;
	this.paused=false;
	if(this.$nowTime) this.$nowTime.text(Main.GPS+"検出中...");
};

CameraManager.prototype.LIST_PATH			= "cameralist.php";
CameraManager.prototype.LIST_ERROR			= Main.GPS+"の情報が取得できません。";
CameraManager.prototype.PLAYTIME_ERROR		= (Main.NPTS)?"未来時刻の追跡はできません。":"指定時刻の再生はできません。";
CameraManager.prototype.NO_CAMERA			= Main.GPS+"が見つかりません。";
CameraManager.prototype.CAMERA_FOUND		= Main.GPS+"が見つかりました、"+(Main.LIST_INTERVAL/1000)+"秒以内に地図上に現れます。";
	
CameraManager.prototype.RELOAD_DELAY		= 1*1000;		//   1秒
CameraManager.prototype.CHECK_INTERVAL		= 100;			// 0.1秒
CameraManager.prototype.BWD_FWD_TIME		= 5*1000;		//   5秒
CameraManager.prototype.ONE_MODE			= false;		// in map view
if(Main.BROWSER=='ie') CameraManager.prototype.ONE_MODE=false;	
	
CameraManager.prototype.LIST_TRIGGER		= Main.INFO_SPAN;
CameraManager.prototype.LIST_INTERVAL		= Main.LIST_INTERVAL;
CameraManager.prototype.RENDER_INTERVAL		= Main.RENDER_INTERVAL;
CameraManager.prototype.MAX_CHECK_PRELOAD	= (Main.DEBUG<0)?1000:300;
	
CameraManager.prototype.limitPlayTime = function(playTime)
{	'use strict';
	var now=new Date().getTime()-Main.REAL_TIME_LATENCY;
	if(!this.timeShift) return now;
	if(playTime>now){
		Head.Alert(this.PLAYTIME_ERROR,true);
		playTime=now;
	}
	return playTime;
}

CameraManager.prototype.SetReloadArgs = function(args)
{	'use strict';
	var playTime=(this.timeShift)?(this.playTime+this.RELOAD_DELAY):0;
	args['playTime']=playTime;
	if(this.player){
		args['mute']=this.player.mute;
		if(this.player.volume!=1) args['volume']=this.player.volume;
	} else {
		for(var cameraID in this.cameraList){
			var arg=this.cameraList[cameraID].SetReloadArgs(args);
		}
	}
}

CameraManager.prototype.SetPlayer = function(cameraID,url,$canvas,$soundBtn,$loading)
{	'use strict';
	var camera=new Camera(cameraID,true);
	this.cameraList[cameraID]=camera;
	this.player=camera.moviePlayer;
	if(this.player){
		this.player.Setup(url,false,$loading);
		this.player.SetupCanvas($canvas);
		camera.$soundBtn=$soundBtn;
		this.waitList=0;
		if(this.$nowTime) this.$nowTime.text("動画取得中...");
	}
}

CameraManager.prototype.Start = function(seek)
{	'use strict';
	this.preloading=true;
	if(this.player){
		this.player.GetMovieList(this.playTime-this.LIST_INTERVAL);
		this.player.GetMovieList(this.playTime);
	} else {
		this.waitList=0;
		if(this.GetCameraList(this.playTime-this.LIST_INTERVAL,seek)) this.waitList++;
		if(this.GetCameraList(this.playTime,seek)) this.waitList++;
	}
	this.lastList=Math.floor(this.playTime/this.LIST_INTERVAL)*this.LIST_INTERVAL;
	this.nCheckPreload=0;
	this.checkPreload(seek);
}

CameraManager.prototype.GetCameraList = function(listTime,seek)
{	'use strict';
	if(this.player) return false;
	var date=FormatDate(listTime);
    var markKey=Movie.GetMarkKey(date);
    var mark=this.markList.find(markKey);
    if(mark) return false;
    this.markList.insert(markKey,true);
	console.info("loading camera list "+markKey);
	
	var args="date="+markKey;
	var cameraList=this.LIST_PATH+"?"+args;

	var self=this;
	$.getJSON(cameraList)
	.success(function(json){
		'use strict';
		self.applyCameraList(json,listTime,seek);
	})
	.error(function(jqXHR,textStatus,errorThrown){
		'use strict';
	//	console.error("CameraManager.GetCameraList("+listTime+","+seek+"): "+textStatus);
		Head.Alert(this.LIST_ERROR);
		return false;
	})
	return true;
}

CameraManager.prototype.applyCameraList = function(json,listTime,seek)
{	'use strict';
	if(this.player) return;

	var nCamera=0;
	for(var cameraID in json){
		var camera=this.cameraList[cameraID];
		var infoList=(camera)?camera.infoList:new OrderedList(true);	//巻き戻し対応のため過去分も保持しておく
		var n=0;
		for(var time in json[cameraID]['log']){
			var info=json[cameraID]['log'][time];
			if(info.lat && info.lon){
				infoList.insert(time,info);
				n++;
			}
		}
		if(n<=0) continue;
		if(!camera){
			var device=json[cameraID]['device'];
			camera=new Camera(cameraID,device!="",json[cameraID]['tracks']);
			if(camera.moviePlayer){
				camera.moviePlayer.Setup(device+'/',this.ONE_MODE,null);
			}
			camera.infoList=infoList;
			console.info("camera found: #"+cameraID);
			this.cameraList[cameraID]=camera;
			if(camera.moviePlayer){
				var listTime=Math.floor(this.playTime/this.LIST_INTERVAL-1)*this.LIST_INTERVAL;
				while(listTime<=this.lastList){
					camera.moviePlayer.GetMovieList(listTime);
					listTime+=this.LIST_INTERVAL;
				}
			}
		} else {
			if(camera.moviePlayer){
				camera.moviePlayer.GetMovieList((seek)?this.playTime:this.lastList);
			}
		}
		nCamera++;
	}
	if(this.waitList>0){
		if(--this.waitList>0) return;
		if(!seek && nCamera>0 && this.$nowTime) this.$nowTime.text("動画取得中...");
	}

	if(nCamera>0){	
		if(this.countInfoWindows(false)==0){
			Head.Alert(this.CAMERA_FOUND);
		}
		this.updateInfoWindows(!Main.IS_RELOAD);		
	} else {
		if(this.countInfoWindows(true)==0){
			Head.Alert(this.NO_CAMERA);
		}
		setTrackTest(false)		
	}
	
	//巻き戻し用に過去2*this.LIST_INTERVAL分は保持しておく
	this.freeInfoList(this.playTime-2*this.LIST_INTERVAL);
}

CameraManager.prototype.countInfoWindows = function(playing)
{	'use strict';
	var n=0;
	for(var cameraID in this.cameraList){
		var camera=this.cameraList[cameraID];
		if(camera.infoWindow){
			if(playing && camera.moviePlayer && camera.moviePlayer.nNoData>0) continue;
			n++;
		}
	}
	return n;
}

CameraManager.prototype.freeInfoList = function(freeTime)
{	'use strict';
	var time=Movie.GetTimeKey(freeTime);	
	while(this.markList.first && this.markList.first.key<=time){
		this.markList.shift();
	}
	for(var cameraID in this.cameraList){
		var camera=this.cameraList[cameraID];
		while(camera.infoList.first && camera.infoList.first.key<=time){
			camera.infoList.shift();
		}
		if(Main.CMS && !camera.infoList.first){
			camera=null;
			delete this.cameraList[cameraID];
		}
	}
}

// 初期preloadの完了を確認
CameraManager.prototype.checkPreload = function(seek)
{	'use strict';
	var ok=false;
	if(this.waitList==0){
		var n=0;
		for(var cameraID in this.cameraList){
			var player=this.cameraList[cameraID].moviePlayer;
			if(!player) continue;
			var r=player.Preload(this.playTime,seek);
			if(r===true){	//１つでも再生可能になったら動作を開始する...
				ok=true;
				break;
			}
			if(r===false) n++;
		}
		//カメラが１つもない場合も動作を開始する...
		if(n==0) ok=true;
	}
	if(!ok){
	//	console.log("nCheckPreload="+this.nCheckPreload);
		if(++this.nCheckPreload>this.MAX_CHECK_PRELOAD){
			Head.Alert((this.waitList)?this.LIST_ERROR:Movie.LOAD_ERROR);
			this.nCheckPreload=0;
		} else {
		//	console.log("waiting "+list+" list...");
			setTimeout(this.checkPreload.bind(this,seek),this.CHECK_INTERVAL);
			return;
		}
	}
	//preload完了
	console.info("initial preload completed.");
	this.preloading=false;
	
	if(Main.CheckSync()) return;
		
	if(seek){
		this.checkSound();
		return;
	}
	
	this.StartRender();
}

CameraManager.prototype.checkSound = function()
{	'use strict';
	for(var cameraID in this.cameraList){
		var camera=this.cameraList[cameraID];
		if(camera.moviePlayer){
			camera.moviePlayer.CheckSound(this.playTime,false);
		}
	}
}

CameraManager.prototype.StartRender = function(playTime)	// called by self or opener...
{	'use strict';
	if(this.renderInterval) return;

	//Head.Alert("動画を再生します。");
	console.info("starting render process...");	//!
	if(this.timeShift){
		if(playTime) this.playTime=playTime;
		this.playLatency=new Date().getTime()-this.playTime;
		this.checkSound();
	}
	var render=((this.player)?this.playerRender:this.cameraRender).bind(this);	
	this.renderInterval=setInterval(render,this.RENDER_INTERVAL);
	if(Main.DEBUG>2) console.log(NowStr()+" CameraManager.StartRender, playTime="+TimeStr(this.playTime));
}

CameraManager.prototype.playerRender = function()
{	'use strict';
	Main.DoSync();
	if(this.preloading || this.paused) return;

	this.updateNowTime();
	if(this.player.Render(this.playTime)){
		Main.SyncMute(this.player.cameraID,true);
	}
	
	this.stepPlayTime();

	var nextList=this.lastList+this.LIST_INTERVAL;
	if(this.playTime+this.LIST_TRIGGER>nextList){
		this.player.GetMovieList(nextList);				
		this.lastList=nextList;
	}

	this.player.Preload(this.playTime,false);
}

CameraManager.prototype.cameraRender = function()
{	'use strict';
	if(Main.DEBUG>2) console.log(NowStr()+" CameraManager.Render(), playTime="+TimeStr(this.playTime));
	Main.DoSync();
	this.updateInfoWindows(false);		
	if(this.preloading || this.paused) return;
	
	this.updateNowTime();
	for(var cameraID in this.cameraList){
		var camera=this.cameraList[cameraID];
		if(camera.infoWindow && camera.moviePlayer){
			camera.moviePlayer.Render(this.playTime);
		} else {
			if(Main.DEBUG>2) console.log(NowStr()+"\tinfoWindow="+camera.infoWindow+", moviePlayer="+camera.moviePlayer);
		}
	}
	
	this.stepPlayTime();

	var nextList=this.lastList+this.LIST_INTERVAL;
	if(this.playTime+this.LIST_TRIGGER>nextList){
		this.GetCameraList(nextList);				
		this.lastList=nextList;
	}
	
	for(var cameraID in this.cameraList){
		var player=this.cameraList[cameraID].moviePlayer;
		if(player) player.Preload(this.playTime,false);
	}
}

//吹き出しの操作
CameraManager.prototype.updateInfoWindows = function(init)
{	'use strict';
	var time=Movie.GetTimeKey(this.playTime);
	var bounds=new google.maps.LatLngBounds(),points=[],n=0;
	for(var cameraID in this.cameraList){
		var latlng=this.cameraList[cameraID].UpdateInfoWindow(this.playTime,time);
		if(init && latlng){
			bounds.extend(latlng);
			n++;
		}
	}
	if(n>1){ 
		InfoWindow.FitBounds(bounds);
	}
}

CameraManager.prototype.updateNowTime = function()
{	'use strict';
	if(this.$nowTime){
		var date=FormatDate(this.playTime);//LocalDate(this.playTime);
		var time=date.YY+"/"+date.MM+"/"+date.DD+" "+date.hh+":"+date.mm+":"+date.ss;
		this.$nowTime.text(time);
	}
}

CameraManager.prototype.stepPlayTime = function()
{	'use strict';
	if(Main.TRACK_TEST){
		this.playTime+=1000;
		return;
	}
	/*
		if(this.timeShift){
		//	this.playTime+=this.RENDER_INTERVAL; ズレが生じる
			this.playTime=new Date().getTime()-this.playLatency;
		} else {
			this.playTime=new Date().getTime()-Main.REAL_TIME_LATENCY;
		}
	*/
	this.playTime=new Date().getTime()-this.playLatency;
}

CameraManager.prototype.OpenPlayer = function(cameraID)
{	'use strict';
	var camera=this.cameraList[cameraID];
	if(!camera) return;
	return camera.OpenPlayer((this.timeShift)?this.playTime:0);	
}
	
CameraManager.prototype.SetPause = function(pause)
{	'use strict';
	this.paused=pause;
	this.clearRender();
	if(pause){
		for(var cameraID in this.cameraList){
			var player=this.cameraList[cameraID].moviePlayer;
			if(player) player.Pause(pause);
		}
		clearInterval(this.renderInterval);		
		this.renderInterval=null;
	} else {
		this.timeShift=true;
		this.StartRender(this.playTime);
		for(var cameraID in this.cameraList){
			var player=this.cameraList[cameraID].moviePlayer;
			if(player) player.Restart(this.playTime);
		}
	}
}

CameraManager.prototype.clearRender = function()
{	'use strict';
    for(var cameraID in this.cameraList){
		var player=this.cameraList[cameraID].moviePlayer;
		if(player) player.ClearRender();
	}
}

CameraManager.prototype.Seek = function(delta,isPreloaded)
{	'use strict';
	if(this.preloading) return;
	
	var playTime=this.playTime+delta;
	var now=new Date().getTime()-Main.REAL_TIME_LATENCY;
	if(playTime>now) playTime=now;
	if(this.playTime==playTime) return;
	
	this.clearRender();
	this.timeShift=true;
	this.playTime=playTime;
	this.playLatency=new Date().getTime()-this.playTime;
	this.updateNowTime();
	if(isPreloaded()){
		this.checkSound();
	//	this.render();
	} else {
		this.Start(true);
	}
}

CameraManager.prototype.Bwd = function()
{	'use strict';
	this.Seek(-(this.BWD_FWD_TIME+this.RENDER_INTERVAL),function(){
		var first=0;
		for(var cameraID in this.cameraList){
			var time=this.cameraList[cameraID].GetPreloadFirst();
			if(time>first) first=time;
		}
		return (this.playTime>=first+this.LIST_INTERVAL);
	}.bind(this));
}

CameraManager.prototype.Fwd = function()
{	'use strict';
	this.Seek(+(this.BWD_FWD_TIME-this.RENDER_INTERVAL),function(){
		var last=Number.MAX_VALUE;
		for(var cameraID in this.cameraList){
			var time=this.cameraList[cameraID].GetPreloadLast();
			if(time<last) last=time;
		}
		return (this.playTime<=last-this.LIST_TRIGGER);
	}.bind(this));
}

CameraManager.prototype.SetSoundStatus = function(cameraID,mute)
{	'use strict';
	var camera=this.cameraList[cameraID];
	if(!camera) return mute;
	return camera.SetSoundStatus(mute,this.playTime);
}

CameraManager.prototype.SetMute = function(cameraID,mute)	// called by self or player...
{	'use strict';
	var camera=this.cameraList[cameraID];
	if(!camera) return;
	camera.SetMute(mute);
}

CameraManager.prototype.SetVolume = function(volume)
{	'use strict';
    for(var cameraID in this.cameraList){
		var player=this.cameraList[cameraID].moviePlayer;
		if(player) player.SetVolume(volume);
	}
}
