declare namespace TSData {
  export interface Item {
    total_expense: string;
    total_income: string;
    total_data: DataItem[];
  }
  export interface DataItem {
    type_id: number;
    type_name: string;
    pay_type: 1 | 2;
    number: number;
  }
}