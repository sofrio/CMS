<?php
defined('DATE_LOG') or define('DATE_LOG',"Y/m/d H:i:s O");
$TEST_MODE    = true;
$TEST_REMOVED = array();
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
$data_dir = "/CMS.REC/record-data/";
$log_dir  = "/CMS/log/";
$log      = $log_dir."garbage.log";
$lock     = $data_dir."garbage.lck";
$ratio    = 1; //3台同時に録画する場合は 2 に
$need_MB  = 2*1024;	// 約１時間分
$YMDH	  = -14;


$fp=fopen($lock,'a');
flock($fp,LOCK_EX);
//error_log("starting garbage collection...\n",3,$log);
$cameras=get_cameras();
$nCamera=$n=count($cameras);
echo $nCamera."台分の空きエリアを確保します。<br>\n";
while(check_size($data_dir,$nCamera)==0){
	if(garbage($cameras)<0){
		$info="削除可能な対象なし。";
		error_log(date(DATE_LOG).": $info\n",3,$log);
		echo "$info<br>\n";
		break;
	}
	if($TEST_MODE && $n--==0) break;
}
//error_log("done.\n",3,$log);

flock($fp,LOCK_UN);
unlink($lock);
fclose($fp);
exit;

function get_cameras()
{
	global $TEST_MODE,$log,$data_dir,$YMDH;
	$cameras=array();
	$i=0;
	$list=scandir($data_dir);
	foreach ($list as $k => $v){
		if($v == "." || $v == "..") continue;
		$camera = $data_dir  . $v;
		if(!is_dir($camera)) continue;
		$cameras[$i]=$camera;
		$i++;
	}
	return $cameras;
}

function check_size($dir,$nCamera)
{
	global $TEST_MODE,$ratio,$need_MB,$log;
	$need=$need_MB*$nCamera;
	$total_MB = disk_total_space($dir)/1024/1024;
	if($total_MB<$ratio*$need){
		$info=$dir." ⇒ ファイルシステムが小さすぎる（".number_format(intval($total_MB/1000))."GB < ".$ratio."*".$nCamera."*".number_format($need_MB/1000)."GB）";
		error_log(date(DATE_LOG).": ".$info."\n",3,$log);
		echo $info."<br>\n";
		return -1;
	}
	$free_MB=disk_free_space($dir)/1024/1024;
	if($free_MB>$ratio*$need){
		if($TEST_MODE) return 0;
		$info=$dir." ⇒ 削除の必要なし（".number_format(intval($free_MB/1000))."GB > ".$ratio."*".$nCamera."*".number_format($need_MB/1000)."GB）";
		//error_log(date(DATE_LOG).": ".$info."\n",3,$log);
		echo $info."<br>\n";
		return +1;
	}
	return 0;
}

function garbage($cameras)
{
	global $TEST_MODE,$log,$data_dir,$YMDH;
	$oldest="";
	for($i=0;$i<count($cameras);$i++){
		$camera=$cameras[$i];
		$dir=oldest_dir($camera);
		if($dir==""){
			$info=$camera." ⇒ 削除対象が存在しない。";
			error_log(date(DATE_LOG).": ".$info."\n",3,$log);
			echo $info."<br>\n";
			continue;
		}
		if($oldest=="" || substr($dir,$YMDH)<substr($oldest,$YMDH)){
			$oldest=$dir;
		}
	}
	if($oldest=="") return -1;
	if(!remove_dir($oldest)) return -1;
	return 0;
}

function oldest_dir($camera)
{
	global $TEST_MODE,$ratio,$need_MB;
	$yy='';
next_yy:
	$yy=get_next($camera,$yy);
	if(!$yy) return "";
	$mm='';
next_mm:
	$mm=get_next($yy,$mm);
	if(!$mm) goto next_yy;
	$dd='';
next_dd:
	$dd=get_next($mm,$dd);
	if(!$dd) goto next_mm;
	$hh='';
next_hh:
	$hh=get_next($dd,$hh);
	if(!$hh) goto next_dd;
	$dir=$hh;
found:
	if(is_dir($dir)) return $dir;
	goto next_hh;
}

function get_next($dir,$cur='',$rmdir_if_empty=true)
{		
	global $TEST_MODE,$TEST_REMOVED,$log,$data_dir;
	$r='';
	$n=0;	
	$list=scandir($dir);
	foreach($list as $k => $v) {
		if($v=="." || $v=="..") continue;
		$n++;
		$d= "$dir/$v";
		if($d<=$cur) continue;	
		if(!is_dir($d)) continue;
		if((fileperms($d)&0222)==0) continue;
		if(file_exists("$d/dont_delete") || file_exists("$d/dont_remove")){
			echo "$d/ は削除対象外です。<br>\n";
			continue;
		}
		if($TEST_MODE && in_array($d,$TEST_REMOVED)) continue;
		if(!$r || $d<$r) $r=$d;
	}
	if($n==0 && $rmdir_if_empty){
		remove_dir($dir);
	}
	return $r;	
}

function remove_dir($dir)
{
	global $TEST_MODE,$TEST_REMOVED,$log,$data_dir;
	if($TEST_MODE){
		echo "次回本番時は $dir/ が削除されます。<br>\n";
		$TEST_REMOVED[count($TEST_REMOVED)]=$dir;
		return true;
	}
	echo "$dir/ を削除します...";
	error_log(date(DATE_LOG).": $dir を削除中...",3,$log);
	
	exec("rm -r $dir");
	
	if(file_exists($dir)){
		error_log(date("H:i:s")." 失敗\n",3,$log);
		echo "削除に失敗しました<br>\n";
		return false;
	}
	error_log(date("H:i:s")." 完了\n",3,$log);
	echo "削除しました<br>\n";
	tell_server(substr($dir,strlen($data_dir)));
	echo "<br>\n";
	return true;
}

function tell_server($args)
{
	$svcpath="/CMS/REC/www/server.path";
	$svccom ="deletelog.php";
		
	global $log;
	if(!file_exists($svcpath)){
		error_log(date(DATE_LOG).": $svcpath なし\n",3,$log);
		echo "サーバーのアドレスを保持するファイル $svcpath がありません。<br>\n";
		return;
	}
	
	$path=file_get_contents($svcpath);
	$url="http://$path/$svccom?delete=$args";
	$opts=stream_context_create(array('http'=>array('method'=>'GET')));
	$res=file_get_contents($url,false,$opts);
	echo $res;
}
