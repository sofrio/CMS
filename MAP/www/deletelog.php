<?php
$TEMPORARILY_DISABLED = true;
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.17
 */
require_once dirname(__FILE__) . '/camera.php';
$log=get_log_dir()."/delete.log";
$hdr=date(DATE_LOG).": ";

if($TEMPORARILY_DISABLED){
	echo "You are logged.";
	exit;
}

$ip=$_SERVER['REMOTE_ADDR'];

$dir=$_GET['delete'];
if(!$dir){
	echo "delete引数が指定されていません。";
	exit;
}

$time=explode("/",$dir);
if(count($time)<5){
	echo "delete引数の要素数が不足しています。";
	exit;
}

$id=$time[0];
//$yy=$time[1];
//$mm=$time[2];
//$dd=$time[3];
//$hh=$time[4];

$n=delete_older(get_data_dir()."/$id",$time,1);

$fl="folder";
if($n>1) $fl=$fl."s";
$msg="$n $fl deleted by /$dir from $ip.";
echo $msg;
if($n>0) error_log($hdr.$msg."\n",3,$log);
exit;

function delete_older($dir,$time,$idx)
{
	$n=0;
	$list=array_diff(scandir($dir),array('.','..'));
	foreach($list as $file){
		$sub="$dir/$file";
		if(!is_dir($sub)) continue;
		if(file_exists("$sub/dont_delete") || file_exists("$sub/dont_remove")) continue;
		if($file>$time[$idx]) continue;
		if($file<$time[$idx]){
			$n+=deep_delete($sub);
		} else {
			if($idx<4){
				$n+=delete_older($sub,$time,$idx+1);
			} else {
				$n+=deep_delete($sub);
			}
		}
	}
	return $n;
}

function deep_delete($dir)
{
	global $log;
	$n=0;
	$list=array_diff(scandir($dir),array('.','..'));
	foreach($list as $file){
		$sub="$dir/$file";
		if(is_dir($sub)){
			error_log($hdr."deleting $sub\n",3,$log);
			$n+=deep_delete($sub);
		} else {
			unlink($sub);
		}
	}
	if(rmdir($dir)) $n++;
	return $n;
}
