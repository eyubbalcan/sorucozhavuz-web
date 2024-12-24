import { ILessonRes, IUserRes } from ".";
import * as CONSTANTS from "../constants";

export interface IImageFileReq extends CONSTANTS.IRequestModel {
  file: File;
}

export interface IImageFileRes extends CONSTANTS.IResponseModel {
  _id: string;
  fileOriginalName: string;
  fileName: string;
  fileType: string;
  fileFormat: string;
}

export class ImageFile implements IImageFileRes {
  _id: string = "";
  fileOriginalName: string = "";
  fileName: string = "";
  fileType: string = "";
  fileFormat: string = "";
}

export interface IAddQuestionReq extends CONSTANTS.IRequestModel {
  lesson: string;
  question: string;
}

export interface IAddQuestionAndSolveReq extends CONSTANTS.IRequestModel {
  lesson: string;
  question: string;
  answers: IAnswerReq[];
}

export interface IAnswerReq extends CONSTANTS.IRequestModel {
  answerType: string;
  fileAnswer?: string | null;
  textAnswer?: string | null;
  numberAnswer?: number | null;
  booleanAnswer?: boolean | null;
}

export class AnswerReq implements IAnswerReq {
  answerType: string = "";
  fileAnswer?: string | null | undefined;
  textAnswer?: string | null | undefined;
  numberAnswer?: number | null | undefined;
  booleanAnswer?: boolean | null | undefined;
}

export interface IQuestionRes extends CONSTANTS.IResponseModel {
  _id: string;
}

export interface IQuestionRes extends CONSTANTS.IResponseModel {
  _id: string;
  lesson: ILessonRes | null;
  question: IImageFileRes;
  isSolved: boolean;
  isControlled: boolean;
  sentBy: IUserRes | null;
  solvedBy: IUserRes | null;
  controlledBy: IUserRes | null;
  assignedTo: IUserRes | null;
}

export interface IAnswerTypeRes extends CONSTANTS.IResponseModel {
  _id: string;
  code: number;
  name: string;
}
