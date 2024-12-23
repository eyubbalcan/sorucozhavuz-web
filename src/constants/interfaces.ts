import { Roles } from ".";
// import {ModalTypes} from './types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRequestModel extends IModel {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IResponseModel extends IModel {}

export interface IClaim {
  name: string;
  value: Roles;
  dependency?: Roles[];
}

export interface IPaginateResult<T> {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  index: number;
  items: T[];
  pages: number;
  size: number;
}

export interface IPaginationRequest {
  pageIndex: number;
  pageSize: number;
}
