/****** ナンバープレートシミュレーション ******/

const XWIDTH = 300;//画像幅サイズ
var aftimes = 0;//Afi表示回数


//ボタン押下
function btnNumber() {
    prtResultNumber();
}

//メイン処理
function prtNumber() {
	prtInputNumber();
	prtResultNumber();
    
}

//入力部分
function prtInputNumber() {
	var i;

	var NM_DEF_SHUBETU = 0;
	var NM_DEF_TIMEI = 13022;
	var NM_DEF_BUNRUI = 300;
	var NM_DEF_ITIREN = 1234;
	var nm_shubetulist = [ 
		'中型白（登録車・自家用）',
		'中型緑（登録車・事業用）',
		'中型黄（軽自動車・自家用）',
		'中型黒（軽自動車・事業用）',
		'大型白（登録車・自家用）',
		'大型緑（登録車・事業用）',
		'小型白（自動二輪車・自家用）',
		'小型緑（自動二輪車・事業用）',
		'小型白（軽自動車・自家用）',
		'小型緑（軽自動車・事業用）'
	];
	var nm_kanalist = [
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
	];

	var nm_placelist = [
		[00000, "北海道"],
		[ 1011, "札"],
		[ 1012, "札幌"],
		[ 1021, "函"],
		[ 1022, "函館"],
		[ 1031, "旭"],
		[ 1032, "旭川"],
		[ 1041, "室"],
		[ 1042, "室蘭"],
		[ 1051, "釧"],
		[ 1052, "釧路"],
		[ 1061, "帶"],
		[ 1062, "帯広"],
		[ 1071, "北"],
		[ 1072, "北見"],
		[00000, "青森県"],
		[ 2011, "青"],
		[ 2012, "青森"],
		[ 2022, "八戸"],
		[00000, "岩手県"],
		[ 3011, "岩"],
		[ 3012, "岩手"],
		[ 3022, "盛岡"],
		[ 3032, "平泉"],
		[00000, "宮城県"],
		[ 4011, "宮"],
		[ 4012, "宮城"],
		[ 4022, "仙台"],
		[00000, "秋田県"],
		[ 5011, "秋"],
		[ 5012, "秋田"],
		[00000, "山形県"],
		[ 6012, "山形"],
		[ 6022, "庄内"],
		[00000, "福島県"],
		[ 7012, "福島"],
		[ 7022, "いわき"],
		[ 7032, "会津"],
		[ 7042, "郡山"],
		[00000, "茨城県"],
		[ 8011, "茨"],
		[ 8012, "茨城"],
		[ 8022, "水戸"],
		[ 8032, "土浦"],
		[ 8042, "つくば"],
		[00000, "栃木県"],
		[ 9011, "栃"],
		[ 9012, "栃木"],
		[ 9022, "宇都宮"],
		[ 9032, "とちぎ"],
		[ 9042, "那須"],
		[00000, "群馬県"],
		[10011, "群"],
		[10012, "群馬"],
		[10022, "高崎"],
		[10032, "前橋"],
		[00000, "埼玉県"],
		[11011, "埼"],
		[11012, "大宮"],
		[11022, "所沢"],
		[11032, "熊谷"],
		[11042, "春日部"],
		[11052, "川越"],
		[11062, "川口"],
		[11072, "越谷"],
		[00000, "千葉県"],
		[12011, "千"],
		[12012, "千葉"],
		[12022, "習志野"],
		[12032, "袖ヶ浦"],
		[12042, "野田"],
		[12052, "柏"],
		[12062, "成田"],
		[00000, "東京都"],
		[13021, "品"],
		[13022, "品川"],
		[13031, "足"],
		[13032, "足立"],
		[13041, "練"],
		[13042, "練馬"],
		[13051, "多"],
		[13052, "多摩"],
		[13062, "八王子"],
		[13072, "杉並"],
		[13082, "世田谷"],
		[00000, "神奈川県"],
		[14011, "神"],
		[14012, "横浜"],
		[14022, "川崎"],
		[14032, "相模"],
		[14042, "湘南"],
		[00000, "新潟県"],
		[15011, "新"],
		[15012, "新潟"],
		[15022, "長岡"],
		[00000, "富山県"],
		[16011, "富"],
		[16012, "富山"],
		[00000, "石川県"],
		[17011, "石（旧）"],
		[17012, "石"],
		[17013, "石川"],
		[17022, "金沢"],
		[00000, "福井県"],
		[18011, "福井"],
		[18012, "福井"],
		[00000, "山梨県"],
		[19012, "山梨"],
		[19022, "富士山"],
		[00000, "長野県"],
		[20011, "長"],
		[20012, "長野"],
		[20022, "松本"],
		[20032, "諏訪"],
		[00000, "岐阜県"],
		[21011, "岐"],
		[21012, "岐阜"],
		[21022, "飛騨"],
		[00000, "静岡県"],
		[22011, "靜"],
		[22012, "静"],
		[22013, "静岡"],
		[22022, "浜松"],
		[22032, "沼津"],
		[22042, "伊豆"],
		[19022, "富士山"],
		[00000, "愛知県"],
		[23011, "愛"],
		[23012, "名古屋"],
		[23022, "豊橋"],
		[23032, "三河"],
		[23042, "尾張小牧"],
		[23052, "一宮"],
		[23062, "岡崎"],
		[23072, "豊田"],
		[23082, "春日井"],
		[00000, "三重県"],
		[24011, "三"],
		[24012, "三重"],
		[24022, "鈴鹿"],
		[00000, "滋賀県"],
		[25011, "滋"],
		[25012, "滋賀"],
		[00000, "京都府"],
		[26011, "京"],
		[26012, "京都"],
		[00000, "大阪府"],
		[27011, "大"],
		[27012, "大阪"],
		[27022, "なにわ"],
		[27031, "泉"],
		[27032, "和泉"],
		[27042, "堺"],
		[00000, "兵庫県"],
		[28011, "兵"],
		[28012, "神戸"],
		[28022, "姫路"],
		[00000, "奈良県"],
		[29011, "奈"],
		[29012, "奈良"],
		[00000, "和歌山県"],
		[30011, "和"],
		[30012, "和歌山"],
		[00000, "鳥取県"],
		[31011, "鳥"],
		[31012, "鳥取"],
		[00000, "島根県"],
		[32012, "島根"],
		[00000, "岡山県"],
		[33011, "岡"],
		[33012, "岡山"],
		[33022, "倉敷"],
		[00000, "広島県"],
		[34011, "広"],
		[34012, "広島"],
		[34022, "福山"],
		[00000, "山口県"],
		[35011, "山"],
		[35012, "山口"],
		[35022, "下関"],
		[00000, "徳島県"],
		[36011, "徳"],
		[36012, "徳島"],
		[00000, "香川県"],
		[37011, "香"],
		[37012, "香川"],
		[00000, "愛媛県"],
		[38011, "愛媛（旧）"],
		[38012, "愛媛（現行）"],
		[00000, "高知県"],
		[39011, "髙"],
		[39012, "高"],
		[39022, "高知"],
		[00000, "福岡県"],
		[40011, "福"],
		[40012, "福岡"],
		[40022, "北九州"],
		[40032, "久留米"],
		[40042, "筑豊"],
		[00000, "佐賀県"],
		[41011, "佐"],
		[41012, "佐賀"],
		[00000, "長崎県"],
		[42012, "長崎"],
		[42022, "佐世保"],
		[00000, "熊本県"],
		[43011, "熊"],
		[43012, "熊本"],
		[00000, "大分県"],
		[44011, "大分（旧）"],
		[44012, "大分（現行）"],
		[00000, "宮崎県"],
		[45012, "宮崎"],
		[00000, "鹿児島県"],
		[46011, "鹿"],
		[46012, "鹿児島"],
		[46022, "奄美"],
		[00000, "沖縄県"],
		[47011, "沖"],
		[47012, "沖縄"]
	];

    //スタイル部
    document.write('<style>');
    document.write('#hdr1 {');
    document.write('  margin: 20px -10px 15px -10px;');
    document.write('  padding: 10px;');
    document.write('  border-top: solid 1px #bec5cf;');
    document.write('  border-bottom: solid 1px #3f4e63;');
    document.write('  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #acb9c9), color-stop(0.5, #8395af), color-stop(0.5, #7388a5), color-stop(1, #7488a1));');
    document.write('  color: #fff;');
    document.write('  font-size: 16px;');
    document.write('  font-weight: bold;');
    document.write('  text-shadow: -1px -1px 0 #434b57;');
    document.write('  text-align: center;');
    document.write('}');
    document.write('#nm_plate{');
    document.write('  margin-top: 10px;');
    document.write('}');
    
    document.write('');
 
    document.write('</style>');
  
    //ヘッダ部
    document.write('<div id="hdr1">ナンバープレートシミュレーション</div>');

	//入力部
	document.write('<table class="inputarea">');
	document.write('	<tr><td>種別</td>');
	document.write('		<td>');
	document.write('<select id="nm_shubetu" onchange="btnNumber();">');
	for (i=0; i<nm_shubetulist.length; i++){
		document.write('<option value="' + i + '" > '+nm_shubetulist[i]+' </option>');
	}
	document.write('</select>');
	document.write('	</td>');
	document.write('	</tr>');

	document.write('	<tr><td>地名</td><td>');
	document.write('<select id="nm_place" onchange="btnNumber();">');
	for (i = 0; i < nm_placelist.length; i++){
		if(nm_placelist[i][0]!=00000) {
			if (nm_placelist[i][0]==NM_DEF_TIMEI) {
				document.write('<option value=\"'+nm_placelist[i][0]+'\" selected>　'+nm_placelist[i][1]+'</option>');
			} else {
				document.write('<option value=\"'+nm_placelist[i][0]+'\">　'+nm_placelist[i][1]+'</option>');
			}
		} else {
			document.write('<option value=\"'+nm_placelist[i][0]+'\" disabled>--- '+nm_placelist[i][1]+' ---</option>');
		}
	}
	document.write('</select>');
	document.write('<select id="nm_place_c" onchange="btnNumber();">');
	document.write('<option value=\"-1\">-</option>');
	document.write('<option value=\"1\">C</option>');
	document.write('</select>');
	document.write('	</td>');
	document.write('	</tr>');

	var nm_def_bun1 = Math.floor(NM_DEF_BUNRUI / 100);
	document.write('	<tr><td>分類番号</td><td>');
	document.write('<select id="nm_bunrui1" onchange="btnNumber();">');
	document.write('<option value=\"-1\">-</option>');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_bun1 ) {
			document.write('<option value=\"'+i+'\" selected>'+i+'</option>');
		} else {
			document.write('<option value=\"'+i+'\">'+i+'</option>');
		}
	}
	document.write('</select>');
	var nm_def_bun2 = Math.floor(NM_DEF_BUNRUI / 10) % 10;
	document.write('<select id="nm_bunrui2" onchange="btnNumber();">');
	document.write('<option value=\"-1\">-</option>');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_bun2 ) {
			document.write('<option value=\"'+i+'\" selected>'+i+'</option>');
		} else {
			document.write('<option value=\"'+i+'\">'+i+'</option>');
		}
	}
	document.write('</select>');
	var nm_def_bun3 = NM_DEF_BUNRUI % 10;
	document.write('<select id="nm_bunrui3" onchange="btnNumber();">');
	document.write('<option value=\"-1\">-</option>');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_bun3 ) {
			document.write('<option value=\"'+i+'\" selected>'+i+'</option>');
		} else {
			document.write('<option value=\"'+i+'\">'+i+'</option>');
		}
	}
	document.write('</select>');
    //二輪250ccオーバー　チェック
    document.write('	<label><input type="checkbox" id="nm_over250" name="nm_over250" value="1" onchange="btnNumber();">二輪</label>');
	document.write('	</td>');
	document.write('	</tr>');
	document.write('	<tr><td>かな</td>');
	document.write('		<td>');
	document.write('<select id="nm_kana" onchange="btnNumber();">');
	for (i=0; i<nm_kanalist.length; i++){
		document.write('<option value="' + num0Format(i) + '" > '+nm_kanalist[i]+' </option>');
	}
	document.write('</select>');
	document.write('	</td>');
	document.write('	</tr>');


	var nm_def_iti1 = Math.floor(NM_DEF_ITIREN / 1000);
	document.write('	<tr><td>一連番号</td><td>');
	document.write('<select id="nm_itiren1" onchange="btnNumber();">');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_iti1 ) {
			document.write('<option value="'+i+'" selected>'+i+'</option>');
		} else {
			document.write('<option value="'+i+'">'+i+'</option>');
		}
	}
	document.write('</select>');
	var nm_def_iti2 = Math.floor(NM_DEF_ITIREN / 100) % 10;
	document.write('<select id="nm_itiren2" onchange="btnNumber();">');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_iti2 ) {
			document.write('<option value="'+i+'" selected>'+i+'</option>');
		} else {
			document.write('<option value="'+i+'">'+i+'</option>');
		}
	}
	document.write('</select>');
	var nm_def_iti3 = Math.floor(NM_DEF_ITIREN / 10) % 10;
	document.write('<select id="nm_itiren3" onchange="btnNumber();">');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_iti3 ) {
			document.write('<option value="'+i+'" selected>'+i+'</option>');
		} else { 
			document.write('<option value="'+i+'">'+i+'</option>');
		}
	}
	document.write('</select>');
	var nm_def_iti4 = NM_DEF_ITIREN % 10;
	document.write('<select id="nm_itiren4" onchange="btnNumber();">');
	for (i = 0; i < 10; i++){
		if ( i==nm_def_iti4 ) {
			document.write('<option value="'+i+'" selected>'+i+'</option>');
		} else { 
			document.write('<option value="'+i+'">'+i+'</option>');
		}
	}
	document.write('</select>');
	document.write('	</td>');
	document.write('	</tr>');

	document.write('</table>');

    document.write('<div id="nm_plate"></div><br>');

    if ( aftimes==0 ) { prtAfi(); }
    //aftimes += 1;

    document.write('<div style="clear: both"></div>');
	prtClose("number");

}

