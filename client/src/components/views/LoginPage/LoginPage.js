import React, { useState } from "react";

//리덕스 사용
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
    const dispatch = useDispatch(); //리덕스 디스패치
    let navigate = useNavigate();

    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value); //이메일 상태 변경
    };
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value); //비밀번호 상태 변경
    };

    //서브밋 이벤트 -> Email, Password state에 있는 값을 서버로 보낼 것이다.
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body = {
            email: Email,
            password: Password,
        };

        //완료가 잘 되었으면 처음 페이지로 이동시켜준다.
        dispatch(loginUser(body)).then((response) => {
            if (response.payload.loginSuccess) {
                navigate("/");
            } else {
                alert("Error");
            }
        });

        //리덕스를 쓰기 때문에 방법이 다르다.

        //원래 axios 사용할것이라면 아래와 같이 하면 된다.
        // Axios.post("/api/user/login", body).then((response) => {});
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
            }}
        >
            <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Email</label>
                <input
                    type="password"
                    value={Password}
                    onChange={onPasswordHandler}
                />

                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
