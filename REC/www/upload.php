<?php
error_reporting(E_ALL & ~E_NOTICE);
set_time_limit(60);
defined('DATE_LOG') or define('DATE_LOG',"Y/m/d H:i:s O");
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.11
 */

if(!array_key_exists('id',$_REQUEST) || !$_REQUEST['id']){
	$msg="missing cameraID.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
$cameraID=$_REQUEST['id'];
if(!array_key_exists('time',$_GET) || !$_GET['time']){
	$msg="missing time argument.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
if(!array_key_exists('file',$_FILES) || !$_FILES['file']){
 	$msg="no file attached.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}
$tmp_name=$_FILES['file']['tmp_name'];
if(!is_uploaded_file($tmp_name)){
	$msg="not is_uploaded_file($tmp_name).";
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}

list($time,$usec)=explode(".",$_GET['time']);
if(!preg_match("/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])\-(.*)/",$time,$match)){
	$msg="invalid time format.";
	echo $msg;
    error_log(date(DATE_LOG).": $msg\n",3,$log);
	exit;
}

$lock="/CMS.REC/record-data/upload.lck";
$fp=fopen($lock,'a');
flock($fp,LOCK_EX);

$time=strtotime($match[1]."-".$match[2]."-".$match[3]." ".$match[4]);
$movieDir="/CMS.REC/record-data/$cameraID/".date("Y",$time)."/".date("m",$time)."/".date("d",$time)."/".date("H",$time)."/".date("i",$time)."/".date("s",$time);
if(!is_dir($movieDir)){
	if(!mkdir($movieDir,0777,TRUE)){
		error_log(date(DATE_LOG).": error in mkdir($movieDir,0777,TRUE)\n",3,$log);
	}
}

$movieFile="$movieDir/$usec.$ext";
if(move_uploaded_file($tmp_name,$movieFile)){
	echo $_FILES['file']['name']." uploaded.";
} else {
	error_log(date(DATE_LOG).": error in move_uploaded_file($tmp_name,$movieFile)\n",3,$log);
}
//chmod($movieFile,0664);

flock($fp,LOCK_UN);
fclose($fp);

echo "ok";

exit;