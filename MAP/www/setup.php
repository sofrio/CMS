<?php
/*
 * Coded by kojima@sofrio.com
 *	2018/07/15
 */
require_once dirname(__FILE__) . '/camera.php';
require_once dirname(__FILE__) . '/numberplate.php';

function save_id($CMS,$id)
{
	if($CMS || $_POST['picture']=="camera"){
		$host=$_POST['host'];
		if(!$host){
			$recs=get_rec_hosts();
			$host=$recs[0];
		}
		$data=load_camera($id);
		$data[S_IP]=$host;
		save_camera($id,$data);
	} else {
		if($_POST['picture']=="numberplate"){
			$data=load_camera($id);
			$data[S_IP]="";
			$data[NP_BASE]=$_POST['base'];
			$data[NP_PLACE]=$_POST['place'];
			$data[NP_CLASS]=$_POST['class'];
			$data[NP_KANA]=$_POST['kana'];
			$data[NP_NUMBER]=$_POST['number'];
			$data[UPLOAD]="";
			$data[TRACKS]=$_POST['tracks'];
			save_camera($id,$data);
			
			$number=$data[NP_NUMBER];
			while(strlen($number)<4){
				$number="o$number";
			}
			numberplate($id,$data[NP_BASE],$data[NP_PLACE],$data[NP_CLASS],$data[NP_KANA],$number);
		} else {		
			$path=get_data_dir()."/img/$id.png";
			if(is_uploaded_file($_FILES["upload"]["tmp_name"])){
				if(move_uploaded_file($_FILES["upload"]["tmp_name"],$path)){
					//chmod($path, 0644);
					echo $path." をアップロードしました。";
				} else {
					echo '<p><b><font color="red">指定された画像ファイルをアップロードできません。</font></b>';
					return 2;
				}
			} else {
				if(!file_exists($path)){
					echo '<p><b><font color="red">アップロードする画像ファイルが選択されていません。</font></b>';
					return 2;
				}
			}
			$data=load_camera($id);
			$data[S_IP]="";
			$data[TRACKS]=$_POST['tracks'];
			$data[UPLOAD]=$path;
			save_camera($id,$data);
		}
	}
	header("Location: setup.php?id=$id");
	exit();
	return 0;
}

$CMS=(get_map_id()==CAMERA_MAP);
$gps=($CMS)?"カメラ":"GPS端末";
$id=$_GET['id'];
$title=$gps."の編集 - ID = $id";
$upload=false;
$host=get_movie_host($id);
$reload="";
if(isset($_GET['save'])){	
	$r=save_id($CMS,$id);
	switch($r){
	case 1:
		$host="dummy";
		break;
	case 2:
		$upload=true;
		break;
	default:
		$host=get_movie_host($id);
		break;
	}
	$reload="location.reload(true);";	
}
if($host){
	$img="<table width=\"100%\"><tr><td bgcolor=\"black\" align=center><img src=\"img/loading.gif\"></td></tr></table>";
} else {
	$img="<img src=\"".get_data_dir()."/img/$id.png\">";
}
$save="?save&id=$id";
$data=load_camera($id);
if($data[UPLOAD]) $upload=true;
$select_host="<select id=\"host\" name=\"host\">\n";
$recs=get_rec_hosts();
foreach($recs as $idx => $rec){
	if($rec){
		$sel=($host==$rec || (!$host && $idx==0))?" selected":"";
		$select_host.="<option value=\"$rec\"$sel>$rec</option>\n";
	}
}
$select_host.="</select>\n";

