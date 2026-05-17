export interface ForgotPasswordResponse {
  password: string;
  token: any;
  message: string | null;
}

export interface ResetPasswordResponse {
  message: string;
}
