//socket.ioの保存
var socket = io();
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

//受け取り用のオブジェクト
var myData = {};

socket.on('sendSocketId', function(data) {
    myData.id = data.id;
    myData.hue = data.hue;
    myData.x = imageWidth / 2;
    myData.y = imageHeight / 2;
    console.log(myData);
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
    // x,y座標に現在のマウスの位置を代入 x,yの値が画像サイズを超えないようにconstrain関数を利用
    var x = constrain(myData.x, 0, myPhoto.width-1);
    var y = constrain(myData.y, 0, myPhoto.height-1);

    // マウス位置の色情報を取得し、塗り色に設定
    var r = myPhoto.pixels[(y*width+x)*4];
    var g = myPhoto.pixels[(y*width+x)*4+1];
    var b = myPhoto.pixels[(y*width+x)*4+2];
    var a = myPhoto.pixels[(y*width+x)*4+3];
    var c = color(r,g,b,a);
    fill(c);

    // その点を中心にして直系15pxの円を描く
    ellipse(x, y, 15, 15);

}

function mouseDragged() {
    myData.x = mouseX;
    myData.y = mouseY;

    //serverに送るデータ
    var sendData = {
        id: myData.id,
        hue: myData.hue,
        x: myData.x,
        y: myData.y,
        width: imageWidth,
        height: imageHeight
    }
    //serverにデータを送信
    socket.emit('spToServer', sendData);
}


// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }