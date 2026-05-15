export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequestInterface {
  token: string;
  password: string;
}
