export interface SignupRequest{
  username:string;
  email:string;
  password:string;
  phoneNumber: string
}
export interface LoginRequest{
  username:string;
  email: string;
  password: string;
}
export interface AuthResponse {
  token: string;
}