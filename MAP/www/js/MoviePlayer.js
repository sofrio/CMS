/*
 * Coded by kojima@sofrio.com
 *	2015/11/03
 */

Movie = function(){
	'use strict';
	this.usecList=[];
	this.loaded=false;
};

Movie.LOAD_ERROR	= "動画が取得できません。";

Movie.GetMarkKey= function(date)
{	'use strict';
    return date.YY+"/"+date.MM+"/"+date.DD+" "+date.hh+":"+date.mm;
}

Movie.GetTimeKey = function(playTime)
{	'use strict';
	var date=FormatDate(playTime);
	return Movie.GetMarkKey(date)+":"+date.ss;
}

Movie.TimeToDate = function(timekey)
{	'use strict';
	if(!timekey) return null;
	return new Date(timekey);
	/*
	var ymd_hms=timekey.split(" ");
	if(ymd_hms.length!=2) return null;
	var ymd=ymd_hms[0].split("/");
	var hms=ymd_hms[1].split(":");
	if(hms.length<3) hms[2]=0;
	return new Date(ymd[0],ymd[1]-1,ymd[2],hms[0],hms[1],hms[2]);
	*/
}

MoviePlayer = function(cameraID){
	'use strict';	
	this.oneMode=false;	// 1秒に1画像

	this.cameraID=cameraID;
	this.movieList=new OrderedList(true);
	this.waitList=0;
//	this.predrawOK=false;

	this.$loading=null;
	this.infoWindow=null;
	this.width=0;
	this.height=0;
	this.canvas=null;
	this.canvasOK=false;
	this.queued=[];
	this.nQueued=0;

	this.soundPlayer=new SoundPlayer(this.cameraID);
	this.active=true;
	this.mute=false;
	this.volume=1;
	this.nAdjust=0;
	this.nNoData=0;
	this.nNoSound=0;
	this.alerted=false;
};

MoviePlayer.idSoundPlaying			= ""

MoviePlayer.prototype.LIST_PATH		= "movielist.php";
MoviePlayer.prototype.RECORD_PATH	= "record-data/"; //録画画像
MoviePlayer.prototype.DETECT_PATH	= "detect-data/"; //処理画像
MoviePlayer.prototype.MOVIE_PATH	= 


MoviePlayer.prototype.PREDRAW		= false;
MoviePlayer.prototype.PRELOAD_COUNT	= 5;
MoviePlayer.prototype.LIST_INTERVAL	= Main.LIST_INTERVAL;
MoviePlayer.prototype.PRE_ADJUST	= (Main.IS_PLAYER)?2:0;
MoviePlayer.prototype.NO_DATA_ALERT	= Main.INFO_SPAN/Main.RENDER_INTERVAL;

$(function(){ 'use strict';
var $debug=$("#debug-info");
MoviePlayer.prototype.$image		= $("#image",$debug);
MoviePlayer.prototype.$sound		= $("#sound",$debug);
});

MoviePlayer.prototype.Setup = function(url,oneMode,$loading)
{	'use strict';
	this.listPath=url+this.LIST_PATH;
	this.moviePath=url+((Main.detect)?this.DETECT_PATH:this.RECORD_PATH);
	this.pathSize=this.moviePath.length+this.cameraID.toString().length+1;
    this.oneMode=oneMode;
	this.$loading=$loading;
}

MoviePlayer.prototype.SetupCanvas = function($canvas)
{	'use strict';
	this.width =$canvas.width ();
	this.height=$canvas.height();
	var canvas=$canvas[0];
	if(!canvas || !canvas.getContext) return false;
	this.canvas=canvas.getContext('2d');
	this.canvasOK=false;
	return true;
}

