<?php
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);
date_default_timezone_set('Asia/Tokyo');
/*
 * Coded by kojima@sofrio.com,
 *	2018.07.16
 */
define('OUT_PNG','plate.png');
define('IMG_DIR','./img/');
define('WIDTH',100);
define('HEIGHT',50);

if($argc<=6){
	echo "Too few arguments\n";
	exit;
}

$base=$argv[1];
$sfx=($base=="0")?"g":"w";
$place=$argv[2];
$class=$argv[3];
$kana=$argv[4];
$number=$argv[5];
$out=$argv[6];

$plate=imagecreatefrompng(IMG_DIR."number_$base.png");

appendImage($plate,"a$place$sfx",68,17);
appendNumber($plate,"b3_",$class,$sfx,array(180,206,232),17);
appendImage($plate,"c$kana$sfx",20,87);
appendNumber($plate,"d",$number,$sfx,array(72,126,214,268),67);
appendImage($plate,"d-$sfx",180,72);

$w=imagesx($plate);
$h=imagesy($plate);
$image=imagecreatetruecolor(WIDTH,HEIGHT);
imagecopyresampled($image,$plate,0,0,0,0,WIDTH,HEIGHT,$w,$h);
imagepng($image,$out);

imagedestroy($plate);
imagedestroy($image);
exit;

function appendImage($base,$name,$x,$y)
{
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
