const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken"); //토큰 발행
//스키마 생성
const userSchema = mongoose.Schema({
    /*데이터를 mongodb에 저장하려면 먼저 구조(스키마)가 있어야 한다.
  스키마는 해당 컬렉션의 문서에 어떤 종류의 값이 들어가는지를 정의한다.
  mongoose 모듈을 불러와 mongoose.Schema 를 통해 스키마 객체를 생성한다.*/

    name: {
        type: String,
        maxlength: 50,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, //email에 공백이 있을 때 없애주는 역할
        unique: 1, //똑같은 이메일 못쓰게
    },
    password: {
        type: String,
        minlength: 5,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        //유효성관련
        type: String,
    },
    tokenExp: {
        //token의 유효기간
        type: Number,
    },
});
//pre는 mongoose 에서 가져온 메서드, save는 저장하기 전에 function을 실행
userSchema.pre("save", function (next) {
    //next는 바로 이 과정을 pass 함
    //현재 스키마에 들어있는 post된 password를 가져온다
    var user = this;
    //field에서 password가 변환될때만 password를 암호화 해준다.
    if (user.isModified("password")) {
        //bcrypt 패키지의 salt를 이용해서 비밀번호를 암호화 시킨다.
        //genSalt는 salt를 생성한다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash; //password를 암호화된 hash 로 바꿔준다
                next(); //완료 후 돌아감
            });
        });
    } else {
        //그냥 나갈 곳을 만들어준다.
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
    //클라이언트가 입력한 비밀번호와 db의 비밀번호를 비교한다.
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callback(err); //같을때
        callback(null, isMatch); //다를때
    });
};

userSchema.methods.generateToken = function (callback) {
    var user = this;
    //jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), "secretToken"); //임의로 두번째(secret key) 지정
    //user._id + 'secretToken' = token (incode)
    //->
    //'secretToken' -> user._id (decode)

    user.token = token;
    user.save(function (err, user) {
        if (err) return callback(err);
        callback(null, user);
    });
};

userSchema.statics.findByToken = function (token, callback) {
    var user = this;

    //토큰을 복호화(decode) 한다
    jwt.verify(token, "secretToken", function (err, decoded) {
        user.findOne({ _id: decoded, token: token }, function (err, user) {
            if (err) return callback(err);
            callback(null, user);
        });
    });
};
const User = mongoose.model("User", userSchema);
module.exports = { User };
//모델 다른 곳에서도 쓸 수 있게 export 해준다.
