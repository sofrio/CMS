<?php
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Tokyo');
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
define('CAMERA_MAP','cameramap');
define('NUMBER_PLATE','numberplate');
defined('DATA_ROOT') or define('DATA_ROOT','./meta-data');
defined('G_IP') or define('G_IP','g_ip');	// カメラのIP/Domain
defined('S_IP') or define('S_IP','s_ip');	// レコーダーのIP/Domain
defined('L_IP') or define('L_IP','s_l_ip');	// レコーダーのLAN内IP/Name
defined('TRACKS') or define('TRACKS','tracks');			// 軌跡の描画色
defined('NP_BASE') or define('NP_BASE','np_base');		// ナンバープレートの種別
defined('NP_PLACE') or define('NP_PLACE','np_place');	// ナンバープレートの地名
defined('NP_CLASS') or define('NP_CLASS','np_class');	// ナンバープレートの分類
defined('NP_KANA') or define('NP_KANA','np_kana');		// ナンバープレートのかな
defined('NP_NUMBER') or define('NP_NUMBER','np_number');// ナンバープレートの番号
defined('UPLOAD') or define('UPLOAD','upload');			// アップロードされた画像

defined('DATE_LOG') or define('DATE_LOG',"Y/m/d H:i:s O");

$data_root=DATA_ROOT;
if(!is_dir($data_root)){
	mkdir($data_root,0777,TRUE);
}

$data_dir=get_data_dir();
if($data_dir){
	if(!is_dir($data_dir)){
		mkdir($data_dir,0777,TRUE);
	}

	$log_dir=get_log_dir();
	if(!is_dir($log_dir)){
		mkdir($log_dir,0777,TRUE);
	}
}

$log ="$log_dir/error.log";
$lock="$log_dir/camera.lck";

function get_map_id()
{
	$name=$_SERVER['SCRIPT_NAME'];
	if(stripos($name,"/numberplate/")!==false) return NUMBER_PLATE;
	if(stripos($name,"/cameramap/")!==false) return CAMERA_MAP;
	if(stripos($name,"/camerademo/")!==false) return CAMERA_MAP;//暫定⇒昔のカレンダーから辿れなくなるので
	return false;
}

function get_data_dir()
{
	$data_dir=DATA_ROOT;
	$map=get_map_id();
	return ($map)?"$data_dir/$map":false;
}

function get_log_dir()
{
	$data_dir=get_data_dir();
	return "$data_dir/log";
}

function peek_new_id()
{
	$idfile=get_data_dir()."/camera.id";
	if(file_exists($idfile)){
		$id=file_get_contents($idfile);
	} else {
		$id=0;
	}
	return $id+1;
}

function get_new_id()
{
	$idfile=get_data_dir()."/camera.id";
	if(file_exists($idfile)){
		$id=file_get_contents($idfile);
	} else {
		$id=0;
	}
	$id++;
	file_put_contents($idfile,$id);
	return $id;
}

function get_all_ids()
{
	$ids=array();
	$list=scandir(get_data_dir());
	foreach($list as $k => $file) {
		if(preg_match("/^.+\.ip$/",$file)==1){
			$ids[$k]=preg_replace("/(.+)\.ip/","$1",$file);
		}
	}
	return $ids;
}

function load_camera($id)
{
	$file=_get_camera_file_name($id);
	if(!file_exists($file)) return null;
	$line=file_get_contents($file);
	$info=explode(",",$line);
	$data=array();	
	$data[G_IP]=$info[0];
	$data[S_IP]=$info[1];
	$data[L_IP]=$info[2];
	//if(get_map_id()==NUMBER_PLATE){
		$data[TRACKS]=$info[3];	
		$data[NP_BASE]=$info[4];	
		$data[NP_PLACE]=$info[5];	
		$data[NP_CLASS]=$info[6];	
		$data[NP_KANA]=$info[7];	
		$data[NP_NUMBER]=$info[8];
		$data[UPLOAD]=$info[9];
	//}	
	return $data;
}

function save_camera($id,$data)
{
	$file=_get_camera_file_name($id);
	$line=$data[G_IP].",".
		  $data[S_IP].",".
		  $data[L_IP].",".
		  $data[TRACKS].",".
		  $data[NP_BASE].",".
		  $data[NP_PLACE].",".
		  $data[NP_CLASS].",".
		  $data[NP_KANA].",".
		  $data[NP_NUMBER].",".
		  $data[UPLOAD];
	file_put_contents($file,$line);
}

function delete_camera($id)
{
	$file=_get_camera_file_name($id);
	unlink($file);
}

function _get_camera_file_name($id)
{
	return get_data_dir()."/$id.ip";
}

function get_camera_host($id)
{
	$data=load_camera($id);
	if(!$data) return "";
	return $data[G_IP];
}

function get_movie_host($id)
{
	$data=load_camera($id);
	if(!$data) return "";
	return (_is_local())?$data[L_IP]:$data[S_IP];
}

function _is_local()
{
	return (preg_match("/192\.168\..*/",$_SERVER['REMOTE_ADDR'])==1);
}

function get_tracks($id)
{
	$data=load_camera($id);
	if(!$data) return "";
	return $data[TRACKS];
}

function get_rec_hosts()
{
	$file=get_data_dir()."/rec.ips";
	if(!file_exists($file)) return null;
	$line=file_get_contents($file);
	return explode("\n",$line);
}