import { AxiosResponse } from "axios";
import api from "./api";
import { ILessonReq, ILessonRes } from "../models";

export const GetLessons = async () => {
  const response: AxiosResponse<ILessonRes[]> = await api.get(`/lesson`);
  return response;
};

export const GetLessonById = async (lesson: ILessonReq) => {
  const response: AxiosResponse<ILessonRes> = await api.post(`/lesson`, lesson);
  return response;
};
