<?php
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
require_once dirname(__FILE__) . '/camera.php';
$hdr=date(DATE_LOG).": [ipget.php] ";

$ip=(array_key_exists('ip',$_GET))?$_GET['ip']:$_SERVER['REMOTE_ADDR'];
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

$data[S_IP]=$ip;
if(array_key_exists(L_IP,$_GET)){
	$data[L_IP]=$_GET[L_IP];
}

save_camera($id,$data);
echo $data[G_IP];
exit;