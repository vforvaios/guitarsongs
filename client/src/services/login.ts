import makeRequest from "@/utils/makeRequest";

interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  email: string;
  password: string;
}

const loginUser = (payload: LoginPayload) =>
  makeRequest({
    method: "POST",
    url: "api/login",
    body: JSON.stringify(payload),
  });

const registerUser = (payload: RegisterPayload) =>
  makeRequest({
    method: "POST",
    url: "api/register",
    body: JSON.stringify(payload),
  });

export { loginUser, registerUser };
