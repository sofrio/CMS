/*
 * Coded by kojima@sofrio.com
 *	2015/12/06
 */

var getDataDir = function()
{
	return './meta-data/'+Main.mapID;
}

Camera = function(cameraID,hasMovie,trackColor){
	'use strict';
	this.infoList=new OrderedList(true);
	this.cameraID=cameraID;
	this.hasMovie=hasMovie;
	this.moviePlayer=(this.hasMovie)?new MoviePlayer(cameraID):null;
	this.infoWindow=null;
	this.$soundBtn=null;
	this.playerWindow=null;
	this.fixedImage=getDataDir()+'/img/'+cameraID+'.png';
	this.trackColor=trackColor;
	this.drawTracks=(this.trackColor!="");
	this.tracks=null;
	this.prevTime=0;
	this.times=0;
	this.dists=0;
	this.noInfo=false;
	
	if(this.hasArg("p")){
		this.playerWindow=this.getPlayerWindow();
		this.delArg("p");
	}
};

Camera.zIndex					= 0;
Camera.prototype.PLAYER_PATH	= "player.php";
Camera.prototype.INFO_SPAN		= Main.INFO_SPAN;

Camera.prototype.GetID = function()
{	'use strict';
	return this.cameraID;
}

Camera.prototype.hasArg = function(arg)
{	'use strict';
	var cameraID=this.GetID();
	return (Main.args[cameraID] && Main.args[cameraID].indexOf(arg)>=0);
}

Camera.prototype.delArg = function(arg)
{	'use strict';
	var cameraID=this.GetID();
	if(Main.args[cameraID]) Main.args[cameraID].replace('/'+arg+'/','');
}

Camera.prototype.getPlayerWindow = function()
{	'use strict';
	var win=window.open('',this.getPlayerName());
	if(win && win.location.href=='about:blank'){
		win.close();
		win=null;
	}
	return win;
}

Camera.prototype.getPlayerName = function()
{	'use strict';
	return 'YO_Camera_Player_#'+this.GetID();
}

Camera.prototype.SetReloadArgs = function(args)
{	'use strict';
	if(!this.infoWindow) return;
	var status=(this.playerWindow)?'p':'';
	var r=this.infoWindow.GetStatus();
	if(r.minimum) status+='m';
	if(r.detail ) status+='d';
	if(r.sound  ) status+='s';
	if(!status) return;
	args[this.GetID()]=status;
}

Camera.prototype.UpdateInfoWindow = function(playTime,time)
{	'use strict';
	var elem=this.findInfoElem(playTime,time);
	if(!elem){
		this.noInfo=true;
		/*
		if(this.hasMovie){
			var last=this.moviePlayer.FindLast(time);
			var limit=(last)?last+this.INFO_SPAN:playTime-1;
			if(playTime>limit) this.closeInfoWindow();
		}
		*/
		if(this.hasMovie) this.closeInfoWindow();
		return null;
	}		
	this.noInfo=false;
	var latlng=null;
	if(this.infoWindow){
		if(elem.key!=time) return null;
		latlng=this.updateInfoWindow(time,elem.data);
	} else {
		var date=LocalDate(this.playTime);
		latlng=this.openInfoWindow(elem.key,elem.data);
		if(!this.infoWindow) return null;
	}
	this.prevTime=Movie.TimeToDate(time).getTime();
	return latlng;
}

Camera.prototype.findInfoElem = function(playTime,time)
{	'use strict';
	var elem=this.infoList.find_leq(time);
	if(!elem) return null;
	var limit=Movie.TimeToDate(elem.key).getTime()+this.INFO_SPAN;
	if(playTime>limit) return null;
	return elem;
}

Camera.prototype.openInfoWindow = function(time,info)
{	'use strict';
	Head.ClearAlert();
	var cameraID=this.GetID();
	var image=(this.hasMovie)?null:this.fixedImage;
	this.infoWindow=new InfoWindow(cameraID,image);
	var latlng=new google.maps.LatLng(info.lat,info.lon);
	var opt={
		position: latlng,
		content: "",
		zIndex: ++Camera.zIndex,
		disableAutoPan: Main.IS_RELOAD
	};
	var win=this.infoWindow.Open(opt);
	this.noInfo=false;	//念のため

	var self=this;	
	google.maps.event.addListener(win,'domready',function(){
		self.setupInfoWindow(time,info);
	});
	google.maps.event.addListener(win,'closeclick',function(){
		self.infoWindow=null;
		if(self.moviePlayer) self.moviePlayer.SetActive(null);
		if(self.noInfo && self.tracks){ // 自然消滅時以外は再表示時のため残しておく
			self.tracks.setMap(null);
			self.tracks=null;
		}
	});	
	if(this.moviePlayer) this.moviePlayer.SetActive(this.infoWindow);

	if(this.drawTracks && !this.tracks){
		var path=[];
		var start=this.infoList.first;		
		for(var elem=start;elem;elem=elem.next){
			if(elem.key>time) break;
			var info=elem.data;
			path.push(new google.maps.LatLng(info.lat,info.lon))
		}
		this.tracks = new google.maps.Polyline({
			path: path,
			strokeColor: this.trackColor, 
			strokeOpacity: "0.75" 
		});
		this.tracks.setMap(Main.map);
		this.times=0;
		this.dists=0;
	}
	
	return latlng;
}

