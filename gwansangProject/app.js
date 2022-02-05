

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { response } = require('express');



try{
  fs.readdirSync('public/uploads');
}catch(error){
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('public/uploads');
}
//파일저장 위치
//const upload = multer({dest: 'public/images/'}) //dest : 저장 위치
const upload = multer ({
  storage: multer.diskStorage({
    destination(req, file, done){
      done(null, 'public/uploads/');
    },
    filename(req, file, done){
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname), ext);
    },
  }),
  limits: {fileSize: 5 * 1024 * 1024},
});


dotenv.config();
/*const indexRouter = require('./routes');
const userRouter = require('./routes/user');*/
const app = express();

//기본 주소
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'publikc')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));
//미들웨어

/*app.use('/', indexRouter);
app.use('/user', userRouter);*/


app.use(express.static('public'));
// 기본 실행
app.get('/', (req, res)=>{
 console.log('정상 실행');
 res.sendFile(path.join(__dirname, './public/gwansang.html'));
});

//name이 image로 된 이미지를 받아서 해당 경로에 저장
app.post('/upload', upload.single('image'), (req,res)=>{
  //여기서 이미지 변환 후 저장
  /*이미지를 다시 보여주기
    post 기능??? 
  */
    res.sendFile(path.join(__dirname, './public/uploads/' + req.file.originalname));
});


/*프론트에서 이미지 요청 (app.get으로 주로 처리)
app.get('/uploads/UserImage.PNG', (req,res)=>{
  fs.readFile('./uploads/UserImage.PNG', (err,data)=>{
    console.log('picture loading...');
    res.writeHead(200);
    res.write(data);
    res.end();
  });
});
*/


app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), ()=>{
  console.log(app.get('port'), '번 포트에서 대기 중');
});