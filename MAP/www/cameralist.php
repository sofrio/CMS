<?php
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
require_once dirname(__FILE__) . '/camera.php';
$hdr=date(DATE_LOG).": [cameralist.php] ";

if(array_key_exists('date',$_GET) && $_GET['date']){
	$time = strtotime($_GET['date']);
	$path = date("Y",$time)."/".date("m",$time)."/".date("d",$time)."/".date("H",$time)."/".date("i",$time).".log";
} else {
	$path = date("Y")."/".date("m")."/".date("d")."/".date("H")."/".date("i").".log";
}

$ids=get_all_ids();
if(!$ids){
	echo "カメラが登録されていません。";
	exit;
}

header("Content-Type: application/json; charset=utf-8");
$list=array();
foreach ($ids as $k => $id){
	$host=get_movie_host($id);
	//動画なし端末に対応
	//if(!$host) continue;
	
	$infofile=get_data_dir()."/$id/$path";
	if(!file_exists($infofile)) continue;
	$fp=fopen($infofile,'r');
	if(!$fp) continue;
	
	$list[$id] = array();
	$list[$id]['device']=($host)?"http://$host":"";
	$list[$id]['tracks']=get_tracks($id);

	while(!feof($fp)) {
		$line=fgets($fp);
		$info=explode(" ",$line);
		if(count($info)<8) continue;
	//	if(count($info)<12) continue;
		$log=array();
		$log['lat']=$info[4];
		$log['lon']=$info[5];
		$log['ori']=$info[6];
		$log['ang']=$info[7];
		$log['alt']=$info[8];
		$log['hum']=$info[9];
		$log['tmp']=$info[10];
		$log['prs']=$info[11];
if(strpos($info[0],'-')!==false) $info[0]=implode('/',explode('-',$info[0]));	// 暫定処置
		$key="$info[0] $info[1]";
		$list[$id]['log'][$key]=$log;
	}
	fclose($fp);
}
echo json_encode($list);
exit;

