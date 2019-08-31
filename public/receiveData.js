//socket.ioの保存
var socket = io();

//受け取り用の配列
var receiveArr = [];
var myPhoto;
var imageWidth;
var imageHeight;

function preload() {
    myPhoto = loadImage('assets/cat.png', setSize);
}
  
function setSize(loadedImage) {
    imageWidth = loadedImage.width;
    imageHeight = loadedImage.height;
}
  

//サーバーからデータを受信
socket.on('serverToPc', function(data) {
    receiveArr = data;
    console.log(receiveArr);
});

function setup() {
    createCanvas(imageWidth, imageHeight);
    noCursor();
    noStroke();
    background(255);
    // colorMode(HSB, 360, 100, 100, 100);
}

function draw() {

    myPhoto.loadPixels(); // 画像全体の色情報を配列pixelsとして読み込み

    for (var i = 0; i < receiveArr.length; i++) {
        
        var pos = createVector();
        //送られてくるデータの値が動いていたら
        if (receiveArr[i].x > 1 && receiveArr[i].y > 1) {
            console.log(receiveArr[i]);
            
            pos.x = map(receiveArr[i].x, 0, receiveArr[i].width, 0, imageWidth);
            pos.y = map(receiveArr[i].y, 0, receiveArr[i].height, 0, imageHeight);

            // マウス位置の色情報を取得し、塗り色に設定
            var r = myPhoto.pixels[(pos.y*width+pos.x)*4];
            var g = myPhoto.pixels[(pos.y*width+pos.x)*4+1];
            var b = myPhoto.pixels[(pos.y*width+pos.x)*4+2];
            var a = myPhoto.pixels[(pos.y*width+pos.x)*4+3];
            var c = color(r,g,b,a);
            fill(c);

            // その点を中心にして直系15pxの円を描く
            ellipse(pos.x, pos.y, 15, 15);
        }
    }
}
