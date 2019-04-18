const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const myParser = require("body-parser");
const INDEX = path.join(__dirname, 'index.html');
var Chess = require('chess.js').Chess;

server = express();
server.use(myParser.urlencoded({extended : true}));

var url = require('url');
var get_value_piece = function(piece, enemy){
  if(piece == null) return 0;
  value = 0
  switch(piece.type){
    case 'p':
      value = 10;
      break;
    case 'n':
      value = 30;
      break;
    case 'b':
      value = 30;
      break;
    case 'r':
      value = 50;
      break;
    case 'q':
      value = 90;
      break;
    case 'k':
      value = 900;
      break;
  }
  if(piece.color == enemy) value = -value;
  return value;
}
var evaluateBoard = function (board, enemy = 'w') {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          totalEvaluation += get_value_piece(board[i][j], enemy);
        }
    }
    return totalEvaluation;
};
var minmax = function(game, depth, alpha, beta, isMin){
  if (depth == 0) return evaluateBoard(game.board());
  var possibleMoves = game.moves();
  var best_score = -9999
  if(isMin == true){
    best_score = 9999;
    for (var i = 0; i < possibleMoves.length; i++) {
          var tmp_move = possibleMoves[i];
          game.move(tmp_move);
          //take the negative as AI plays as black
          tmp_score = minmax(game, depth-1, alpha, beta, !isMin)
          game.undo();
          best_score = Math.min(best_score, tmp_score);
          beta = Math.min(best_score, beta);
          if (alpha >= beta) break;
    }
  }
  else{
    best_score = -9999;
    for (var i = 0; i < possibleMoves.length; i++) {
          var tmp_move = possibleMoves[i];
          game.move(tmp_move);
          //take the negative as AI plays as black
          tmp_score = minmax(game, depth-1, alpha, beta, !isMin)
          game.undo();
          best_score = Math.max(best_score, tmp_score);
          alpha = Math.max(best_score, alpha);

          if (alpha >= beta) break;
    }
  }
  return best_score;
}
function get_move(game){

  var possibleMoves = game.moves();
  var best_move = null
  var best_score = -9999
  for (var i = 0; i < possibleMoves.length; i++) {
        var tmp_move = possibleMoves[i];
        game.move(tmp_move);
        //take the negative as AI plays as black
        tmp_move_score = minmax(game, 2, -9999, 9999, true);
        game.undo();
        if (best_score <= tmp_move_score){
          best_move = tmp_move;
          best_score = tmp_move_score;
        }
  }
  // game over
  if (possibleMoves.length === 0) return;
  return best_move
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
