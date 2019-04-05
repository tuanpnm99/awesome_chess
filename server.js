const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const myParser = require("body-parser");
const INDEX = path.join(__dirname, 'index.html');
var Chess = require('chess.js').Chess;

server = express();
server.use(myParser.urlencoded({extended : true}));

var url = require('url');
function get_move(game){
  var possibleMoves = game.moves();
  // game over
  if (possibleMoves.length === 0) return;
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex]
}
server.post('/endpoint', function(req, res){
  game_state = Chess(req.body.state)
  move = get_move(game_state);
  res.contentType('json');
  res.send({next_move: move });
});
server.get('/', function(req,res){
  res.sendFile(INDEX)
})
server.listen(PORT, () => console.log(`Listening on ${ PORT}`));
