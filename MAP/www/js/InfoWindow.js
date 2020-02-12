/*
 * Coded by kojima@sofrio.com
 *	2015/11/25
 */

InfoWindow = function(cameraID,image){
	'use strict';
	this.cameraID=cameraID;
	this.window=null;
	this.$body=null;
	this.$detail=null;
	this.$sound=null;
	this.$info=null;
	this.$setup=null;
	this.time=0;
	this.info=null;
	this.image=image;
	this.times=0;
	this.dists=0;
	this.speed=0;

};

InfoWindow.WIDTH	= 253;
InfoWindow.HEIGHT	= 213;
InfoWindow.CANVAS_WIDTH	= 200;
InfoWindow.TABLE_HEIGHT	= 150;

InfoWindow.FitBounds = function(bounds)
{
//	Main.map.fitBounds(bounds);
	
	var $map=Main.$map;
	var W=$map.width ();
	var H=$map.height();
	$map.width (W-InfoWindow.WIDTH );
	$map.height(H-InfoWindow.HEIGHT);

	var map=Main.map;
	map.fitBounds(bounds);

	$map.width (W);
	$map.height(H);
	var c=bounds.getCenter();
	var dLat=InfoWindow.getPixLat(map.getZoom())*InfoWindow.HEIGHT;
	map.panTo(new google.maps.LatLng(c.lat()+dLat,c.lng()));
}

InfoWindow.getPixLat = function(zoom)
{
//	9 => (0.001373291015625,0.0013732794172106866)
	var lng=0.001373291015625    *Math.pow(1/2,zoom-9);
	var lat=0.0013732794172106866*Math.pow(1/2,zoom-9);
	return lat;
}

InfoWindow.prototype.Open = function(opt)
{	'use strict';
	opt.content=this.getContentString();
//	console.log(contentString);
	this.window=new google.maps.InfoWindow(opt);
	if(!this.window){
		console.error("can not create info window for #"+this.cameraID);
		return null;
	}
	this.window.open(Main.map);
	return this.window;
}

InfoWindow.prototype.Close = function()
{	'use strict';
	if(this.window){
		this.window.close();
		this.window=null;
	}
}
	
//吹き出し作成用のHTML文字列
InfoWindow.prototype.getContentString = function()
{	'use strict';
	var name,cs=[],i=0;
	name=(Main.NPTS)?"GPS":"Camera";
//	cs[i++]='<table width="100%"><tr><td>'
	cs[i++]='<a "javascript:void(0)" id="title_'+this.cameraID+'">'+name+' #'+this.cameraID+'</a>'
//	cs[i++]='</td><td align=right>'
//	cs[i++]=this.setupLink()
//	cs[i++]='</td></tr></table>'
	cs[i++]='<div id="body_'+this.cameraID+'"><table><tr><td>'
	if(Main.BROWSER=='chrome'){
		cs[i++]='<table><tr><td>'
	}
	if(this.image){
		cs[i++]=	'<a "javascript:void(0)" id="open">'
		cs[i++]=	  '<img src="'+this.image+'"/>'
		cs[i++]=	'</a>'
		cs[i++]=	'<div id="info" style="display:none;">'
		cs[i++]=	'</div>'
	} else {
		cs[i++]=	'<div id="loading" style="background-color:#000;">'
		cs[i++]=		'<table width="'+InfoWindow.CANVAS_WIDTH+'" height="'+InfoWindow.TABLE_HEIGHT+'"><tr><td align="center">'
		cs[i++]=		'<img src="./img/loading.gif" width="72"/>'
		cs[i++]=		'</td></tr></table>'
		cs[i++]=	'</div>'
		cs[i++]=	'<a "javascript:void(0)" id="open">'
		cs[i++]=		'<canvas id="canvas" width="'+InfoWindow.CANVAS_WIDTH+'" style="display:none;"/>'
		cs[i++]=	'</a>'
		cs[i++]=	'<div id="info" style="display:none;">'
		cs[i++]=	'</div>'
		cs[i++]=	'<table width="100%">'
		cs[i++]=	  '<tr>'
		cs[i++]=		'<td align=left>'
		cs[i++]=		  '<button id="detail" class="btn btn-default btn-xs">詳細</button>'
		cs[i++]=		'</td>'
		cs[i++]=		'<td>'
		cs[i++]=		  '<div align=center>'
		cs[i++]=			'<a "javascript:void(0)"                   id="bwd"  ><img src="./img/bwd.png"   width="30"/></a>'
		cs[i++]=			'<a "javascript:void(0)" class="pause-btn" id="pause"><img src="./img/pause.png" width="30"/></a>'
		cs[i++]=			'<a "javascript:void(0)"                   id="fwd"  ><img src="./img/fwd.png"   width="30"/></a>'
		cs[i++]=		  '</div>'
		cs[i++]=		'</td><td align=right>'
		cs[i++]=		  '<button class="btn btn-default btn-xs" id="sound"></button>'
		cs[i++]=		'</td>'
		cs[i++]=	  '</tr>'
		cs[i++]=	'</table>'
	}
	if(Main.BROWSER=='chrome'){
		cs[i++]='</td><td>&nbsp;&nbsp;&nbsp;</td></tr></table>'
	}
	cs[i++]='</div>'
	return cs.join('');
}

