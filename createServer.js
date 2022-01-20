const http = require('http');
const fs = require('fs').promises;

http.createServer( async (req, res)=>{
  try{
    //여기에 어떻게 응답 할지 설정
    const data = await fs.readFile('./serverHTML.html');
    res.writeHead(200, { 'Content-type' : 'text/html; charset=utf-8'});
    res.end(data);
  }catch(err){
    console.error(err);
    res.writeHead(500, { 'Content-type' : 'text/plain; charset=utf-8'});
    res.end(err.message);
  }
})
  .listen(8081, () => { //서버 연결
    console.log('8081번 포트에서 서버 대기 중입니다!');
  });