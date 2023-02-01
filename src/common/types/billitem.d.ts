declare namespace TSBill {
  export interface Item {
    date: string;
    bills: Bills[]
  }
  export interface Bills {
    amount: string;
    date: string;
    id: number;
    pay_type: number;
    remark: string;
    type_id: number;
    type_name: string;
  }
  export interface List {
    totalExpense: number;
    totalIncome: number;
    totalPage: number;
    list: Item[];
  }
  export interface type {
    list: typeItem[];
  }
  export interface typeItem {
    id?: number;
    name?: string;
    type?: number;
    user_id?: number;
  }
  export interface addBill {
    amount?: number;
    type_id?: number;
    type_name?: string;
    date?: number;
    pay_type?: 1 | 2,
    remark?: string;
    id?: number;
  }
  export interface billDetail {
    id?: number;
    pay_type?: 1 | 2;
    amount?: string;
    date?: string;
    type_id?: number;
    type_name?: string;
    user_id?: number;
    remark?: string;
  }
}