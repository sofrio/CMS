<?php
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Tokyo');
/*
 * Coded by kojima@sofrio.com,
 *	2015.11.09
 */
require '/CMS/google-api/vendor/autoload.php';
require_once dirname(__FILE__) . '/camera.php';

define('DO_MANAGE',false);
define('LAST','/calender.last');
define('EVENT_ID','/calender_event.id');
define('EVENT_END','/calender_event.end');
define('EVENT_DESC','/calender_event.desc');
define('EVENT_SPAN',300);//設定へ
define('UPDATE_INTERVAL',30);
define('AUTH_FILE','/CMS/google-api/CMS Calender-b8470c792d5e.json');
define('CALENDER_ID','cms.hnl@gmail.com');

function update_calender($time=0)
{
	if($time==0) $time=time();
	$time_str=date(DATE_ATOM,$time);
	$last=(file_exists(get_data_dir().LAST))?strtotime(file_get_contents(get_data_dir().LAST)):$time;
	file_put_contents(get_data_dir().LAST,$time_str);
	if(file_exists(get_data_dir().EVENT_END)){
		$end=strtotime(file_get_contents(get_data_dir().EVENT_END));
		$diff=time_diff($end,$time);
		if($diff<UPDATE_INTERVAL) return "ignored";
	}
	if(file_exists(get_data_dir().EVENT_ID)){
		$event_id=file_get_contents(get_data_dir().EVENT_ID);
		$service = get_calender_service();
		$event = $service->events->get(CALENDER_ID,$event_id);
		if($event){
			$end=strtotime($event->end->dateTime);
			if(time_diff($end,$time)<EVENT_SPAN){
				$event->end->dateTime = $time_str;
				if(get_map_id()==CAMERA_MAP){
					if(time_diff($last,$time)>=UPDATE_INTERVAL){
						$event->description = get_description($time,true);
					}
				}
				$event=$service->events->update(CALENDER_ID, $event->id, $event);
				file_put_contents(get_data_dir().EVENT_END,$event->end->dateTime);
				return"updated";
			}
		}
	}
	return insert_calender_event($time);
}

function time_diff($old,$new)
{
	if(intval($old/(60*60))!=intval($new/(60*60))) return EVENT_SPAN;
	return $new-$old;
}

function get_calender_service()
{
	$client = new Google_Client();
	$client->setScopes(array(Google_Service_Calendar::CALENDAR));
	$client->setAuthConfig(AUTH_FILE);
	if($client->isAccessTokenExpired()){
	  $client->refreshTokenWithAssertion();
	}
	return new Google_Service_Calendar($client);
}

function insert_calender_event($time)
{
	$service = get_calender_service();

	$summary=get_summary();	
	$dateTime=date(DATE_ATOM,$time);
	$desc=get_description($time,false);
	$event = new Google_Service_Calendar_Event(array(
	  'summary' => $summary,
	  'start' => array(
		'dateTime' => $dateTime,// 開始日時
		'timeZone' => 'Asia/Tokyo',
	  ),
	  'end' => array(
		'dateTime' => $dateTime, // 終了日時
		'timeZone' => 'Asia/Tokyo',
	  ),
	   "description" => $desc

	));

	$event=$service->events->insert(CALENDER_ID, $event);
	file_put_contents(get_data_dir().EVENT_ID,$event->id);
	file_put_contents(get_data_dir().EVENT_END,$event->end->dateTime);
	if(DO_MANAGE){
		$event = $service->events->get(CALENDER_ID,$event->id);
		if($event){
			$desc=$event->description;
			$link=MAP_URL."manage.php?event=".$event->id;
			$event->description=$desc."<br><a href=\"$link\">記録の管理</a>";
			$event=$service->events->update(CALENDER_ID, $event->id, $event);
		}
	}
	return "inserted";
}

function get_summary()
{
	switch(get_map_id()){
	case CAMERA_MAP: return "CMS 録画記録";
	case NUMBER_PLATE: return "NPTS 追跡記録";
	}
	return "不当な更新";
}

function get_description($time,$append)
{
	$link=get_link($time);
	if(get_map_id()==CAMERA_MAP){
		$url=get_link(0);
		$head="リンク先の地図から吹き出しが無くなったら、<br>次のリンクの時刻まで録画はありません。<br>";
		$head.="（<a href=\"$url/calender.html\">詳細説明</a>）<p>";
		$desc="";
		if($append){
			$desc=file_get_contents(get_data_dir().EVENT_DESC);
			$desc.="<br>";
		}
		$text=date('H:i:s',$time)." の地図を表示";
		$desc.="・<a href=\"$link\">$text</a>";
		file_put_contents(get_data_dir().EVENT_DESC,$desc);
		$desc=$head.$desc;
	} else {
		$desc.="<a href=\"$link\">地図を表示</a>";
	}
	return $desc;
}

function get_link($time)
{
	$url=$_SERVER["HTTP_HOST"].$_SERVER["SCRIPT_NAME"];
	$pos=strrpos($url,"/");
	$map=substr($url,0,$pos);
	return ($time==0)?"http://$map/":"http://$map/?date=".date('Y/m/d+H:i:s',$time);
}
