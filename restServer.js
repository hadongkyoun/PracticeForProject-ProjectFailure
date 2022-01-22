const http = require('http');
const fs = require('fs').promises;

http.createServer( async (req, res)=>{
  try{
    console.log(req.method, req.url);
    if(req.method === 'GET'){
      if(req.url === '/'){
        const data = await fs.readFile('./projectHTML.html');
        res.writeHead(200,{ 'Content-Type' : 'text/html; charset=utf-8'});
        return res.end(data);
      }else if(req.url === '/about'){
        const data = await fs.readFile('./about.html');
        res.writeHead(200,{ 'Content-Type' : 'text/html; charset=utf-8'});
        return res.end(data);
      }
    }
    // 주소가 /도 /about 도 아니면 
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