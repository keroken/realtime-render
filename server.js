// express
const express = require('express');
const app = express();
// http server
const http = require('http').Server(app);
//socket.io
const io = require('socket.io')(http);
const PORT = process.env.PORT || 5000;


// 静的ファイルはpublicフォルダに入れる
app.use(express.static('public'));

// '/'でアクセスするとviewsフォルダのindex.htmlが開く
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});
app.get('/rc', function(request, response) {
    response.sendFile(__dirname + '/views/receive.html');
});


//複数のデータを受け取る配列
var dataArr = [];

//socket通信開始
io.on('connection', function(socket) {
    console.log('通信中' + socket.id);

    //最初に送るidと色相
    var clientData = {
        id: socket.id,
        hue: Math.floor(Math.random() * 360),
        x: 0,
        y: 0,
        width: 0,
        height: 0
    }

    dataArr.push(clientData);

    //送信
    socket.emit('sendSocketId', clientData);
    console.log(dataArr);

    //SPから送られてきたデータ
    socket.on('spToServer', function(data) {

        //for文で配列の中を回している
        for (var i = 0; i < dataArr.length; i++) {
            //socke.idの照合
            if (dataArr[i].id == data.id) {
                dataArr[i].x = data.x;
                dataArr[i].y = data.y;
                dataArr[i].width = data.width;
                dataArr[i].height = data.height;
            }
        }
        console.log(dataArr);

        //pc.htmlに配列（複数人分）のデータを送信
        socket.broadcast.emit('serverToPc', dataArr);
    });


    socket.on('disconnect', function() {
        console.log('通信解除');
        for (var i = 0; i < dataArr.length; i++) {
            //socke.idの照合
            if (dataArr[i].id == socket.id) {
                // このsocket.idが解除されたらballsArrから削除する
                dataArr.splice(i, 1);
            }
        }
        console.log('配列削除' + dataArr);
    });
});



http.listen(PORT, function() {
    console.log('listening on PORT');
});

// http.listen(3000, function() {
//     console.log('listening on 3000');
// });