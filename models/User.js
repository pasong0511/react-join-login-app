// /models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; // salt값을 10으로 정해주었다.

var jwt = require("jsonwebtoken"); //jsonwebtoken import

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

//저장하기 전에 작업한다.
// userSchema가 save 되기 전에(pre) 실행할 함수 function은~
//next 되면 index.js의 user.save((err, userInfo)가 바로 실행된다.
userSchema.pre("save", function (next) {
    const user = this; //  this는 userSchema를 가르킨다.

    // userSchema.password가 수정될때만 아래 코드 실행!
    if (user.isModified("password")) {
        // saltRounds가 10인 salt를 generate 해주자.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err); // 에러처리

            // user.password를 salt로 변경해서 hash로 return하는 함수
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err); // 에러처리
                user.password = hash; // user.password 자리에 hash를 할당!
                next(); // pre에서 나가 다음 코드 실행!
            });
        });
    }
    //비밀번호 변경이 아닌 다른 정보를 변경하는 경우 next()가 있어야 위의 password에만 머무르지 않는다.
    else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567
    //암호화된 비밀번호 "$2b$10$Ekyoe6zzV2FOGIjg4xququhdJ4UP2XN8UvYBVJDpXuIFD0IWKIDpW"
    //plainPassword -> 암호화 -> 암호화된 비밀번호랑 같은지 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err)
            return (
                cb(err), //비밀번호가 같지 않은 경우
                cb(null, isMatch)
            );
    });
};

userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567 암호화된 비밀번호:
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function (cb) {
    var user = this;
    //jsonwebtoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), "secretToken"); //toHexString() : Return the ObjectID id as a 24byte hex string representation.

    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};
const User = mongoose.model("User", userSchema); //model(model이름,schema)

module.exports = { User }; //model 을 다른 파일에서도 쓰기 위해 export하기
