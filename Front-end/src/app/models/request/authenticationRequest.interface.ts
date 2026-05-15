export interface RegisterRequestInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInRequestInterface {
  email: string;
  password: string;
}
