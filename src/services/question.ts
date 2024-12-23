import { AxiosResponse } from "axios";
import {
  IImageFileReq,
  IImageFileRes,
  IAddQuestionReq,
  IQuestionRes,
  IAnswerReq,
} from "../models";
import api from "./api";
import { API_URL } from "../route";

export const GetFile = (fileId: string) => {
  return `${API_URL}/file/fileLink/${fileId}`;
};

export const UploadImageFile = async (file: IImageFileReq) => {
  const response: AxiosResponse<IImageFileRes> = await api.post(`/file`, file, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const AddQuestion = async (question: IAddQuestionReq) => {
  const response: AxiosResponse<IQuestionRes> = await api.post(
    `/question`,
    question
  );
  return response;
};

export const GetQuestionsAndSolve = async (question: IAnswerReq) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.post(
    `/question/createAndSolve`,
    question
  );
  return response;
};

export const GetQuestions = async (lessonId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/questionsByLesson/${lessonId}`
  );
  return response;
};
