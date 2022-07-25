//index.js
const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const { User } = require("./models/User");

//클라이언트에서 오는 정보를 서버에서 분석해서 가져온다.
//application/x-www-form-urlencoded를 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));
//application/json을 분석해서 가져온다.
app.use(bodyParser.json());
//cookie 파서 사용
app.use(cookieParser());

//1.
app.get("/", (req, res) => {
    res.send("Hello World! 반갑습니다");
});

//2.
//회원가입 할때 필요한 정보들을 client에서 가져오면
//그것들을 데이터베이스에 넣어준다.
app.post("/api/users/register", (req, res) => {
    //인스턴스 생성
    //req.body안에는 json 형태로 {id:"hello", password:"132"} 이러한 형태로 들어가있음 -> body-parser가 있어서 가능
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            //status가 200일 경우 return 값
            success: true,
            userInfo,
        });
    }); //몽고DB에서 사용하는 메소드, user안에 있는 값이 DB로 저장
});

//4.
app.post("/api/users/login", (req, res) => {
    //4-1요청된 이메일을 데이터베이스에 있는지 찾는다.
    User.findOne({ email: req.body.email }, (err, user) => {
        //user 없는 경우
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }

        //4-2요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        //body 값에 저장되어있는 req.body.password
        user.comparePassword(req.body.password, (err, isMatch) => {
            //isMatch : db에 있는 pwd와 입력한 pwd가 일치
            if (!isMatch)
                //비밀번호가 틀렸을 경우
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });
            //4-3비밀번호까지 같다면 Token을 생성한다.
            //User.js의 generateToken()를 불러옴
            //user안에는 토큰이 들어가있을 것이다.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //token을 원하는 곳(쿠키, 로컬스토리지 등. 여기서는 쿠키에 저장)에 저장한다.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

//3. 몽구스 연결
const mongoose = require("mongoose");
mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connectec..."))
    .catch((err) => console.log(err));

app.listen(port, () => console.log(`${port}포트입니다.`));