$placelist = array(
		"1" => "北海道",
		"01011" => "札",
		"01012" => "札幌",
		"01021" => "函",
		"01022" => "函館",
		"01031" => "旭",
		"01032" => "旭川",
		"01041" => "室",
		"01042" => "室蘭",
		"01051" => "釧",
		"01052" => "釧路",
		"01061" => "帶",
		"01062" => "帯広",
		"01071" => "北",
		"01072" => "北見",
		"2" => "青森県",
		"02011" => "青",
		"02012" => "青森",
		"02022" => "八戸",
		"3" => "岩手県",
		"03011" => "岩",
		"03012" => "岩手",
		"03022" => "盛岡",
		"03032" => "平泉",
		"4" => "宮城県",
		"04011" => "宮",
		"04012" => "宮城",
		"04022" => "仙台",
		"5" => "秋田県",
		"05011" => "秋",
		"05012" => "秋田",
		"6" => "山形県",
		"06012" => "山形",
		"06022" => "庄内",
		"7" => "福島県",
		"07012" => "福島",
		"07022" => "いわき",
		"07032" => "会津",
		"07042" => "郡山",
		"8" => "茨城県",
		"08011" => "茨",
		"08012" => "茨城",
		"08022" => "水戸",
		"08032" => "土浦",
		"08042" => "つくば",
		"9" => "栃木県",
		"09011" => "栃",
		"09012" => "栃木",
		"09022" => "宇都宮",
		"09032" => "とちぎ",
		"09042" => "那須",
		"10" => "群馬県",
		"10011" => "群",
		"10012" => "群馬",
		"10022" => "高崎",
		"10032" => "前橋",
		"11" => "埼玉県",
		"11011" => "埼",
		"11012" => "大宮",
		"11022" => "所沢",
		"11032" => "熊谷",
		"11042" => "春日部",
		"11052" => "川越",
		"11062" => "川口",
		"11072" => "越谷",
		"12" => "千葉県",
		"12011" => "千",
		"12012" => "千葉",
		"12022" => "習志野",
		"12032" => "袖ヶ浦",
		"12042" => "野田",
		"12052" => "柏",
		"12062" => "成田",
		"13" => "東京都",
		"13021" => "品",
		"13022" => "品川",
		"13031" => "足",
		"13032" => "足立",
		"13041" => "練",
		"13042" => "練馬",
		"13051" => "多",
		"13052" => "多摩",
		"13062" => "八王子",
		"13072" => "杉並",
		"13082" => "世田谷",
		"14" => "神奈川県",
		"14011" => "神",
		"14012" => "横浜",
		"14022" => "川崎",
		"14032" => "相模",
		"14042" => "湘南",
		"15" => "新潟県",
		"15011" => "新",
		"15012" => "新潟",
		"15022" => "長岡",
		"16" => "富山県",
		"16011" => "富",
		"16012" => "富山",
		"17" => "石川県",
		"17011" => "石（旧）",
		"17012" => "石",
		"17013" => "石川",
		"17022" => "金沢",
		"18" => "福井県",
		"18011" => "福井",
		"18012" => "福井",
		"19" => "山梨県",
		"19012" => "山梨",
		"19022" => "富士山",
		"20" => "長野県",
		"20011" => "長",
		"20012" => "長野",
		"20022" => "松本",
		"20032" => "諏訪",
		"21" => "岐阜県",
		"21011" => "岐",
		"21012" => "岐阜",
		"21022" => "飛騨",
		"22" => "静岡県",
		"22011" => "靜",
		"22012" => "静",
		"22013" => "静岡",
		"22022" => "浜松",
		"22032" => "沼津",
		"22042" => "伊豆",
		"19022" => "富士山",
		"23" => "愛知県",
		"23011" => "愛",
		"23012" => "名古屋",
		"23022" => "豊橋",
		"23032" => "三河",
		"23042" => "尾張小牧",
		"23052" => "一宮",
		"23062" => "岡崎",
		"23072" => "豊田",
		"23082" => "春日井",
		"24" => "三重県",
		"24011" => "三",
		"24012" => "三重",
		"24022" => "鈴鹿",
		"25" => "滋賀県",
		"25011" => "滋",
		"25012" => "滋賀",
		"26" => "京都府",
		"26011" => "京",
		"26012" => "京都",
		"27" => "大阪府",
		"27011" => "大",
		"27012" => "大阪",
		"27022" => "なにわ",
		"27031" => "泉",
		"27032" => "和泉",
		"27042" => "堺",
		"28" => "兵庫県",
		"28011" => "兵",
		"28012" => "神戸",
		"28022" => "姫路",
		"29" => "奈良県",
		"29011" => "奈",
		"29012" => "奈良",
		"30" => "和歌山県",
		"30011" => "和",
		"30012" => "和歌山",
		"31" => "鳥取県",
		"31011" => "鳥",
		"31012" => "鳥取",
		"32" => "島根県",
		"32012" => "島根",
		"33" => "岡山県",
		"33011" => "岡",
		"33012" => "岡山",
		"33022" => "倉敷",
		"34" => "広島県",
		"34011" => "広",
		"34012" => "広島",
		"34022" => "福山",
		"35" => "山口県",
		"35011" => "山",
		"35012" => "山口",
		"35022" => "下関",
		"36" => "徳島県",
		"36011" => "徳",
		"36012" => "徳島",
		"37" => "香川県",
		"37011" => "香",
		"37012" => "香川",
		"38" => "愛媛県",
		"38011" => "愛媛（旧）",
		"38012" => "愛媛（現行）",
		"39" => "高知県",
		"39011" => "髙",
		"39012" => "高",
		"39022" => "高知",
		"40" => "福岡県",
		"40011" => "福",
		"40012" => "福岡",
		"40022" => "北九州",
		"40032" => "久留米",
		"40042" => "筑豊",
		"41" => "佐賀県",
		"41011" => "佐",
		"41012" => "佐賀",
		"42" => "長崎県",
		"42012" => "長崎",
		"42022" => "佐世保",
		"43" => "熊本県",
		"43011" => "熊",
		"43012" => "熊本",
		"44" => "大分県",
		"44011" => "大分（旧）",
		"44012" => "大分（現行）",
		"45" => "宮崎県",
		"45012" => "宮崎",
		"46" => "鹿児島県",
		"46011" => "鹿",
		"46012" => "鹿児島",
		"46022" => "奄美",
		"47" => "沖縄県",
		"47011" => "沖",
		"47012" => "沖縄"
	);