MoviePlayer.prototype.GetMovieList = function(listTime)
{	'use strict';
	var date=FormatDate(listTime);
    var markKey=Movie.GetMarkKey(date);
    var mark=this.movieList.find(markKey);
    if(mark) return;
    this.movieList.insert(markKey,true);
 	console.log("preloading #"+this.cameraID+" "+this.moviePath+this.cameraID+"/"+markKey);
 
	var args="id="+this.cameraID+"&date="+markKey;
	if(this.oneMode) args+="&one=true";
	if(Main.detect) args+="&detect=true";
	var movielist=this.listPath+"?"+args;
	
	this.waitList++;
	var self=this;
	/*
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		'use strict';
		console.log("readyState: "+this.readyState+", status: "+this.status);
		//console.log(this.response);
		try{
			var json = JSON.parse(this.response);
			if(self.alerted){
				Head.Alert("");
				self.alerted=false;
			}
			self.saveMovieList(json,markKey);
		} catch(e){
			'use strict';
			var url=encodeURI(movielist);
			console.error("MoviePlayer.GetMovieList("+listTime+") @"+url);
			console.log(this.response);
			Head.Alert("カメラ#"+self.cameraID+"の"+Movie.LOAD_ERROR);
			self.alerted=true;
			if(self.canvasOK){
				if(!Main.IS_PLAYER && self.infoWindow) self.infoWindow.ShowCanvas(false);
				self.canvasOK=false;
			}
			self.waitList--;
		}
	};
	xhr.open("GET", movielist, true);
	xhr.send();	
	*/
	$.getJSON(movielist)
	.success(function(json){
		'use strict';
		//console.log("MoviePlayer.GetMovieList("+listTime+"): OK");
		if(self.alerted){
			Head.Alert("");
			self.alerted=false;
		}
		self.saveMovieList(json,markKey);
	})
	.error(function(jqXHR,textStatus,errorThrown){
		'use strict';
		var url=encodeURI(movielist);
		console.error("MoviePlayer.GetMovieList("+listTime+"): "+textStatus+" @"+url);
		Head.Alert("カメラ#"+self.cameraID+"の"+Movie.LOAD_ERROR);
		self.alerted=true;
		if(self.canvasOK){
			if(!Main.IS_PLAYER && self.infoWindow) self.infoWindow.ShowCanvas(false);
			self.canvasOK=false;
		}
		self.waitList--;
	});
}

//画像情報を配列に格納
MoviePlayer.prototype.saveMovieList = function(json,markKey)
{	'use strict';
//	console.info(json);
	var n=0;
    for(var time in json){
		var movie=new Movie();
		var jsontime=json[time];
        for(var usec in jsontime){
			movie.usecList[usec]=this.moviePath+jsontime[usec];
			n++;
        }
        this.movieList.insert(time,movie);
    }
	this.waitList--;
//	console.info(this.movieList);
	if(n==0) console.warn("no data: #"+this.cameraID+" "+markKey);	
    return n;
}

MoviePlayer.prototype.FindLast = function(time)
{	'use strict';
	var last=null;
	for(var elem=this.movieList.first;elem;elem=elem.next){
		if(elem.key>=time) break;
		last=Movie.TimeToDate(elem.key).getTime()
	}
	return last;
}

MoviePlayer.prototype.Preload = function(playTime/*,sound*/,predraw)
{	'use strict';
	if(this.waitList>0 || !this.movieList) return false;

	var time=Movie.GetTimeKey(playTime);	
	var nTime=0,nMovie=0,nNG=0;
	for(var e=this.movieList.first;e;e=e.next){
		var movie=e.data;
		if(!movie || typeof(movie)=='boolean') continue;
		nMovie++;		
		var ok=true;
		if(!movie.loaded && !IsEmpty(movie.usecList)){
			var usecList=movie.usecList;
			for(var usec in usecList){
				var obj=usecList[usec];
				if(typeof(obj)=='string'){
					var obj=this.preload(obj,e.key<time/*,!sound*/);
					if(!obj) continue;
					usecList[usec]=obj;
					ok=false;
				} else {
					if(obj instanceof Image){
						if(obj.complete){
							if(this.PREDRAW || predraw) this.predraw(obj);
						} else {
							ok=false;
						}
					}
				}
			}
		}
		if(ok){
			movie.loaded=true;
		} else {
			nNG++;
		}
		if(e.key>=time){
			if(++nTime>=this.PRELOAD_COUNT) break;
		}
	}
	if(nMovie==0) return null;
	return (nNG==0);
}

MoviePlayer.prototype.preload = function(src,ignoreImage/*,ignoreSound*/)
{	'use strict';
	if(this.isImage(src)){
		if(ignoreImage) return null;
		var img=new Image();
		img.src=src;
		Main.nRsrc++;
		return img;
	}
	if(this.isSound(src)){
	//	if(ignoreSound) return null;
		var audio=this.soundPlayer.Preload(src);
		Main.nRsrc++;
		return audio;
	}
	return null;
}

MoviePlayer.prototype.isImage = function(url)
{	'use strict';
	return url.match(/\.jpg$/);
}

MoviePlayer.prototype.isSound = function(url)
{	'use strict';
	return url.match(/\.mp3$/);
}

MoviePlayer.prototype.predraw = function(img)
{	'use strict';
	if(!this.predrawOK && this.infoWindow && this.canvas){
		if(!this.canvasOK){
			if(!Main.IS_PLAYER && this.infoWindow) this.infoWindow.ShowCanvas(true);
			this.canvasOK=true;
		}
		this.canvas.drawImage(img,0,0,this.width,this.height);
		this.predrawOK=true;
	}
}

