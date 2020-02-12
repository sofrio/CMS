<?php
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Tokyo');
/*
 * Coded by kojima@sofrio.com,
 *	2018.07.16
 */
require_once dirname(__FILE__) . '/camera.php';

define('IMG_DIR','../make_plate/img/');
define('WIDTH',100);
define('HEIGHT',50);

/*
if(count($argv)<=5){
	echo "Too few arguments\n";
	return;
}
$base=$argv[1];
$place=$argv[2];
$class=$argv[3];
$kana=$argv[4];
$number=$argv[5];

numberplate(2,$base,$place,$class,$kana,$number);
exit;
*/

function numberplate($id,$base="0",$place="00000",$class="000",$kana="00",$number="0000")
{
	$out_path=get_data_dir()."/img/$id.png";
	$sfx=($base=="0")?"g":"w";

	$plate=imagecreatefrompng(IMG_DIR."number_$base.png");

	appendImage($plate,"a$place$sfx",68,17);
	appendNumber($plate,"b3_",$class,$sfx,array(180,206,232),17);
	appendImage($plate,"c$kana$sfx",20,87);
	appendNumber($plate,"d",$number,$sfx,array(72,126,214,268),67);
	appendImage($plate,"d-$sfx",180,72);

	$w=imagesx($plate);
	$h=imagesy($plate);
	$out=imagecreatetruecolor(WIDTH,HEIGHT);
	imagecopyresampled($out,$plate,0,0,0,0,WIDTH,HEIGHT,$w,$h);
	imagepng($out,$out_path);

	imagedestroy($plate);
	imagedestroy($out);
}

function appendImage($base,$name,$x,$y)
{
	$path=IMG_DIR."$name.png";
	if(!file_exists($path)) return;
	$img=imagecreatefrompng(IMG_DIR."$name.png");
	$w=imagesx($img);
	$h=imagesy($img);
	imagecopy($base,$img,$x,$y,0,0,$w,$h);
	imagedestroy($img);
}

function appendNumber($base,$pfx,$number,$sfx,$x,$y)
{
	for($i=0;$i<count($x);$i++){
		$c=substr($number,$i,1);
		appendImage($base,"$pfx$c$sfx",$x[$i],$y);
	}
}

?>
