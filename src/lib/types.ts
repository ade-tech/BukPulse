export interface UserConfirmationRespnse {
  allowed: boolean;
}
export interface otpVerificationParams {
  email: string;
  token: string;
}