//結果表示
function prtResultNumber() {

//    var NM_PATH = "http://pyuadora.com/about/tools/numberimg/";
    var NM_PATH = "./img/";
	var st = "position: absolute;";

	var nm_imgstr = "";

	//プレート種別
	var nm_shubetu = parseInt(document.getElementById('nm_shubetu').value);

	//地名
	var nm_place = ('00000' + document.getElementById('nm_place').value).slice(-5);
	var nm_place_c = document.getElementById('nm_place_c').value;

	//分類番号
	var nm_bun1 = parseInt(document.getElementById('nm_bunrui1').value);
	var nm_bun2 = parseInt(document.getElementById('nm_bunrui2').value);
	var nm_bun3 = parseInt(document.getElementById('nm_bunrui3').value);
	var nm_bunruiketa;
	var nm_bunrui;
	if (nm_bun1==-1) 	{ nm_bunruiketa = 0; nm_bunrui = 0;}
	else if (nm_bun2==-1) 	{ nm_bunruiketa = 1; nm_bunrui = nm_bun1;}
	else if (nm_bun3==-1) 	{ nm_bunruiketa = 2; nm_bunrui = nm_bun1 * 10  + nm_bun2; }
	else 			{ nm_bunruiketa = 3; nm_bunrui = nm_bun1 * 100 + nm_bun2 * 10 + nm_bun3; }

	if ( (nm_bunruiketa==0) && ((nm_shubetu<6)||(nm_shubetu>7)) ) {
		alert('分類番号の先頭に０～９をセットしてください。'); return;
	}

    var nm_over250chk = 0;
    if ( document.getElementById('nm_over250').checked==true ) { nm_over250chk = 1; }
    
	//かな
	var nm_kana = document.getElementById('nm_kana').value;

	//一連番号
	var nm_iti1 = parseInt(document.getElementById('nm_itiren1').value);
	var nm_iti2 = parseInt(document.getElementById('nm_itiren2').value);
	var nm_iti3 = parseInt(document.getElementById('nm_itiren3').value);
	var nm_iti4 = parseInt(document.getElementById('nm_itiren4').value);
	var nm_itiren = nm_iti1 * 1000 + nm_iti2 * 100 + nm_iti3 * 10 + nm_iti4;

	if (nm_iti1==0) { nm_itir1 = 'o'; } else { nm_itir1 = nm_iti1; }
	if ((nm_iti2==0) && (nm_iti1==0)) { nm_itir2 = 'o'; } else { nm_itir2 = nm_iti2; }
	if ((nm_iti3==0) && (nm_iti2==0) && (nm_iti1==0)) { nm_itir3 = 'o'; } else { nm_itir3 = nm_iti3; }
	nm_itir4 = nm_iti4; 


	var top1 = 17;
	var top2 = 67;
    var pleft;
    var pwid;
	var phei;
	var atop;
	var aleft;
	var aleft_sub = 0;
	var awid;
	var ahei;
	var asize = "";
	var btop;
	var b1left;
	var b2left;
	var b3left;
    var bprint = 1;
	var bwid;
	var bhei;
	var bsize;
	var ctop;
	var cleft;
	var cwid;
	var chei;
	var d1left;
	var d2left;
	var d3left;
	var d4left;
	var d_left;
	var dtop;
	var dwid;
	var dhei;
	var col = "";

	//文字色
	switch ( nm_shubetu ) {
		case 0:	//白板
		case 4:
		case 6:
		case 8:
			col = "g"; break;
		case 2:	//黄板
			break;
		case 1:	//緑板
		case 5:
		case 7:
		case 9:
			col = "w"; break;
		case 3:	//黒板
			col = "y"; break;
	}

	switch ( nm_shubetu ) {
		case 0:	//中板
		case 1:
		case 2:
		case 3:
    		pwid = 330;
			phei = 165;
            pleft = fncLeft(pwid);
			atop = top1;
			awid = 108;
			ahei = 40;
			btop = top1;
			switch ( nm_bunruiketa ) {
				case 0:
					aleft = 85;
					break;
				case 1:
					aleft = 81;
					b1left = 200;
					bwid = 30;
					bsize = 2;
					break;
				case 2:
					aleft = 71;
					b1left = 184;
					b2left = 219;
					bwid = 30;
					bsize = 2;
					break;
				case 3:
					aleft = 68;
					b1left = 180;
					b2left = 206;
					b3left = 232;
					bwid = 23;
					bsize = 3;
					break;
			}
			bhei = 40;
			ctop = top2+20;
			cleft = 20;
			cwid = 40;
			chei = 40;
			dtop = top2;
			d_left = 180;
			d1left = 72;
			d2left = 126;
			d3left = 214;
			d4left = 268;
			dwid = 40;
			dhei = 80;
            
            //■
    		atop = fncResize(atop,pwid);
			awid = fncResize(awid,pwid);
			ahei = fncResize(ahei,pwid);
			btop = fncResize(btop,pwid);
			aleft = fncResize(aleft,pwid);
			b1left = fncResize(b1left,pwid);
			b2left = fncResize(b2left,pwid);
			b3left = fncResize(b3left,pwid);
			bwid = fncResize(bwid,pwid);
			bhei = fncResize(bhei,pwid);
			ctop = fncResize(ctop,pwid);
			cleft = fncResize(cleft,pwid);
			cwid = fncResize(cwid,pwid);
			chei = fncResize(chei,pwid);
			dtop = fncResize(dtop,pwid);
			d_left = fncResize(d_left,pwid);
			d1left = fncResize(d1left,pwid);
			d2left = fncResize(d2left,pwid);
			d3left = fncResize(d3left,pwid);
			d4left = fncResize(d4left,pwid);
			dwid = fncResize(dwid,pwid);
			dhei = fncResize(dhei,pwid);
    		phei = fncResize(phei,pwid);
        	pwid = fncResize(pwid,pwid);
			break;
		case 4:	//大板
		case 5:
        	pwid = 440;
			phei = 220;
            pleft = fncLeft(pwid);
			atop = top1;
			awid = 108;
			ahei = 40;
			btop = top1;
			switch ( nm_bunruiketa ) {
				case 0:
					aleft = 130;
					break;
				case 1:
					aleft = 125;
					b1left = 265;
					bwid = 30;
					break;
				case 2:
					aleft = 125;
					b1left = 240;
					b2left = 277;
					bwid = 30;
					break;
				case 3:
					aleft = 115;
					b1left = 226;
					b2left = 259;
					b3left = 292;
					bwid = 30;
					break;
			}
			switch ( nm_place ) {
				case "07022": //いわき
				case "08042": //つくば
				case "09022": //宇都宮
				case "09032": //とちぎ
				case "11042": //春日部
				case "12022": //習志野
				case "12032": //袖ヶ浦
				case "13062": //八王子
				case "13082": //世田谷
				case "19022": //富士山
				case "23012": //名古屋
				case "23082": //春日井
				case "27022": //なにわ
				case "30012": //和歌山
				case "40022": //北九州
				case "40032": //久留米
				case "42022": //佐世保
				case "46012": //鹿児島
					aleft = 90;
					awid = 130;
					asize = "L";
					aleft += 15;
					b1left += 15;
					b2left += 15;
					b3left += 15;
					break;
				case "23042": //尾張小牧
					aleft = 63;
					awid = 160;
					asize = "L";
					aleft += 25;
					b1left += 25;
					b2left += 25;
					b3left += 25;
					break;
			}
			bhei = 40;
			bsize = 2;
			ctop = 120;
			cleft = 20;
			cwid = 40;
			chei = 40;
			dtop = 80;
			d_left = 230;
			d1left = 76;
			d2left = 153;
			d3left = 277;
			d4left = 354;
			dwid = 60;
			dhei = 120;
            
            //■
        	atop = fncResize(atop,pwid);
			awid = fncResize(awid,pwid);
			ahei = fncResize(ahei,pwid);
			btop = fncResize(btop,pwid);
			aleft = fncResize(aleft,pwid);
			b1left = fncResize(b1left,pwid);
			b2left = fncResize(b2left,pwid);
			b3left = fncResize(b3left,pwid);
			bwid = fncResize(bwid,pwid);
			bhei = fncResize(bhei,pwid);
			ctop = fncResize(ctop,pwid);
			cleft = fncResize(cleft,pwid);
			cwid = fncResize(cwid,pwid);
			chei = fncResize(chei,pwid);
			dtop = fncResize(dtop,pwid);
			d_left = fncResize(d_left,pwid);
			d1left = fncResize(d1left,pwid);
			d2left = fncResize(d2left,pwid);
			d3left = fncResize(d3left,pwid);
			d4left = fncResize(d4left,pwid);
			dwid = fncResize(dwid,pwid);
			dhei = fncResize(dhei,pwid);
    		phei = fncResize(phei,pwid);
        	pwid = fncResize(pwid,pwid);
			break;
		case 6:	//二輪
		case 7:
            if ( nm_over250chk==1 ) { bprint=0; }
		case 8:	//小板
		case 9:
            pwid = 230;
			phei = 125;
            pleft = fncLeft(pwid);
			atop = 15;
			awid = 68;
			ahei = 30;
			aleft = 85;
			btop = 15;
			switch ( nm_bunruiketa ) {
				case 1:
					b1left = 60;
					break;
				case 2:
				case 3:
					nm_bunruiketa = 2;
					b1left = 22;
					b2left = 60;
					break;
			}
			bwid = 22;
			bhei = 30;
			bsize = 2;
			ctop = 15;
			cleft = 190;
			cwid = 25;
			chei = 30;
			dtop = 50;
			d_left = 107;
			d1left = 17;
			d2left = 62;
			d3left = 132;
			d4left = 177;
			dwid = 35;
			dhei = 60;
			break;

	}

    aleft += pleft;
	b1left += pleft;
	b2left += pleft;
	b3left += pleft;
	cleft += pleft;
	d1left += pleft;
	d2left += pleft;
	d3left += pleft;
	d4left += pleft;
	d_left += pleft;
    
    
    nm_imgstr += '<div id="nm_number" style="position: relative;">';
	nm_imgstr += '<img src="'+NM_PATH+'number_'+String(nm_shubetu)+'.png" style="'+st+' left:'+pleft+'px; width:'+pwid+'px; height:'+phei+'px;" alt="">';

	nm_imgstr += '<img src="'+NM_PATH+'a'+String(nm_place)+col+asize+'.png"  style="'+st+' top:'+atop+'px; left:'+aleft+'px; width:'+awid+'px; height:'+ahei+'px;">';
	if ( (nm_place_c>0) && (nm_shubetu>=6) ) {
		aleft_sub = aleft + awid ;
		nm_imgstr += '<img src="'+NM_PATH+'c43'+col+'.png"  style="'+st+' top:'+atop+'px; left:'+aleft_sub+'px; width:'+cwid+'px; height:'+chei+'px;">';
	}

    if ( bprint==1 ) {
	    switch ( nm_bunruiketa ) {
	    	case 1:
	    		nm_imgstr += '<img src="'+NM_PATH+'b'+String(bsize)+'_'+String(nm_bun1)+col+'.png" style="'+st+' top:'+btop+'px; left:'+b1left+'px; width:'+bwid+'px; height:'+bhei+'px;">';
	    		break;
	    	case 2:
	    		nm_imgstr += '<img src="'+NM_PATH+'b'+String(bsize)+'_'+String(nm_bun1)+col+'.png" style="'+st+' top:'+btop+'px; left:'+b1left+'px; width:'+bwid+'px; height:'+bhei+'px;">';
	    		nm_imgstr += '<img src="'+NM_PATH+'b'+String(bsize)+'_'+String(nm_bun2)+col+'.png" style="'+st+' top:'+btop+'px; left:'+b2left+'px; width:'+bwid+'px; height:'+bhei+'px;">';
	    		break;
	    	case 3:
	    		nm_imgstr += '<img src="'+NM_PATH+'b'+String(bsize)+'_'+String(nm_bun1)+col+'.png" style="'+st+' top:'+btop+'px; left:'+b1left+'px; width:'+bwid+'px; height:'+bhei+'px;">';
	    		nm_imgstr += '<img src="'+NM_PATH+'b'+String(bsize)+'_'+String(nm_bun2)+col+'.png" style="'+st+' top:'+btop+'px; left:'+b2left+'px; width:'+bwid+'px; height:'+bhei+'px;">';
	    		nm_imgstr += '<img src="'+NM_PATH+'b'+String(bsize)+'_'+String(nm_bun3)+col+'.png" style="'+st+' top:'+btop+'px; left:'+b3left+'px; width:'+bwid+'px; height:'+bhei+'px;">';
	    		break;
	    }
    }
	nm_imgstr += '<img src="'+NM_PATH+'c'+String(nm_kana)+col+'.png"  style="'+st+' top:'+ctop+'px; left:'+cleft+'px;  width:'+cwid+'px; height:'+chei+'px;">';
	nm_imgstr += '<img src="'+NM_PATH+'d'+String(nm_itir1)+col+'.png" style="'+st+' top:'+dtop+'px; left:'+d1left+'px; width:'+dwid+'px; height:'+dhei+'px;">';
	nm_imgstr += '<img src="'+NM_PATH+'d'+String(nm_itir2)+col+'.png" style="'+st+' top:'+dtop+'px; left:'+d2left+'px; width:'+dwid+'px; height:'+dhei+'px;">';
	if (nm_iti1>0) { nm_imgstr += '<img src="'+NM_PATH+'d-'+col+'.png"   style="'+st+' top:'+dtop+'px; left:'+d_left+'px; height:'+dhei+'px;">';}
	nm_imgstr += '<img src="'+NM_PATH+'d'+String(nm_itir3)+col+'.png" style="'+st+' top:'+dtop+'px; left:'+d3left+'px; width:'+dwid+'px; height:'+dhei+'px;">';
	nm_imgstr += '<img src="'+NM_PATH+'d'+String(nm_itir4)+col+'.png" style="'+st+' top:'+dtop+'px; left:'+d4left+'px; width:'+dwid+'px; height:'+dhei+'px;">';
	nm_imgstr += '';
    nm_imgstr += '</div>';
    
    //blank
    for (i=0;i<9;i++){ nm_imgstr += '<br>'; }
    nm_imgstr += '<div id="ftr1" style="text-align:center;">Copyright &#169; <a href="http://pyuadora.com/">ぴゅあどら</a></div>';

	document.getElementById("nm_plate").innerHTML = nm_imgstr; 

}
    
