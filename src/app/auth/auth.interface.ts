/** @format */

export interface JwtDecodedPayload {
  jti: string;
  sub: string;
}

export interface JwtDecodedPayload2 {
  access: string;
  refresh: string;
}
