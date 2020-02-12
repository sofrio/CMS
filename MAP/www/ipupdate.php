<?php
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
require_once dirname(__FILE__) . '/camera.php';
require_once dirname(__FILE__) . '/calender.php';	//2018.07.11 Added by kojima@sofrio.com

$hdr=date(DATE_LOG).": [ipupdate.php] ";

$ip=$_SERVER['REMOTE_ADDR'];
if(!$ip){
	$msg="IPが取得できません。";
	echo $msg;
	error_log("$hdr$msg\n",3,$log);
	exit;
}

$id=$_GET['id'];
if(!$id){
	$msg="カメラIDが取得できません。";
	echo $msg;
	error_log("$hdr$msg\n",3,$log);
	exit;
}

$data=load_camera($id);
if(!$data){
	$msg="カメラID $id は登録されていません。";
	echo $msg;
	error_log("$hdr$msg\n",3,$log);
	exit;
}

foreach($_GET as $k => $v){
	$_GET[$k] = str_replace(" ","",$v);
}

$stamp=$_GET['time'];
if(!$stamp){
	$msg="timeが指定されていません。";
	echo $msg;
	error_log("$hdr$msg\n",3,$log);
	exit;
}
list($time,$usec)=explode(".",$stamp);
if(!preg_match("/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])\-(.*)/",$time,$match)){
	$msg="invalid time format.";
	echo $msg;
	error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
$time=strtotime($match[1]."-".$match[2]."-".$match[3]." ".$match[4]);

$l_ip= $_GET['ip'         ];
$lat = $_GET['lat'        ];
$lon = $_GET['lon'        ];
if(!$lat || !$lon){
	$msg="lat/lonが指定されていません。";
	echo $msg;
	error_log("$hdr$msg\n",3,$log);
	exit;
}
$ori = $_GET['orient'     ];
$ang = $_GET['angle'      ];
$alt = $_GET['altitude'   ];
$hum = $_GET['humidity'   ];
$tmp = $_GET['temperature'];
$prs = $_GET['pressure'   ];
$line=date("Y/m/d H:i:s",$time)." $ip $l_ip $lat $lon $ori $ang $alt $hum $tmp $prs\n";
$fp=fopen($lock,'a');
flock($fp,LOCK_EX);

$logdir=get_data_dir()."/$id/".date("Y",$time)."/".date("m",$time)."/".date("d",$time)."/".date("H",$time);
if(!is_dir($logdir)){
	mkdir($logdir,0777,TRUE);
}
$updatelog=$logdir."/".date("i",$time).".log"; 
file_put_contents($updatelog,$line,FILE_APPEND);

update_calender($time);	//2018.07.11 Added by kojima@sofrio.com

flock($fp,LOCK_UN);
fclose($fp);

echo "ok";

exit;
