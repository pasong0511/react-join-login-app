import axios from "axios";

import { AUTH_USER, LOGIN_USER, REGISTER_USER } from "./types";

//이메일과 패스워드 넣어준것을 파라미터로 받는다.
//axios 작업을 여기와서 한다.
export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data);

  //받아온 값을 리듀서에 다시 저장한다.
  //리듀서에서 previousState와 action state를 조합해서 nextState를 조합한다.
  //타입을 지정해준다.
  //리퀘스트를 페이로드에 넣어준다.
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

/*인증에 관한 액션 - 서버에 get으로 요청보낸다.*/
export function auth() {
  const request = axios
    .get("/api/users/auth")
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}
