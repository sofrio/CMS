<?php
// file name: call_python.php
    $fullPath = 'python3 /CMS/REC/detect/main.py /CMS/REC/detect/movielist.json 2>&1';
    $fullPath = 'python3 /CMS/REC/detect/test.py 123 456 2>&1';
    $res=exec($fullPath,$outpara,$ret);
    echo '<HTML>';
    echo '<head>';
    echo '<title>Pythonのテスト</title>';
    echo '</head>';
    echo '<body>';
    echo '<PRE>';
    var_dump($fullPath);
    var_dump($res);
    var_dump($outpara);
    var_dump($ret);
    echo '<PRE>';
    echo '</body>';
    echo '</HTML>';
?>