import * as CONSTANTS from "../constants";
import { ILessonRes } from "./lesson";

export interface IUserRes extends CONSTANTS.IResponseModel {
  _id: string;
  email: string;
  phone: string;
  role: IRole;
  lesson: string | ILessonRes | null;
  firstName: string;
  lastName: string;
  branch: string;
  createdAt: Date;
}

export interface IRole extends CONSTANTS.IResponseModel {
  _id: string;
  name: string;
  displayName: string;
  parentRole: string;
}
