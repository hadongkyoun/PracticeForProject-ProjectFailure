const http = require('http');

http.createServer((req, res)=>{
  res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8'});
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
  //여기에 어떻게 응답 할지 설정
})