const express = require("express");
const app = express();
const port = 5000;

const bodyParser = require("body-parser");
const { User } = require("./models/User");

//클라이언트에서 오는 정보를 서버에서 분석해서 가져온다.
//application/x-www-form-urlencoded를 분석해서 가져온다.
app.use(bodyParser.urlencoded({ extended: true }));
//application/json을 분석해서 가져온다.
app.use(bodyParser.json());

//1.
app.get("/", (req, res) => {
    res.send("Hello World! 반갑습니다");
});

//2.
//회원가입 할때 필요한 정보들을 client에서 가져오면
//그것들을 데이터베이스에 넣어준다.
app.post("/register", (req, res) => {
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

//3. 몽구스 연결
const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://root:root@react-login-app.gu6tt.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => console.log("MongoDB Connectec..."))
    .catch((err) => console.log(err));

app.listen(port, () => console.log(`${port}포트입니다.`));
