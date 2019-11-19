var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    res.render("index");
});

var server = app.listen(8000, function() {
    console.log("Escuchando en el pueto 8000");
});

var io = require('socket.io').listen(server);
var yesVotes = 0;
var noVotes = 0;
io.sockets.on('connection', function(socket) {
    console.log("Se estan contando los votos!!");
    io.emit('sum_yesVotes', { response: yesVotes });
    io.emit('sum_noVotes', { response: noVotes });

    socket.on("vote", function(data) {
        console.log('Se a recibido un voto de:' + data.newVote);
        if (data.newVote == 'newYes') {
            yesVotes += 1;
            console.log("Ahora tenemos " + yesVotes + " SI votos y " + noVotes + " NO votos!");
            ///socket.emit('votes_response', {response: "Thank you for your vote!"});
            io.emit('sum_yesVotes', { response: yesVotes });
            io.emit('sum_all', { response: (yesVotes + noVotes) });
            return yesVotes;
        } else if (data.newVote == 'newNo') {
            noVotes += 1;
            console.log("Ahota tenemos " + yesVotes + " SI votos y " + noVotes + " No votos!");
            //socket.emit('votes_response', {response: "Thank you for your vote!"});
            io.emit('sum_noVotes', { response: noVotes });
            io.emit('sum_all', { response: (yesVotes + noVotes) });
            return noVotes;
        }
    });
    socket.on("button_clicked", function(data) {
        console.log('Alguien selecciono una opcion, reaccion: ' + data.reason);
        socket.emit('server_response', { response: "sockets are the best!" });
    });
})