/****** �i���o�[�v���[�g�V�~�����[�V���� ******/

const XWIDTH = 300;//�摜���T�C�Y
var aftimes = 0;//Afi�\����


//�{�^������
function btnNumber() {
    prtResultNumber();
}

//���C������
function prtNumber() {
	prtInputNumber();
	prtResultNumber();
    
}

//���͕���
function prtInputNumber() {
	var i;

	var NM_DEF_SHUBETU = 0;
	var NM_DEF_TIMEI = 13022;
	var NM_DEF_BUNRUI = 300;
	var NM_DEF_ITIREN = 1234;
	var nm_shubetulist = [ 
		'���^���i�o�^�ԁE���Ɨp�j',
		'���^�΁i�o�^�ԁE���Ɨp�j',
		'���^���i�y�����ԁE���Ɨp�j',
		'���^���i�y�����ԁE���Ɨp�j',
		'��^���i�o�^�ԁE���Ɨp�j',
		'��^�΁i�o�^�ԁE���Ɨp�j',
		'���^���i������֎ԁE���Ɨp�j',
		'���^�΁i������֎ԁE���Ɨp�j',
		'���^���i�y�����ԁE���Ɨp�j',
		'���^�΁i�y�����ԁE���Ɨp�j'
	];
	var nm_kanalist = [
		'��', '��', '��', '��',
		'��', '��', '��', '��', '��',
		'��', '��', '��', '��',
		'��', '��', '��', '��', '��',
		'��', '��', '��', '��', '��',
		'��', '��', '��', '��',
		'��', '��', '��', '��', '��',
		'��', '��', '��',
		'��', '��', '��', '��', '��',
		'��', '��',
		'�`', '�b', '�d', '�x'
	];

	var nm_placelist = [
		[00000, "�k�C��"],
		[ 1011, "�D"],
		[ 1012, "�D�y"],
		[ 1021, "��"],
		[ 1022, "����"],
		[ 1031, "��"],
		[ 1032, "����"],
		[ 1041, "��"],
		[ 1042, "����"],
		[ 1051, "��"],
		[ 1052, "���H"],
		[ 1061, "��"],
		[ 1062, "�эL"],
		[ 1071, "�k"],
		[ 1072, "�k��"],
		[00000, "�X��"],
		[ 2011, "��"],
		[ 2012, "�X"],
		[ 2022, "����"],
		[00000, "��茧"],
		[ 3011, "��"],
		[ 3012, "���"],
		[ 3022, "����"],
		[ 3032, "����"],
		[00000, "�{�錧"],
		[ 4011, "�{"],
		[ 4012, "�{��"],
		[ 4022, "���"],
		[00000, "�H�c��"],
		[ 5011, "�H"],
		[ 5012, "�H�c"],
		[00000, "�R�`��"],
		[ 6012, "�R�`"],
		[ 6022, "����"],
		[00000, "������"],
		[ 7012, "����"],
		[ 7022, "���킫"],
		[ 7032, "���"],
		[ 7042, "�S�R"],
		[00000, "��錧"],
		[ 8011, "��"],
		[ 8012, "���"],
		[ 8022, "����"],
		[ 8032, "�y�Y"],
		[ 8042, "����"],
		[00000, "�Ȗ،�"],
		[ 9011, "��"],
		[ 9012, "�Ȗ�"],
		[ 9022, "�F�s�{"],
		[ 9032, "�Ƃ���"],
		[ 9042, "�ߐ{"],
		[00000, "�Q�n��"],
		[10011, "�Q"],
		[10012, "�Q�n"],
		[10022, "����"],
		[10032, "�O��"],
		[00000, "��ʌ�"],
		[11011, "��"],
		[11012, "��{"],
		[11022, "����"],
		[11032, "�F�J"],
		[11042, "�t����"],
		[11052, "��z"],
		[11062, "���"],
		[11072, "�z�J"],
		[00000, "��t��"],
		[12011, "��"],
		[12012, "��t"],
		[12022, "�K�u��"],
		[12032, "�����Y"],
		[12042, "��c"],
		[12052, "��"],
		[12062, "���c"],
		[00000, "�����s"],
		[13021, "�i"],
		[13022, "�i��"],
		[13031, "��"],
		[13032, "����"],
		[13041, "��"],
		[13042, "���n"],
		[13051, "��"],
		[13052, "����"],
		[13062, "�����q"],
		[13072, "����"],
		[13082, "���c�J"],
		[00000, "�_�ސ쌧"],
		[14011, "�_"],
		[14012, "���l"],
		[14022, "���"],
		[14032, "����"],
		[14042, "�Ó�"],
		[00000, "�V����"],
		[15011, "�V"],
		[15012, "�V��"],
		[15022, "����"],
		[00000, "�x�R��"],
		[16011, "�x"],
		[16012, "�x�R"],
		[00000, "�ΐ쌧"],
		[17011, "�΁i���j"],
		[17012, "��"],
		[17013, "�ΐ�"],
		[17022, "����"],
		[00000, "���䌧"],
		[18011, "����"],
		[18012, "����"],
		[00000, "�R����"],
		[19012, "�R��"],
		[19022, "�x�m�R"],
		[00000, "���쌧"],
		[20011, "��"],
		[20012, "����"],
		[20022, "���{"],
		[20032, "�z�K"],
		[00000, "�򕌌�"],
		[21011, "��"],
		[21012, "��"],
		[21022, "���"],
		[00000, "�É���"],
		[22011, "��"],
		[22012, "��"],
		[22013, "�É�"],
		[22022, "�l��"],
		[22032, "����"],
		[22042, "�ɓ�"],
		[19022, "�x�m�R"],
		[00000, "���m��"],
		[23011, "��"],
		[23012, "���É�"],
		[23022, "�L��"],
		[23032, "�O��"],
		[23042, "�������q"],
		[23052, "��{"],
		[23062, "����"],
		[23072, "�L�c"],
		[23082, "�t����"],
		[00000, "�O�d��"],
		[24011, "�O"],
		[24012, "�O�d"],
		[24022, "�鎭"],
		[00000, "���ꌧ"],
		[25011, "��"],
		[25012, "����"],
		[00000, "���s�{"],
		[26011, "��"],
		[26012, "���s"],
		[00000, "���{"],
		[27011, "��"],
		[27012, "���"],
		[27022, "�Ȃɂ�"],
		[27031, "��"],
		[27032, "�a��"],
		[27042, "��"],
		[00000, "���Ɍ�"],
		[28011, "��"],
		[28012, "�_��"],
		[28022, "�P�H"],
		[00000, "�ޗǌ�"],
		[29011, "��"],
		[29012, "�ޗ�"],
		[00000, "�a�̎R��"],
		[30011, "�a"],
		[30012, "�a�̎R"],
		[00000, "���挧"],
		[31011, "��"],
		[31012, "����"],
		[00000, "������"],
		[32012, "����"],
		[00000, "���R��"],
		[33011, "��"],
		[33012, "���R"],
		[33022, "�q�~"],
		[00000, "�L����"],
		[34011, "�L"],
		[34012, "�L��"],
		[34022, "���R"],
		[00000, "�R����"],
		[35011, "�R"],
		[35012, "�R��"],
		[35022, "����"],
		[00000, "������"],
		[36011, "��"],
		[36012, "����"],
		[00000, "���쌧"],
		[37011, "��"],
		[37012, "����"],
		[00000, "���Q��"],
		[38011, "���Q�i���j"],
		[38012, "���Q�i���s�j"],
		[00000, "���m��"],
		[39011, "��"],
		[39012, "��"],
		[39022, "���m"],
		[00000, "������"],
		[40011, "��"],
		[40012, "����"],
		[40022, "�k��B"],
		[40032, "�v����"],
		[40042, "�}�L"],
		[00000, "���ꌧ"],
		[41011, "��"],
		[41012, "����"],
		[00000, "���茧"],
		[42012, "����"],
		[42022, "������"],
		[00000, "�F�{��"],
		[43011, "�F"],
		[43012, "�F�{"],
		[00000, "�啪��"],
		[44011, "�啪�i���j"],
		[44012, "�啪�i���s�j"],
		[00000, "�{�茧"],
		[45012, "�{��"],
		[00000, "��������"],
		[46011, "��"],
		[46012, "������"],
		[46022, "����"],
		[00000, "���ꌧ"],
		[47011, "��"],
		[47012, "����"]
	];

    //�X�^�C����
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
  
    //�w�b�_��
    document.write('<div id="hdr1">�i���o�[�v���[�g�V�~�����[�V����</div>');

	//���͕�
	document.write('<table class="inputarea">');
	document.write('	<tr><td>���</td>');
	document.write('		<td>');
	document.write('<select id="nm_shubetu" onchange="btnNumber();">');
	for (i=0; i<nm_shubetulist.length; i++){
		document.write('<option value="' + i + '" > '+nm_shubetulist[i]+' </option>');
	}
	document.write('</select>');
	document.write('	</td>');
	document.write('	</tr>');

	document.write('	<tr><td>�n��</td><td>');
	document.write('<select id="nm_place" onchange="btnNumber();">');
	for (i = 0; i < nm_placelist.length; i++){
		if(nm_placelist[i][0]!=00000) {
			if (nm_placelist[i][0]==NM_DEF_TIMEI) {
				document.write('<option value=\"'+nm_placelist[i][0]+'\" selected>�@'+nm_placelist[i][1]+'</option>');
			} else {
				document.write('<option value=\"'+nm_placelist[i][0]+'\">�@'+nm_placelist[i][1]+'</option>');
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
	document.write('	<tr><td>���ޔԍ�</td><td>');
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
    //���250cc�I�[�o�[�@�`�F�b�N
    document.write('	<label><input type="checkbox" id="nm_over250" name="nm_over250" value="1" onchange="btnNumber();">���</label>');
	document.write('	</td>');
	document.write('	</tr>');
	document.write('	<tr><td>����</td>');
	document.write('		<td>');
	document.write('<select id="nm_kana" onchange="btnNumber();">');
	for (i=0; i<nm_kanalist.length; i++){
		document.write('<option value="' + num0Format(i) + '" > '+nm_kanalist[i]+' </option>');
	}
	document.write('</select>');
	document.write('	</td>');
	document.write('	</tr>');


	var nm_def_iti1 = Math.floor(NM_DEF_ITIREN / 1000);
	document.write('	<tr><td>��A�ԍ�</td><td>');
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

//���ʕ\��
function prtResultNumber() {

//    var NM_PATH = "http://pyuadora.com/about/tools/numberimg/";
    var NM_PATH = "./img/";
	var st = "position: absolute;";

	var nm_imgstr = "";

	//�v���[�g���
	var nm_shubetu = parseInt(document.getElementById('nm_shubetu').value);

	//�n��
	var nm_place = ('00000' + document.getElementById('nm_place').value).slice(-5);
	var nm_place_c = document.getElementById('nm_place_c').value;

	//���ޔԍ�
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
		alert('���ޔԍ��̐擪�ɂO�`�X���Z�b�g���Ă��������B'); return;
	}

    var nm_over250chk = 0;
    if ( document.getElementById('nm_over250').checked==true ) { nm_over250chk = 1; }
    
	//����
	var nm_kana = document.getElementById('nm_kana').value;

	//��A�ԍ�
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

	//�����F
	switch ( nm_shubetu ) {
		case 0:	//����
		case 4:
		case 6:
		case 8:
			col = "g"; break;
		case 2:	//����
			break;
		case 1:	//�Δ�
		case 5:
		case 7:
		case 9:
			col = "w"; break;
		case 3:	//����
			col = "y"; break;
	}

	switch ( nm_shubetu ) {
		case 0:	//����
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
            
            //��
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
		case 4:	//���
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
				case "07022": //���킫
				case "08042": //����
				case "09022": //�F�s�{
				case "09032": //�Ƃ���
				case "11042": //�t����
				case "12022": //�K�u��
				case "12032": //�����Y
				case "13062": //�����q
				case "13082": //���c�J
				case "19022": //�x�m�R
				case "23012": //���É�
				case "23082": //�t����
				case "27022": //�Ȃɂ�
				case "30012": //�a�̎R
				case "40022": //�k��B
				case "40032": //�v����
				case "42022": //������
				case "46012": //������
					aleft = 90;
					awid = 130;
					asize = "L";
					aleft += 15;
					b1left += 15;
					b2left += 15;
					b3left += 15;
					break;
				case "23042": //�������q
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
            
            //��
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
		case 6:	//���
		case 7:
            if ( nm_over250chk==1 ) { bprint=0; }
		case 8:	//����
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
    nm_imgstr += '<div id="ftr1" style="text-align:center;">Copyright &#169; <a href="http://pyuadora.com/">�҂゠�ǂ�</a></div>';

	document.getElementById("nm_plate").innerHTML = nm_imgstr; 

}
    
//AffiliateLink
function prtAfi() {  
    const AFIMAX = 5;//�L���ő吔
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


//���W���T�C�Y
function fncResize(i,pwid) {
    //�v���[�g�摜���T�C�Y�ɂ��킹�A���W���摜�T�C�Y�����T�C�Y����
    var x = XWIDTH / pwid;
    var res = i * x;
    return Math.round(res);
}

//�J�n���[�Z�o
function fncLeft(pwid) {
    //�v���[�g�摜���T�C�Y����Z���^�����O�ł��鍶�[���Z�o����
    if (pwid>XWIDTH) { return 0; }
    else { return Math.round((XWIDTH - pwid)/2); }
}