$kanalist = array(
		'あ', 'い', 'う', 'え',
		'か', 'き', 'く', 'け', 'こ',
		'さ', 'す', 'せ', 'そ',
		'た', 'ち', 'つ', 'て', 'と',
		'な', 'に', 'ぬ', 'ね', 'の',
		'は', 'ひ', 'ふ', 'ほ',
		'ま', 'み', 'む', 'め', 'も',
		'や', 'ゆ', 'よ',
		'ら', 'り', 'る', 'れ', 'ろ',
		'わ', 'を',
		'Ａ', 'Ｃ', 'Ｅ', 'Ｙ'
	);
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title><?=$title;?></title>
</head>

<?php if($CMS): ?>
<body>
<?php else: ?>
<body onLoad="onBodyLoaded();">
<script>
function onBodyLoaded()
{
	<?=$reload;?>
<?php if($host): ?>
	document.getElementById('numberplate').hidden=true;
	document.getElementById('upload').hidden=true;
<?php else: ?>
<?php if($upload): ?>
	document.getElementById('camera').hidden=true;
	document.getElementById('numberplate').hidden=true;
<?php else: ?>
	document.getElementById('camera').hidden=true;
	document.getElementById('upload').hidden=true;
<?php endif; ?>
<?php endif; ?>
}
</script>
<?php endif; ?>

<h2><?=$title;?></h2>
<form action="<?=$save;?>" method="post" enctype="multipart/form-data">
<?php if($CMS): ?>
<h3>■ 録画サーバー</h3>
<table><tr>
    <td>録画サーバー</td>
	<td><?=$select_host;?></td>
</tr></table>
<?php else: ?>
<h3>■ 画像</h3>
<p>
<table border=1 frame="box"rules="none"  cellpadding=5>
<tr><td align=center>現在の画像</td></tr>
<tr><td align=center><?=$img;?></td></tr>
</table>
<p>
・画像のタイプ：
<select id="picture" name="picture" onchange="onPicture();">
<?php if($host): ?>
<option value="camera" selected>録画画像を表示</option>
<option value="numberplate">ナンバープレート画像を作成</option>
<option value="upload">画像ファイルをアップロード</option>
<?php else: ?>
<?php if($upload): ?>
<option value="camera">録画画像を表示</option>
<option value="numberplate">ナンバープレート画像を作成</option>
<option value="upload" selected>画像ファイルをアップロード</option>
<?php else: ?>
<option value="camera">録画画像を表示</option>
<option value="numberplate" selected>ナンバープレート画像を作成</option>
<option value="upload">画像ファイルをアップロード</option>
<?php endif; ?>
<?php endif; ?>
</select>
<script>
function onPicture()
{
	var pic=document.getElementById("picture");
	var cam=document.getElementById("camera");
	var num=document.getElementById("numberplate");
	var upl=document.getElementById("upload");
	if(pic.value=="camera"){
		cam.hidden=false;
		num.hidden=true;
		upl.hidden=true;
	} else {
		cam.hidden=true;
		if(pic.value=="upload"){
			num.hidden=true;
			upl.hidden=false;
		} else {
			num.hidden=false;
			upl.hidden=true;
		}
	}
}
</script>
<p>
<div id="camera">
<table><tr>
    <td>録画サーバー</td>
	<td><?=$select_host;?></td>
