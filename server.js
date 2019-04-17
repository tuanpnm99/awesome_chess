const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const myParser = require("body-parser");
const INDEX = path.join(__dirname, 'index.html');
var Chess = require('chess.js').Chess;

server = express();
server.use(myParser.urlencoded({extended : true}));

var url = require('url');
var evaluateBoard = function (board, enemy = 'w') {
    piece_value = {'p': 10, 'r': 50, 'n': 30, 'b': 30, 'q':90, 'k':900};
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          value = 0
          if (board[i][j] != null){
            value = piece_value[board[i][j].type]
            if(board[i][j].color == enemy){
              value = -value;
            }
          }
          totalEvaluation += value;
        }
    }
    return totalEvaluation;
};
var minmax = function(game, depth, isMin){
  if (depth == 0) return evaluateBoard(game.board());
  var possibleMoves = game.moves();
  var best_score = -9999
  if(isMin == true) best_score = 9999
  for (var i = 0; i < possibleMoves.length; i++) {
        var tmp_move = possibleMoves[i];
        game.move(tmp_move);
        //take the negative as AI plays as black
        tmp_score = minmax(game, depth-1, !isMin)
        game.undo();
        if(isMin == true){
          best_score = Math.min(best_score, tmp_score);
        }
        else{
          best_score = Math.max(best_score, tmp_score);
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
        tmp_move_score = minmax(game, 2, true);
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