InfoWindow.prototype.setupLink = function()
{
	return "<a href=\"javascript:window.open('setup.php?id="+this.cameraID+"', 'setup', 'menubar=no, toolbar=no, scrollbars=yes');\">編集</a>";
}

//吹き出し中の要素の動作設定
InfoWindow.prototype.Setup = function()
{	'use strict';
	this.$body  =$("#body_"+this.cameraID);
	this.$detail=$("#detail",this.$body);
	this.$sound =$("#sound" ,this.$body);
	this.$info  =$("#info"  ,this.$body);
	this.$setup =$("#setup");
	
	var self=this;
	$("#title_"+this.cameraID).on("click",function(){
		'use strict';
		self.setMinimum(self.$body.is(':visible'));
	});
	$("#loading",this.$body).on("click",function(){
		'use strict';
		Head.Alert("動画が検出できません。");
	//	console.log("no data: #"+ self.cameraID);
	});
	$("#open",this.$body).on("click",function(){
		'use strict';
		if(self.image){
			self.setDetail(self.$info.is(':hidden'));
		} else {
			Main.cameraManager.OpenPlayer(self.cameraID);
		}
	});
	this.$detail.on("click",function(){
		'use strict';
		self.setDetail(self.$info.is(':hidden'));
	});
	
	InfoWindow.SetupControls($("#bwd",this.$body),$("#pause",this.$body),$("#fwd",this.$body),this.$sound,this.cameraID);
}

InfoWindow.SetupControls = function($bwd,$pause,$fwd,$sound,cameraID)
{	'use strict';
	$bwd.on("click",function(){
		'use strict';
		Main.cameraManager.Bwd();
	});
	$pause.on("click",function(){
		'use strict';
		Main.cameraManager.SetPause(!Main.cameraManager.paused);
		var img=(Main.cameraManager.paused)?"./img/play.png":"./img/pause.png";
		$(".pause-btn").find("img").attr("src",img);
	});		
	$fwd.on("click",function(){
		'use strict';
		Main.cameraManager.Fwd();
	});
	$sound.on("click",function(){
		'use strict';
		var mute=Main.cameraManager.SetSoundStatus(cameraID,$(this).text()=="消音");
	});
}

InfoWindow.prototype.setMinimum = function(mini)
{	'use strict';
	if(this.$body){
		if(mini){
		//	this.$body.hide();
			this.$body.fadeOut('fast');
			this.$setup.hide();
		}else{
		//	this.$body.show();
			this.$body.fadeIn('slow');
			this.$setup.show();
		}
	}
}

InfoWindow.prototype.setDetail = function(show)
{	'use strict';
	if(this.$info){
		if(show){
			this.updateInfo();
		//	this.$info.show();
			this.$info.fadeIn('slow');
			this.$detail.text("省略");
		}else{
		//	this.$info.hide();
			this.$info.fadeOut('fast');
			this.$detail.text("詳細");
		}
	}
}

