import * as CONSTANTS from '../constants';

export interface ILessonRes extends CONSTANTS.IResponseModel {
    _id: string;
    name: string;
    lessonType: string;
    slug: string;
}

export interface ILessonReq extends CONSTANTS.IRequestModel {
    name: string;
    lessonType: string;
    slug: string;
}