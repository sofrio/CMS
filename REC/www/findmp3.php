<?php
defined('DATE_LOG') or define('DATE_LOG',"Y/m/d H:i:s O");
/*
 * Coded by kojima@sofrio.com,
 *	2017.06.03
 */
$data_dir = "/CMS.REC/record-data/";

if(count($argv)>1 && ($argv[1]=="?" || $argv[1]=="-h")){
	echo "Usage: $argv[0] [list]\n";
	echo "\tlist  : range | [list] range\n";
	echo "\trange : min..max | min.. | ..max | date\n";
	echo "\tmin   : date\n";
	echo "\tmax   : date\n";
	echo "\tdate  : yyyy/mm/dd | yyyy/mm/dd@hh\n";
	exit;
}

if(count($argv)<=1){
	do_range("");
} else {
	for($i=1;$i<count($argv);$i++){
		do_range($argv[$i]);
	}
}
exit;

function do_range($range)
{
	$min="";
	$max="";
	$mm=explode("..",$range);
	switch(count($mm)){
	case 1:
		$min=$mm[0];
		$max=$mm[0];
		break;
	case 2:
		$min=$mm[0];
		$max=$mm[1];
		break;
	default:
		fputs(STDERR,"Unrecognized '..' usage.\n");
		exit;
	}
	$date=make_date($min,"1970/1/1@0");
	$min=date("Y/m/d/H/i/s",$date);
	$date=make_date($max,"2037/12/31@23");
	if     (date("H",$date)==0) $date+=24*60*60-1;
	else if(date("i",$date)==0) $date+=60*60-1;
	else if(date("s",$date)==0) $date+=60-1;
	$max=date("Y/m/d/H/i/s",$date);
	if($max<$min){
		fputs(STDERR,"Illegal range...$max < $min.\n");
		exit;
	}

	find_file($min,$max);
}

function make_date($str,$def="1970/1/1")
{
	if(strlen($str)==0) $str=$def;
	$datehour=explode("@",$str);
	
	$date=strtotime($datehour[0]);
	if($date===false){
		fputs(STDERR,"Bad date string...\"$str\".\n");
		exit;
	}
	if(count($datehour)>1){
		$date+=$datehour[1]*60*60;
	}
	return $date;
}

function find_file($min,$max,$ext="mp3")
{
	$ext=".$ext";
	fputs(STDERR,"finding $ext in $min .. $max\n");

	global $data_dir;
	$list=scandir($data_dir,SCANDIR_SORT_NONE);
	foreach ($list as $k => $v){
		if($v == "." || $v == "..") continue;
		$camera = $data_dir  . $v;
		if(!is_dir($camera)) continue;
		$cmin="$camera/$min";
		$cmax="$camera/$max";
		$yy='';
	next_yy:
		$yy=get_next($camera,$yy);
		if(!$yy) break;
		$l=strlen($yy);
		if(strncmp($yy,$cmin,$l)<0 || 0<strncmp($yy,$cmax,$l)) goto next_yy;
		$mm='';
	next_mm:
		$mm=get_next($yy,$mm);
		if(!$mm) goto next_yy;
		$l=strlen($mm);
		if(strncmp($mm,$cmin,$l)<0 || 0<strncmp($mm,$cmax,$l)) goto next_mm;
		$dd='';
	next_dd:
		$dd=get_next($mm,$dd);
		if(!$dd) goto next_mm;
		$l=strlen($dd);
		if(strncmp($dd,$cmin,$l)<0 || 0<strncmp($dd,$cmax,$l)) goto next_dd;
		$hh='';
	next_hh:
		$hh=get_next($dd,$hh);
		if(!$hh) goto next_dd;
		$l=strlen($hh);
		if(strncmp($hh,$cmin,$l)<0 || 0<strncmp($hh,$cmax,$l)) goto next_hh;
		fputs(STDERR,"scanning $hh...\n");
		$ii='';
	next_ii:
		$ii=get_next($hh,$ii);
		if(!$ii) goto next_hh;
	//	$l=strlen($ii);
	//	if(strncmp($ii,$cmin,$l)<0 || 0<strncmp($ii,$cmax,$l)) goto next_ii;
		$ss='';
	next_ss:
		$ss=get_next($ii,$ss);
		if(!$ss) goto next_ii;
	//	$l=strlen($ss);
	//	if(strncmp($ss,$cmin,$l)<0 || 0<strncmp($ss,$cmax,$l)) goto next_ss;
		$us='';
	next_us:
		$us=get_next($ss,$us,false);
		if(!$us) goto next_ss;
		if(strpos($us,$ext)!==false) echo "$us\n";
		goto next_us;
	}
}

function get_next($dir,$cur='',$finddir=true)
{		
	$r='';
	$n=0;	
	$list=scandir($dir,SCANDIR_SORT_NONE);
	foreach($list as $k => $v) {
		if($v=="." || $v=="..") continue;
		$n++;
		$d= "$dir/$v";
		if($d<=$cur) continue;	
		if($finddir && !is_dir($d)) continue;
		if((fileperms($d)&0222)==0) continue;
		if(!$r || $d<$r) $r=$d;
	}
	return $r;	
}
