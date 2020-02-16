# CMS/NPTS を実装するソフトウエア群

## CMS/NPTS
システムのURLは以下の通り。  
CMS ⇒ http://cms.japaneast.cloudapp.azure.com:60/cameramap/  
NPTS ⇒ http://cms.japaneast.cloudapp.azure.com:60/numberplate/  
ただし、現在は障害のため稼働しない。 

また、システムの概要／詳細については  
https://sofrio.github.io/CMS/  
を参照。 


## 各フォルダについて


| フォルダ  | 内容物 |
|:-|:--|
| CAMERA | GPS端末用のソフト                |     
| Doc    | システムの説明書                 |   
| MAP    | 地図サーバー用のソフトと動作環境 |    
| REC    | 録画サーバー用のソフトと動作環境 |
    

## 補足
本システムは、    
* Apache2
* php7
* python3
* OpenCV
* Google Maps API
* Google Calendar API
 
等により構成されていて、夫々に対する設定が必要となる。  
また、実稼働時は
* メタデータ
* 画像データ
* ログファイル

等が単純増加して行くので、
ガベージコレクトの機能も必要となる。

