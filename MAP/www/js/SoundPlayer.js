/*
 * Coded by kojima@sofrio.com
 *	2015/10/28
 */

//!	e-mobile 端末で音が出なかったため、コメントアウト

SoundPlayer = function(ID){
	'use strict';
	this.cameraID=ID;
	this.audio=null;
    this.start=0;		// second
	this.toSeek=-1; 
    this.playing=false;     
    this.paused=false;
    this.volume=1;
};

SoundPlayer.prototype.START_DELAY			= 0.050;						// second
SoundPlayer.prototype.ADJUST_MARGIN			= (Main.IS_MOBILE)?0.100:0.005;	// second
SoundPlayer.prototype.FORCE_SEEK_TRIGGER	= (Main.IS_MOBILE)?0.100:0.200;	// second
SoundPlayer.prototype.FORCE_SEEK_LIMIT		= 1;							// second

SoundPlayer.prototype.Preload = function(url)
{	'use strict';
	var audio=new Audio;
	audio.autoplay=false;
	audio.preload='auto';
    audio.type='audio/mp3';
    audio.src =url;
//!	audio.load();
    return audio;
}

SoundPlayer.prototype.GetSrc = function()
{	'use strict';
	return (this.audio)?this.audio.src:""; 
}

SoundPlayer.prototype.playStart = function(audio,start)
{	'use strict';
//	if(!this.audio) return;
	this.playing=false;
	var prior=this.audio;
	this.audio=audio;
	this.start=start;
	this.audio.volume=0;//this.volume;
	var self=this;
    var fadeIn=function(){
	//	console.log("fadeIn");
		if(self.fadeIn()){
			self.audio.removeEventListener("timeupdate",fadeIn,false);
		}
    };
	this.audio.addEventListener("timeupdate",fadeIn,false);
    if(Main.IS_MOBILE){
		var resetSoundButton=function(){
		//	console.log("resetBtn");
			self.audio.removeEventListener("ended",resetSoundButton,false);
			Main.SetSoundButton(self.cameraID,true);
		};
		this.audio.addEventListener("ended",resetSoundButton,false);
	}
	this.audio.play();
	var delay=(this.toSeek>0)?"-"+this.toSeek.toFixed(3):"";
 	if(Main.DEBUG>1) console.log("sound play started: #"+this.cameraID+" "+this.audio.src+" @"+SoundPlayer.secString(this.start)+delay);
 	if(prior && prior!=this.audio){
		if(!prior.ended){
			var self=this;
			var fadeOut=function(){
			//	console.log("fadeOut");
				prior.removeEventListener("timeupdate",fadeOut,false);
				prior.volume=0;
				prior.pause();
				prior=null;
			};
			prior.addEventListener("timeupdate",fadeOut,false);
		} else {
			prior=null;
		}
 	}
	if(this.paused) this.audio.pause();
	Main.SetSoundButton(this.cameraID,false);
}

SoundPlayer.prototype.fadeIn = function()
{	'use strict';
	if(!this.audio) return false;
	this.playing=true;
    if(this.toSeek>=0){
		if(!this.Seek(this.toSeek)) return false;
		this.toSeek=-1;
    }
    this.audio.volume=this.volume;
    return true;
}

SoundPlayer.secString = function(sec)
{	'use strict';
	var date=new Date(sec*1000);
	return date.toLocaleTimeString()+'.'+("00"+date.getMilliseconds()).slice(-3);
}

SoundPlayer.prototype.Play = function(audio,start,delay)
{	'use strict';
	if(!audio) return false;
	if(Main.BROWSER=='chrome'){
		//if(!Main.args['interacted']){
			var btn=(Main.cameraManager.timeShift)?"指定時刻に移動":"現在時刻に移動"
			//alert("Chromeの仕様変更により、ユーザー操作がないと音声が出なくなりました。\n最上部の ["+btn+"] のボタンを押せば、音声が出るようになります。");
			Head.Alert("音声が出ない場合は ["+btn+"] のボタンで再表示してください。");
		//}
	}
	//console.log("Play "+start+" "+delay);
	delay-=this.START_DELAY;
 	start=Number(start)+delay;
	if(delay>0){
		setTimeout(this.playStart.bind(this,audio,start),delay*1000);
 		if(Main.DEBUG>1) console.log("sound play queued : #"+this.cameraID+" "+audio.src+" @"+SoundPlayer.secString(start)+"+"+delay.toFixed(3));
	} else {
		if(delay<0) this.toSeek=-delay;
		//if(this.toSeek>61) debugger;
		this.playStart(audio,start);
    }
    return true;
}

SoundPlayer.prototype.Stop = function()
{	'use strict';
 //	if(!this.IsPlaying()) return;
	if(!this.audio) return;
	if(typeof(this.audio.pause)=='function') this.audio.pause();
	this.audio.currentTime=0;
    this.paused=false;     
}

SoundPlayer.prototype.Pause = function()
{	'use strict';
    if(!this.IsPlaying()) return;
	this.audio.pause();
    this.paused=true;     
}

SoundPlayer.prototype.Restart = function()
{	'use strict';
    if(!this.IsPlaying()) return;
	this.audio.play();
    this.paused=false;     
}

SoundPlayer.prototype.IsPlaying = function()
{	'use strict';
	if(!this.audio) return false;
	if(this.audio.ended) this.playing=false;
    return this.playing;
}

SoundPlayer.prototype.Adjust = function(time)
{	'use strict';
    if(!this.IsPlaying()) return false;
	time-=this.start;   
	//console.log("Adjust "+time);
	if(time<0){
		this.audio.pause();
		return true;
	}
	var audioTime=this.audio.currentTime;
	var delta=time-audioTime;
	if(delta<-this.FORCE_SEEK_TRIGGER || +this.FORCE_SEEK_TRIGGER<delta){
		if(-this.FORCE_SEEK_LIMIT<delta && delta<+this.FORCE_SEEK_LIMIT) time+=delta/2;
		console.log("adjusting audio.currentTime from "+audioTime+" to "+time);
		this.Seek(time);
		return true;
	}
	var rate=1;
	if(delta<-this.ADJUST_MARGIN || this.ADJUST_MARGIN<delta){
		rate+=delta/32;
	}
	if(this.audio.playbackRate!=rate){
		this.audio.playbackRate=rate;
	//	console.log("adjusting audio.playbackRate to "+rate+" @"+audioTime+"->"+time);
	}
	return false;
}

SoundPlayer.prototype.Seek = function(pos)
{	'use strict';
	if(!this.audio) return false;
	if(pos<0) pos=0;
    if(window.HTMLAudioElement){
        try{
			if(Main.DEBUG>2) console.log("SoundPlayer.Seek(): seeking "+pos.toFixed(3)+"...")
            this.audio.currentTime=pos;
			if(Main.DEBUG>2) console.log("Done.")
            return true;
        }
        catch(e){
	    	console.error("@SoundPlayer.Seek("+pos+"): "+e);
        }
    }
    return false;
}

SoundPlayer.prototype.Tell = function()
{	'use strict';
    return (this.audio && this.audio.ended)?-1:this.audio.currentTime;
}

SoundPlayer.prototype.Rate = function()
{	'use strict';
    return (this.audio)?this.audio.playbackRate:0;
}

SoundPlayer.prototype.SetVolume = function(volume)
{	'use strict';
	this.volume=volume;
	if(this.audio) this.audio.volume=this.volume;
}

SoundPlayer.prototype.GetAudioTime = function()
{
    if(!this.IsPlaying()) return 0;
    return this.start+this.audio.currentTime;
}
