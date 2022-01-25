

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

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

const multer = require('multer');
const fs = require('fs');
const { response } = require('express');

//작업을 위한 upload 폴더 찾기 및 생성
try{
  fs.readdirSync('uploads');
}
catch (error){
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done){
      done(null, 'uploads/');
    },
    filename(req, file, done){
      //이름 설정
      const ext = path.extname("UserImage.jpg");
      done(null, path.basename("UserImage.jpg", ext) + ext);
    },
  }),
  limits: {fileSize: 5 * 1024 * 1024},
});

// 기본 실행
app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'multipart.html'));
});

//프론트에서 이미지 요청 (app.get으로 주로 처리)
app.get('/uploads/UserImage.jpg', (req,res)=>{
  fs.readFile('./uploads/UserImage.jpg', (err,data)=>{
    console.log('picture loading...');
    res.writeHead(200);
    res.write(data);
    res.end();
  });
});

//multipart.html 에서 action 실행시 실행
app.post('/', upload.single('image'), (req,res)=>{
  console.log(req.file, req.body);
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.use((req, res, next)=>{
  res.status(404).send('Not Found');
});

app.use((err, req, res, next)=>{
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), ()=>{
  console.log(app.get('port'), '번 포트에서 대기 중');
});