//playTimeまでに音声データがあれば再生
MoviePlayer.prototype.CheckSound = function(playTime,mobileOK)
{	'use strict';
	if(!this.active) return false;
	if(Main.IS_MOBILE && !mobileOK) return false;
	var audio=null;
	var audioTime=null;
	var msec=0;	
	var time=Movie.GetTimeKey(playTime);	
	//console.log("CheckSound "+time);
	for(var e=this.movieList.first;e;e=e.next){
		if(e.key>=time) break;
		//console.log("\t"+e.key);
		var movie=e.data;
		if(!movie || typeof(movie)=='boolean' || IsEmpty(movie.usecList)) continue;
		var usecList=movie.usecList;
		for(var usec in usecList){
			var obj=usecList[usec];
			if(typeof(obj)=='string'){
				obj=this.preload(obj,true/*,false*/);
				if(!obj) continue;
				usecList[usec]=obj;
			}
			if(obj instanceof Audio){
				//console.log("\t\t"+usec);
				audio=obj;
				audioTime=e.key;
				msec=usec/1000;
			}
		}
	}
	if(!audio){
	//	debugger;
		if(this.soundPlayer.audio) this.soundPlayer.audio.pause();
		console.warn("missing sound #"+this.cameraID+" "+time);
		return false;
	}

	var now=playTime/1000;	
	if(audio==this.soundPlayer.audio){
		this.soundPlayer.Adjust(now);
		if(!this.soundPlayer.paused) this.soundPlayer.audio.play();
	} else {
		this.soundPlayer.SetVolume(0);
		this.nAdjust=0;
		var delay=this.getSecondFromTimeKey(audioTime)-now;//this.getSecondFromTimeKey(time);
		delay+=msec/1000;
		this.soundPlayer.Play(audio,now,delay);	
	}
	return true;
}

MoviePlayer.prototype.getSecondFromTimeKey = function(time)
{	'use strict';
	return Movie.TimeToDate(time).getTime()/1000;
}

//画像をhtml5のキャンバス機能を使って描画　(パラパラ画像を滑らかに表示させるため)
MoviePlayer.prototype.Render = function(playTime)
{	'use strict';
	var r=false;
	var time=Movie.GetTimeKey(playTime);
	if(Main.DEBUG>2) console.log(NowStr()+" MoviePlayer.Render  time="+time);
	var now=playTime/1000;
	/*
	あまり同期しない上、次のsoundが開始しない
	var audioTime=this.soundPlayer.GetAudioTime();
	if(audioTime>0){
		var delta=audioTime-now;
		if(delta<-this.soundPlayer.FORCE_SEEK_TRIGGER || +this.soundPlayer.FORCE_SEEK_TRIGGER<delta){
			this.soundPlayer.Adjust(now);
		} else {
			now+=delta;
			playTime=now*1000;
	/	}
	}
	*/
	this.soundPlayer.Adjust(now);
	if(this.nAdjust++==this.PRE_ADJUST){
		var player=this.soundPlayer;
		if(this.mute){
			player.volume=this.volume;
		} else {
			player.SetVolume(this.volume);
		}
		if(Main.IS_PLAYER) Main.SetSoundButton(this.cameraID,this.mute);
		r=true;
	}
	if(!this.mute && this.soundPlayer.volume!=this.volume) this.soundPlayer.SetVolume(this.volume);

	if(Main.DEBUG>1) console.log("nQueued="+this.nQueued+" on "+time);
	var movie=this.movieList.find(time);
	if(movie && !IsEmpty(movie.usecList)){
		if(this.$loading) this.$loading.hide();
		if(!movie.loaded){
			if(Main.DEBUG>0) console.warn("not preloaded: #"+this.cameraID+" "+time);
		}
		var usecList=movie.usecList;
		for(var usec in usecList){
			var obj=usecList[usec];
			if(typeof(obj)=='string'){
				var src=obj;
				obj=this.preload(src,false/*,false*/);
				if(!obj){
					usecList[usec]=null;
					delete usecList[usec];
					continue;
				}
				usecList[usec]=obj;
				if(Main.DEBUG>1) console.warn("not preloaded: #"+this.cameraID+" "+src);
			}
			if(obj instanceof Image){
				if(!this.canvasOK){
					if(!Main.IS_PLAYER && this.infoWindow) this.infoWindow.ShowCanvas(true);
					this.canvasOK=true;
				}
				var img=obj;			
				this.queued[img.src]=setTimeout(this.draw.bind(this,img),usec/1000);
				this.nQueued++;
			} else
			if(obj instanceof Audio){
				if(!Main.IS_MOBILE){
					var delay=usec/1000000;
					this.soundPlayer.Play(obj,now,delay);
				}
			} else {
				console.error("unknown object: #"+this.cameraID+" "+obj);
			}
		}
		this.nNoData=0;
	} else {
		if(this.$loading) this.$loading.show();
		if(Main.DEBUG>0){
			if(this.$image) this.$image.text("");
    		if(Main.DEBUG>1) console.warn("no movie: #"+this.cameraID+" "+time);
    	}
		if(/*Main.IS_PLAYER && */this.nNoData++>this.NO_DATA_ALERT){
			Head.Alert("カメラ#"+this.cameraID+"の"+Movie.LOAD_ERROR);
			this.nNoData=0;
		}
	}
	
	if(Main.DEBUG>0){
		if(this.soundPlayer.IsPlaying()){
			MoviePlayer.idSoundPlaying=this.cameraID
			this.nNoSound=0;
			var text="#"+this.cameraID+" "+this.soundPlayer.GetSrc().slice(this.pathSize-1)
				+" (@"+this.soundPlayer.Tell().toFixed(3)+" "+(this.soundPlayer.Rate()*100).toFixed(1)+"%)";
			this.$sound.text(text);
		} else {
			if(Main.IS_PLAYER && this.nNoSound++>4){
			//	debugger;
				console.warn("no sound for "+this.nNoSound+" sec...");
				this.nNoSound=0;
				if(MoviePlayer.idSoundPlaying==this.cameraID){
					MoviePlayer.idSoundPlaying="";
					this.$sound.text("");
				}
			}
		}
	}

	//巻き戻し用に過去2*this.LIST_INTERVAL分は保持しておく
	this.freeMovieList(playTime-2*this.LIST_INTERVAL);
	
	return r;
}

