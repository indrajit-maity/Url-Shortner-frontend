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
export interface LoginResponse {
  JWT_TOKEN: string;
  userId: number;
  email: string;
  username: string;
  roles: string[];
}
export interface AuthUser {
  userId: number;
  email: string;
  username: string;
  roles: string[];
}
export interface AuthResponse {
  token: string;
}

export interface UrlRequest {
  originalUrl: string;
  expiryDate?: string; 
}

export interface UrlResponse {
  shortUrl: string;
  createdAt: string;
  expiryDate: string | null;
  originalUrl: string;
  active: boolean;
  count: number;
}


export type BlocklistSource = "MANUAL" | "THIRD_PARTY" | "AUTO_REPORTED";

export interface AddBlocklistRequest {
  domain: string;
  reason: string;
  blocklistSource: BlocklistSource;
}

export interface AddBlocklistResponse {
  id: number;
  domain: string;
  reason: string;
  blocklistSource: BlocklistSource;
}