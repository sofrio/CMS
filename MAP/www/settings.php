<?php
/*
 * Coded by kojima@sofrio.com
 *	2018/07/17
 */
require_once dirname(__FILE__) . '/camera.php';
require_once dirname(__FILE__) . '/numberplate.php';
		
function add_new_id($CMS)
{
	global $lock;
	$fp=fopen($lock,'a');
	flock($fp,LOCK_EX);
	$id=get_new_id();
	$data=array();
	$data[G_IP]=$_SERVER['REMOTE_ADDR'];
	if($CMS){
		$ids=get_all_ids();
		foreach($ids as $k => $i){
			$host=get_movie_host($i);
			break;
		}
		$data[S_IP]=$host;
	} else {
		$data[TRACKS]="#000";
		numberplate($id);
	}
	save_camera($id,$data);
	flock($fp,LOCK_UN);
	fclose($fp);
	return $id;
}
/*
function delete_id($id)
{
	global $lock;
	$fp=fopen($lock,'a');
	flock($fp,LOCK_EX);
	delete_camera($id);
	flock($fp,LOCK_UN);
	fclose($fp);
}
*/

$CMS=(get_map_id()==CAMERA_MAP);
$gps=($CMS)?"カメラ":"GPS端末";
$title=$gps."の管理";
if(isset($_GET['add'])){
	add_new_id($CMS);
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title><?=$title;?></title>
</head>
<body>
<h2><?=$title;?></h2>
<table border=1 cellspacing=0 cellpadding=4>
  <tr>
    <th>ID</th>
    <th>IP</th>
  <?php if($CMS): ?>
    <th>録画サーバー</th>
  <?php else: ?>
    <th>画像</th>
    <th>軌跡</th>
  <?php endif; ?>
    <th>&nbsp;</th>
  </tr>  
<?php 
$ids=get_all_ids();
$list=array();
foreach ($ids as $k => $id){
	$data=load_camera($id);
	if(!$data) continue;
	$ip=$data[G_IP];
	$host=get_movie_host($id);
	$img=get_data_dir()."/img/$id.png";
	if($host){
		$img="<table width=\"100%\"><tr><td bgcolor=\"black\" align=center><img src=\"img/loading.gif\"></td></tr></table>";
	} else {
		$img=(file_exists($img))?'<img src="'.$img.'">':"なし";
	}
	$tracks=$data[TRACKS];
	if($tracks){
		$tracks='<hr size=3 width="75%" color="'.$tracks.'">';
	} else {
		$tracks="なし";
	}
	if(!$host) $host="画像なし";
?>
  <tr>
    <td align=right><?=$id;?></td>
    <td><?=$ip;?></td>
  <?php if($CMS): ?>
    <td><?=$host;?></td>
  <?php else: ?>
    <td align=center><?=$img;?></td>
    <td><?=$tracks;?></td>
  <?php endif; ?>
    <td><a href="setup.php?id=<?=$id;?>">編集</a></td>
  </tr>
<?php
}
$id=peek_new_id();
$msg="新たな".$gps."を追加します。\\nよろしいですか？";
$add="var ok=confirm('".$msg."'); if (ok) location.href='settings.php?add'; return false;";
?>
  <tr>
    <td align=right><?=$id;?></td>
    <td>&nbsp;</td>
  <?php if($CMS): ?>
    <td>&nbsp;</td>
  <?php else: ?>
    <td>&nbsp;</td>
    <td>&nbsp;</td>
  <?php endif; ?>
    <td><a href="javascript:void(0);" onclick="<?=$add;?>">追加</a></td>
  </tr>
</table>
<p>
<a href="#" onClick="window.close(); return false;">閉じる</a></p>
</body>
</html>

