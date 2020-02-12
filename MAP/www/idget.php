<?php
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
require_once dirname(__FILE__) . '/camera.php';
$hdr=date(DATE_LOG).": [idget.php] ";

$ip=$_SERVER['REMOTE_ADDR'];
if(!$ip){
	$msg="IP‚ªŽæ“¾‚Å‚«‚Ü‚¹‚ñB";
	echo $msg;
	error_log("$hdr$msg\n",3,$log);
	exit;
}

$fp=fopen($lock,'a');
flock($fp,LOCK_EX);

$id=get_new_id();
$data=array();
$data[G_IP]=$ip;
save_camera($id,$data);

flock($fp,LOCK_UN);
fclose($fp);

echo $id;
exit;