Camera.prototype.setupInfoWindow = function(time,info)
{	'use strict';
	this.infoWindow.Setup();
	this.$soundBtn=(this.moviePlayer)?this.infoWindow.GetSoundButton():null;
	Main.SetSoundButton(this.GetID(),Main.IS_MOBILE);
	if(this.moviePlayer){
		var $canvas=this.infoWindow.GetCanvas();
		this.moviePlayer.SetupCanvas($canvas);
	}
	this.infoWindow.GetFrameWindow().onmousedown=this.setFrontInfo.bind(this);
	this.infoWindow.UpdateInfo(time,info);
	var sta={
		minimum : this.hasArg("m"),
		detail	: this.hasArg("d"), 
		sound	: this.hasArg("s")
	};
	this.infoWindow.SetStatus(sta);
	this.delArg("m");
	this.delArg("d");
	this.delArg("s");
	/*
	var $iwOuter=$('.gm-style-iw');
	$iwOuter.backgroundColor="#f00";
	var $iwBackground=$iwOuter.prev();
	$iwBackground.backgroundColor="#000";
	var $iwCloseBtn=$iwOuter.next();
	//$iwCloseBtn.hide();	//全部の×が消えてしまう
	*/
	
}

Camera.prototype.setFrontInfo = function()
{	'use strict';
	var win=this.infoWindow.window;
	if(win){
		if(win.getZIndex()==Camera.zIndex) return false;
		win.setZIndex(++Camera.zIndex);
		return true;
	}
	return false;
}

Camera.prototype.closeInfoWindow = function()
{	'use strict';
	if(this.infoWindow){
		this.infoWindow.Close();
		this.infoWindow=null;
		if(this.moviePlayer) this.moviePlayer.SetActive(null);
		if(this.tracks){
			this.tracks.setMap(null);
			this.tracks=null;
		}
		this.prevTime=0;
	}
}

Camera.prototype.updateInfoWindow = function(time,info)
{	'use strict';
	var latlng=new google.maps.LatLng(info.lat,info.lon);
	if(this.tracks){
		var path=this.tracks.getPath();
		var prev=(path.length>0)?path.getAt(path.length-1):null;
		path.push(latlng);
		this.tracks.setPath(path);
		if(prev){
			var dist=google.maps.geometry.spherical.computeDistanceBetween(prev,latlng);
			var now=Movie.TimeToDate(time).getTime();
			var delta=(now-this.prevTime)/1000;
			this.times+=delta;
			this.dists+=dist;
			this.infoWindow.SetTracks(this.times,this.dists,(delta!=0)?dist/delta:0);
		}
	}
	var win=this.infoWindow.window;
	if(win){
		win.setPosition(latlng);
		this.infoWindow.UpdateInfo(time,info);
	}
	return latlng;
}

Camera.prototype.OpenPlayer = function(playTime)
{	'use strict';	
	var args=[];
	args['id']=this.GetID();
	if(playTime){
		Args.SetPlayTime(args,playTime);
	}
	var query=MakeQuery(args);
		
	var height=600;
	switch(Main.BROWSER){
	case 'ie':		height=584;	break;
	case 'firefox':	height=594;	break;
	}
	var size='width=900,height='+height;
	
	this.playerWindow=window.open(
		this.PLAYER_PATH+'?'+query,
		this.getPlayerName(),
		size,
		'menubar=no,status=no,scrollbars=no'
	);
	
	return false;
}

Camera.prototype.SetPlayerStatus = function(ready,mute)	// called by player...
{	'use strict';
	if(ready){
		this.playerWindow=this.getPlayerWindow();
	} else {
		this.playerWindow=null;
		if(!Main.IS_MOBILE) this.SetMute(mute);
	}
	return (this.moviePlayer)?this.moviePlayer.mute:false;
}

Camera.prototype.GetPreloadFirst = function()
{	'use strict';
	var player=this.moviePlayer;
	if(!player || !player.movieList.first) return 0;
	var key=player.movieList.first.key;
	if(!key) return 0;
	return Movie.TimeToDate(key).getTime();
}

Camera.prototype.GetPreloadLast = function()
{	'use strict';
	var player=this.moviePlayer;
	if(!player || !player.movieList.last) return Number.MAX_VALUE;
	var key=player.movieList.last.key;
	if(!key) return Number.MAX_VALUE;
	return Movie.TimeToDate(key).getTime();
}

Camera.prototype.SetSoundStatus = function(mute,playTime)
{	'use strict';
	var player=this.moviePlayer;
	if(!player) return mute;
	if(Main.IS_MOBILE && !player.soundPlayer.IsPlaying()){
		var done=player.CheckSound(playTime,true);
		Main.SetSoundButton(this.GetID(),!done);
		return !done;
	}
	this.SetMute(mute);
	return mute;
}

Camera.prototype.SetMute = function(mute)	// called by self or player...
{	'use strict';
	var player=this.moviePlayer;
	if(!player) return;
	player.SetMute(mute);
	Main.SetSoundButton(this.GetID(),mute);
}
