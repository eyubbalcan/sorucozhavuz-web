import { AxiosResponse } from "axios";
import api from "./api";
import { ILessonRes } from "../models";

export const GetLessons = async () => {
  const response: AxiosResponse<ILessonRes[]> = await api.get(`/lesson`);
  return response;
};
