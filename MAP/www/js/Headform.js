/*
 * Coded by kojima@sofrio.com
 *	2015/11/23
 */

Args = function(){};

Args.GetPlayTime = function(args)
{	'use strict';
	var date=Movie.TimeToDate(args['date']);
	var playTime;
	if(date){ 
		playTime=date.getTime();
	} else {
	//	date=new Date();
	//	playTime=date.getTime()-Main.REAL_TIME_LATENCY;
	//	timeShift=false とするため 2017.05.31 M.Kojima
		playTime=0;
	}
	return playTime;
}
	
Args.SetPlayTime = function(args,playTime)
{	'use strict';
	var date=FormatDate(playTime);
	args['date']=date.YY+"/"+date.MM+"/"+date.DD+" "+date.hh+":"+date.mm+":"+date.ss;
}

Head = function(){};

Head.ZERO_FILL	= true;
Head.FORCE_ALERT	= false;

Head.Setup = function(playTime,detect)
{	'use strict';
	detect=(detect=="true");//(detect!="false");
	var $detect=$('#detect');
	if($detect) $detect.prop('checked',detect);	
	var date=new Date();
	this.setupCombo('y',date.getFullYear()-5,date.getFullYear(),4);
	this.setupCombo('m',1,12,2);
	this.setupCombo('d',1,31,2);
	this.setupCombo('h',0,23,2);
	this.setupCombo('i',0,59,2);
	this.setupCombo('s',0,59,2);
	this.SetDate(playTime);
	document.getElementById("head-form").style.visibility="visible";
	return detect;
}

Head.setupCombo = function(name,from,to,len)
{	'use strict';
	var $combo=$('select[name='+name+']');
	for(var i=from;i<=to;i++){
		var zz=(this.ZERO_FILL)?("0"+i).slice(-len):i;
		$combo.append('<option value="'+i+'">'+zz+'</option>');
	}
}

Head.SetDate = function(playTime)
{	'use strict';
	var date=LocalDate(playTime);

	// デフォルト
	$('select[name=y] option[value='+date.YY+']').prop('selected',true);
	$('select[name=m] option[value='+date.MM+']').prop('selected',true);
	$('select[name=d] option[value='+date.DD+']').prop('selected',true);
	$('select[name=h] option[value='+date.hh+']').prop('selected',true);
	$('select[name=i] option[value='+date.mm+']').prop('selected',true);
	$('select[name=s] option[value='+date.ss+']').prop('selected',true);
	this.setupDateCombo();
	// 年/月 選択
	$('select[name=y],select[name=m]').change(function(){
		'use strict';
		Head.setupDateCombo();
	});
	$("#time-btn").click(function(){
		'use strict';
		var args=[];
		if(Main.cameraID) args['id']=Main.cameraID;
		var date=new Date(
			$('select[name=y]').val(),
			$('select[name=m]').val()-1,
			$('select[name=d]').val(),
			$('select[name=h]').val(),
			$('select[name=i]').val(),
			$('select[name=s]').val()
		);
		Args.SetPlayTime(args,date.getTime());
		var $detect=$('#detect');
		args['detect']=$detect && $detect.prop('checked');	
		//args['interacted']=true;
		location.search=MakeQuery(args); 
	});
	$("#now-btn").click(function(){
		'use strict';
		var args=[];
		if(Main.cameraID) args['id']=Main.cameraID;
		var $detect=$('#detect');
		args['detect']=$detect && $detect.prop('checked');	
		//args['interacted']=true;
		location.search=MakeQuery(args); 
	});
}

Head.setupDateCombo = function()
{	'use strict';
	var y=$('select[name=y]').val();
	var m=$('select[name=m]').val();
	var d=$('select[name=d]').val();
	
	var dom;
	switch(Number(m)){
	case 2:
		dom=28;
		if(y%4==0 && (y%100!=0 || y%400==0)) dom++;
		break;
	case 4: case 6: case 9: case 11:
		dom=30;
		break;
	default:
		dom=31;
		break;
	}
	if(d>dom) d=dom;

	$('select[name=d] option').remove();
	this.setupCombo('d',1,dom,2);
	$('select[name=d] option[value='+d+']').prop('selected',true);
}

Head.Alert = function(msg,force)
{	'use strict';
	console.error(msg);
	var $alert=$('#alert');
	if($alert){
		if(force || !this.FORCE_ALERT){
			this.FORCE_ALERT=force;
			var ALERT_DISPLAY_TIME=10000;//millisecond
			$alert.text(msg);
			$alert.show();
			if(force) return;
			setTimeout(function(){
				'use strict';
				$alert.hide();
				this.FORCE_ALERT=false;
			},ALERT_DISPLAY_TIME);
		}
	}
}

Head.ClearAlert = function()
{	'use strict';
	var $alert=$('#alert');
	if($alert){
		this.FORCE_ALERT=false;
		$alert.hide();
	}
}
