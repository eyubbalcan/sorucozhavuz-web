import {
  //ICurrencies,
  //IModal,
  IPaginateResult,
  IPaginationRequest,
  //ITCMBCurrencies,
} from './interfaces';
// import {ModalTypes} from './types';
// import {Strings} from './strings';
//import {ITCMBCurrency} from '.';

export class PaginateResult<T> implements IPaginateResult<T> {
  count: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;
  index: number = 0;
  items: T[] = [];
  pages: number = 0;
  size: number = 0;
}

export class PaginationRequest implements IPaginationRequest {
  pageIndex: number = 0;
  pageSize: number = 10;
}

// export class Modal implements IModal {
//   type: ModalTypes = null;
//   title: string = '';
//   content: string | null = null;
//   wrap: boolean = false;
//   closeButtonName: string = Strings.CLOSE;
//   confirmButtonName: string = '';
//   placeholder: string = '';
//   buttonEvent: (...arg: any) => void = () => {};
//   buttonTime: number = 0;
//   isOpen: boolean = false;
// }

// export class TCMBCurrency implements ITCMBCurrency {
//   currencyCode: string = '';
//   exchangeRate: number = 0;
// }

// export class TCMBCurrencies implements ITCMBCurrencies {
//   currencies: ICurrencies[] = [];
// }
