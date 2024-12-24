import { AxiosResponse } from "axios";
import {
  IImageFileReq,
  IImageFileRes,
  IAddQuestionReq,
  IQuestionRes,
  IAddQuestionAndSolveReq,
  IAnswerTypeRes,
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

export const AddQuestionAndSolves = async (
  question: IAddQuestionAndSolveReq
) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.post(
    `/question/createAndSolve`,
    question
  );
  return response;
};

export const GetAnswerTypes = async () => {
  const response: AxiosResponse<IAnswerTypeRes[]> = await api.get(
    `/answerType`
  );
  return response;
};

export const GetQuestionsByLesson = async (lessonId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/questionsByLesson/${lessonId}`
  );
  return response;
};

export const GetUnsolvedQuestionsByLesson = async (lessonId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/unsolvedQuestionsByLesson/${lessonId}`
  );
  return response;
};

export const GetSolvedQuestionsByLesson = async (lessonId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/solvedQuestionsByLesson/${lessonId}`
  );
  return response;
};

export const GetUnControlQuestionsByLesson = async (lessonId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/uncontrolledQuestionsByLesson/${lessonId}`
  );
  return response;
};

export const GetControlledQuestionsByLesson = async (lessonId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/controlledQuestionsByLesson/${lessonId}`
  );
  return response;
};

export const GetQuestionBySolver = async (solverId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/questionsBySolver/${solverId}`
  );
  return response;
};

export const GetApprovedQuestionBySolver = async (solverId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/approvedQuestionsBySolver/${solverId}`
  );
  return response;
};

export const GetRejectedQuestionBySolver = async (solverId: string) => {
  const response: AxiosResponse<IQuestionRes[]> = await api.get(
    `/question/rejectedQuestionsBySolver/${solverId}`
  );
  return response;
};