</tr></table>
</div>
<div id="numberplate">
<table>
  <tr>
	<td>種別</td>
	<td><select name="base">
		  <?php $sel=($data[NP_BASE]!="1")?" selected":""; ?>
	      <option value="0"<?=$sel;?>>自家用</option>
		  <?php $sel=($data[NP_BASE]=="1")?" selected":""; ?>
	      <option value="1"<?=$sel;?>>事業用</option>
		</select>
	</td>
  </tr><tr>
	<td>地名</td>
	<td><select name="place">
		<?php 
		foreach($placelist as $code => $text){
			if(strlen($text)<=3) continue;
			if(strpos($text,"（旧）")!==false) continue;
			$text=str_replace("（現行）","",$text);
			$option="<option value=\"$code\"";		
			if(strlen($code)<=2){
				$option.=" disabled";
				$text="--- $text ---";
			}
			if($code==$data[NP_PLACE]){
				$option.=" selected";
			}
			$option.=">$text</option>\n";
		?>
			<?=$option;?>
		<?php 
		}
		?>
	    </select>
	</td>
  </tr><tr>
	<td>分類</td>
	<td><input name="class" type="number" min="1" max="999" value="<?=$data[NP_CLASS];?>"></td>
  </tr><tr>
	<td>かな</td>
	<td><select name="kana">
		<?php 
		foreach($kanalist as $code => $text){
			if(strlen($code)<2) $code="0$code";
			$sel=($code==$data[NP_KANA])?" selected":"";
			$option="<option value=\"$code\"$sel>$text</option>\n";
		?>
			<?=$option;?>
		<?php 
		}
		?>
		</select>
	</td>
  </tr><tr>
	<td>番号</td>
	<td><input name="number" type="number" min="1" max="9999" value="<?=$data[NP_NUMBER];?>"></td>
  </tr>
</table>
</div>
<div id="upload">
アップロードする画像：
<input type="file" name="upload" size="30">
</div>
<p>
<h3>■ 軌跡</h3>
<p>
<table border=1 frame="box"rules="none"  cellpadding=5>
<tr><td align=center>現在の軌跡</td></tr>
<tr><td><hr size=2 color="<?=$data[TRACKS];?>"></td></tr>
</table>
<p>
<table>
  <tr>
    <td>色</td>
    <!--td><select name="tracks">
		  <?php $sel=($data[TRACKS]=="#000")?" selected":""; ?>
		  <option value="#000"<?=$sel;?>>黒</option>
		  <?php $sel=($data[TRACKS]=="#a00")?" selected":""; ?>
		  <option value="#a00"<?=$sel;?>>赤</option>
		  <?php $sel=($data[TRACKS]=="#0a0")?" selected":""; ?>
		  <option value="#0a0"<?=$sel;?>>緑</option>
		  <?php $sel=($data[TRACKS]=="#00a")?" selected":""; ?>
		  <option value="#00a"<?=$sel;?>>青</option>
		  <?php $sel=($data[TRACKS]=="#880")?" selected":""; ?>
		  <option value="#880"<?=$sel;?>>黄</option>
		  <?php $sel=($data[TRACKS]=="#088")?" selected":""; ?>
		  <option value="#088"<?=$sel;?>>水</option>
		  <?php $sel=($data[TRACKS]=="#808")?" selected":""; ?>
		  <option value="#808"<?=$sel;?>>紫</option>
		  <?php $sel=($data[TRACKS]=="#fff")?" selected":""; ?>
		  <option value="#fff"<?=$sel;?>>白</option>
		</select>
	</td-->
	<td><input name="tracks" type="text" maxlength="7" value="<?=$data[TRACKS];?>"></td>
	<td>（HTML の色指定文法）</td>
  </tr>
</table>
<?php endif; ?>
<p>
<input type="submit" value="更新">
</form>
<p>
<a href="#" onClick="window.close(); return false;">閉じる</a>・<a href="settings.php">戻る</a>
</body>
</html>