InfoWindow.prototype.setSound = function(mute)
{	'use strict';
	var mute=Main.cameraManager.SetSoundStatus(this.cameraID,mute);
}
	
InfoWindow.prototype.GetFrameWindow = function()
{	'use strict';
	var info=this.$body[0];
//	console.info(info);
//	console.info(info.parentElement);
//	console.info(info.parentElement.parentElement);
//	console.info(info.parentElement.parentElement.parentElement);
//	console.info(info.parentElement.parentElement.parentElement.parentElement);
//	console.info(info.parentElement.parentElement.parentElement.parentElement.parentElement);
//	console.info(info.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement);
	var win=info.parentElement.parentElement.parentElement.parentElement;
//	console.log(win);
	return win;
}

InfoWindow.prototype.GetCanvas = function()
{	'use strict';
	return $("#canvas",this.$body);
}

InfoWindow.prototype.GetSoundButton = function()
{	'use strict';
	return this.$sound;
}

//canvaの出現		
InfoWindow.prototype.ShowCanvas = function(show)
{	'use strict';
	if(show){
		$("#loading",this.$body).hide();
		$("#canvas" ,this.$body).show();
	} else {
		$("#canvas" ,this.$body).hide();
		$("#loading",this.$body).show();
	}
}

//吹き出しの詳細部情報の更新		
InfoWindow.prototype.UpdateInfo = function(time,info)
{	'use strict';
	this.time=time;
	this.info=info;
	if(this.$info.is(':visible')) this.updateInfo();
}

InfoWindow.prototype.updateInfo = function()
{	'use strict';
	var st=[],i=0;
	st[i++]='<table width="100%"><tr>';
	st[i++]=  '<td>'+this.time+'&nbsp;</td>';
	if(this.image){
		st[i++]=  '<td align=right>'+this.setupLink()+'</td></td>';
	}
	st[i++]='</tr></table>';
	st[i++]='<table><tr>';
	st[i++]=  '<td>経度:'+Number(this.info.lon).toFixed(5)+'°&nbsp;</td>';
	st[i++]=  '<td>緯度:'+Number(this.info.lat).toFixed(5)+'°</td>';
	if(Main.NPTS){
		st[i++]='</tr><tr>';
		st[i++]=  '<td>方向:'+Number(this.info.ori).toFixed(0)+'°&nbsp;</td>';
		st[i++]=  '<td>傾き:'+Number(this.info.ang).toFixed(0)+'°</td>';
		st[i++]='</tr><tr>';
		st[i++]=  '<td>標高:'+Number(this.info.alt).toFixed(2)+'m &nbsp;</td>';
		st[i++]=  '<td>気圧:'+Number(this.info.prs).toFixed(0)+'hPa</td>';
		st[i++]='</tr><tr>';
		st[i++]=  '<td>温度:'+Number(this.info.tmp).toFixed(1)+'°&nbsp;</td>';
		st[i++]=  '<td>湿度:'+Number(this.info.hum).toFixed(1)+'% </td>';
		st[i++]='</tr><tr>';
		st[i++]=  '<td>距離:'+Number(this.dists/1000).toFixed(1)+' km&nbsp;</td>';
		st[i++]=  '<td>速度:'+Number(this.speed).toFixed(1)+' km/h</td>';
	}
	st[i++]='</tr></table>';
	this.$info.html(st.join(''));
}

InfoWindow.prototype.GetStatus = function()
{	'use strict';
	var min   =this.$body.is(':hidden');
	var detail=this.$detail.text()=="省略";
	var sound =this.$sound .text()=="音声";
	return {
		minimum	: min,
		detail	: detail,
		sound	: sound
	};
}

InfoWindow.prototype.SetStatus = function(arg)
{	'use strict';
	this.setMinimum(arg.minimum);
	this.setDetail (arg.detail );
	this.setSound  (arg.sound  );
}

InfoWindow.prototype.SetTracks = function(times,dists,speed)
{	'use strict';
	this.times=times;
	this.dists=dists;
	this.speed=speed/1000*(60*60);
	/*
	var km=dists/1000;
	var h=times/(60*60);
	console.log("平均速度："+Number(km/h).toFixed(1)+"km/h.\n");
	*/
}
