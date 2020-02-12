<?php
defined('DATE_LOG') or define('DATE_LOG',"Y/m/d H:i:s O");
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.18
 */
$log = "/CMS/REC/www/log/movielist.log";

$expires = 36000;
header('Last-Modified: Fri Jan 01 2010 00:00:00 GMT');
header('Expires: ' . gmdate('D, d M Y H:i:s T', time() + $expires));
header('Cache-Control: private, max-age=' . $expires);
header('Pragma: ');

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/javascript; charset=utf-8");

if(!array_key_exists('id',$_GET) || !$_GET['id']){
	$msg="missing cameraID.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
$cameraID=$_GET['id'];

if(!array_key_exists('date',$_GET) || !$_GET['date']){
	$msg="missing date.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
$date = $_GET['date'];
$time = strtotime($date);
$yy = date("Y",$time);
$mm = date("m",$time);
$dd = date("d",$time);
$hh = date("H",$time);
$ii = date("i",$time);
if(!$yy || !$mm || !$dd){
	$msg="invalid date format.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
$one=(array_key_exists('one', $_GET))?$_GET['one']:false;
$detect=(array_key_exists('detect', $_GET))?$_GET['detect']:false;

$datePath="$yy/$mm/$dd";
$timePath="$cameraID/$datePath/$hh/$ii";
$movieDir="/CMS.REC/record-data/$timePath/";
if(!file_exists($movieDir)){
	$msg=": $movieDir is not exist.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}

$json = array();
$ssList=array_diff(scandir($movieDir),array('.','..'));
foreach($ssList as $ss){
	$ssDir="$movieDir/$ss";
    if(!is_dir($ssDir)) continue;
	$jss=array();
	$path="$timePath/$ss";
	$nImg=0;
	$list=array_diff(scandir($ssDir),array('.','..'));
	foreach($list as $file){
		if(is_dir("$ssDir/$file")) continue;
		$ext=preg_replace("/.*\.(.+)$/","$1",$file);
		if($ext=="jpg"){
			if($one && $nImg>0) continue;
			$nImg++;
		}
		//$fileIdx=intval(str_replace(".$ext","",$file));
		$fileIdx=str_replace(".$ext","",$file);
		$jss[$fileIdx]="$path/$file";
	}
	$ssIdx="$datePath $hh:$ii:$ss";
	$json[$ssIdx]=$jss;
}

$json = json_encode($json);

if($detect){
	$tmp="/tmp/CMS.$cameraID.$time.json";
	file_put_contents($tmp,$json);
	$python="/CMS/REC/detect/main.py";
	$res = exec("python3 $python $tmp 2>&1",$out,$ret);
	unlink($tmp);
	if($ret!=0){
		echo "$python failed.\n";
		echo( $res );
		foreach ($out as $line) {
			echo "$line\n";
		}
		echo( $ret );
		exit;
	}
}
echo $json;
exit;

