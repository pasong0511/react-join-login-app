import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function RegisterPage(props) {
    const dispatch = useDispatch(); //리덕스 디스패치
    let navigate = useNavigate();

    const [Email, setEmail] = useState("");
    const [Name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [ConfirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    };

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    };

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    };

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    };

    //서브밋 이벤트 -> Email, Password state에 있는 값을 서버로 보낼 것이다.
    const onSubmitHandler = (event) => {
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
        }

        let body = {
            email: Email,
            password: Password,
            name: Name,
        };

        //완료가 잘 되었으면 처음 페이지로 이동시켜준다.
        dispatch(registerUser(body)).then((response) => {
            console.log(response);
            if (response.payload.success) {
                navigate("/login");
            } else {
                alert("Failed to sign up");
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

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input
                    type="password"
                    value={Password}
                    onChange={onPasswordHandler}
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={ConfirmPassword}
                    onChange={onConfirmPasswordHandler}
                />

                <br />
                <button type="submit">회원 가입</button>
            </form>
        </div>
    );
}

export default RegisterPage;