//AffiliateLink
function prtAfi() {  
    const AFIMAX = 5;//広告最大数
    var dt = new Date();
	var r = dt.getSeconds() % AFIMAX;
	switch ( r ) {
        case 0: document.write('<script language="javascript" src="http://ad.jp.ap.valuecommerce.com/servlet/smartphonebanner?sid=2165975&pid=882510587&position=inline"></script>');break;
    	case 1: document.write('<script language="javascript" src="http://ad.jp.ap.valuecommerce.com/servlet/smartphonebanner?sid=2165975&pid=882510592&position=inline"></script>');break;
    	case 2: document.write('<script language="javascript" src="http://ad.jp.ap.valuecommerce.com/servlet/smartphonebanner?sid=2165975&pid=882510566&position=inline"></script>');break;
    	case 3: document.write('<script language="javascript" src="http://ad.jp.ap.valuecommerce.com/servlet/smartphonebanner?sid=2165975&pid=882510546&position=inline"></script>');break;
    	case 4: document.write('<script language="javascript" src="http://ad.jp.ap.valuecommerce.com/servlet/smartphonebanner?sid=2165975&pid=882508606&position=inline"></script>');break;
    }
}


//座標リサイズ
function fncResize(i,pwid) {
    //プレート画像横サイズにあわせ、座標＆画像サイズをリサイズする
    var x = XWIDTH / pwid;
    var res = i * x;
    return Math.round(res);
}

//開始左端算出
function fncLeft(pwid) {
    //プレート画像横サイズからセンタリングできる左端を算出する
    if (pwid>XWIDTH) { return 0; }
    else { return Math.round((XWIDTH - pwid)/2); }
}
