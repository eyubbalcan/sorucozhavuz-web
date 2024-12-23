import * as CONSTANTS from "../constants";

export interface IToken extends CONSTANTS.IResponseModel {
  token: string;
  role: string;
  lesson: string;
}

export interface ILoginUser extends CONSTANTS.IRequestModel {
  email: string;
  password: string;
}

export class LoginUser implements ILoginUser {
  email: string = "";
  password: string = "";
}