MoviePlayer.prototype.draw = function(img)
{	'use strict';
	if(this.canvas){
		if(img.complete){
			this.canvas.drawImage(img,0,0,this.width,this.height);
			if(Main.DEBUG>0 && this.$image) this.$image.text("#"+this.cameraID+" "+img.src.slice(this.pathSize-1));
		} else {
			if(Main.DEBUG>0) console.warn("incomplete: #"+this.cameraID+" "+img.src);
		}
	}
	this.queued[img.src]=null;
	delete this.queued[img.src];
	this.nQueued--;
}

MoviePlayer.prototype.freeMovieList = function(freeTime)
{	'use strict';
	var time=Movie.GetTimeKey(freeTime);	
	while(this.movieList.first && this.movieList.first.key<=time){
		if(Main.DEBUG>1) console.log("freeing movie..."+this.cameraID+"["+this.movieList.first.key+"]");
		var elem=this.movieList.shift();
		if(!elem) break;
		var movie=elem.data;
		if(!movie || typeof(movie)=='boolean' || IsEmpty(movie.usecList)) continue;
		var usecList=movie.usecList;
		for(var usec in usecList){
			usecList[usec]=null;
			delete usecList[usec];
		}
		movie=null;	//念のため
		elem=null;	//念のため
	}		
}

MoviePlayer.prototype.ClearRender = function()
{	'use strict';
	while(this.nQueued>0){
		var q=this.queued.shift;
		if(q) clearTimeout(q);
		this.nQueued--;
	}
}

MoviePlayer.prototype.Pause = function()
{	'use strict';
	this.soundPlayer.Pause();
}

MoviePlayer.prototype.Restart = function(playTime)
{	'use strict';
	this.soundPlayer.SetVolume(0);
	this.soundPlayer.Adjust(playTime/1000);
	this.soundPlayer.Restart();
}

MoviePlayer.prototype.SetActive = function(infoWindow)
{	'use strict';
	this.active=(infoWindow!=null);
	this.infoWindow=infoWindow;
	if(this.active){
		this.Restart();
	} else {
		this.soundPlayer.Stop();
	}	
}

MoviePlayer.prototype.SetMute = function(mute)
{	'use strict';
    this.mute=mute;
	this.soundPlayer.SetVolume((mute)?0:this.volume);
	if(!mute && Main.IS_MOBILE && this.soundPlayer.audio) this.soundPlayer.audio.play();
}

MoviePlayer.prototype.SetVolume = function(volume)
{	'use strict';
	this.volume=volume;
	if(!this.mute) this.soundPlayer.SetVolume(volume);
}
