const express = require('express');
const PORT = process.env.PORT || 3000;
const path = require('path');
const myParser = require("body-parser");
const INDEX = path.join(__dirname, 'index.html');
server = express();
server.use(myParser.urlencoded({extended : true}));

var url = require('url');

server.post('/endpoint', function(req, res){
  console.log(req.body)
  res.contentType('json');
  res.send({ msg: JSON.stringify({response:'IT WORK'}) });


});
server.get('/', function(req,res){
  res.sendFile(INDEX)
})
server.listen(PORT, () => console.log(`Listening on ${ PORT}`));
