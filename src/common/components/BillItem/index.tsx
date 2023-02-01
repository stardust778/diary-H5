import React, { useEffect, FC } from 'react';
import dayjs from 'dayjs';
import { Cell } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';
import style from './index.module.less';
import { useSetState } from '@/common/hooks';
import { typeMap } from '@/common/utils/typemap';

interface IState {
  income: number;
  expense: number;
}

const BillItem = (props: { bill: TSBill.Item }) => {
  const [state, setState] = useSetState<IState>({
    income: 0,
    expense: 0,
  });
  const { bill } = props;
  const { income, expense } = state;

  const navigate = useNavigate();

  useEffect(() => {
    const _income = bill.bills.filter(item => item.pay_type === 2).reduce((cur, item) => {
      cur += parseInt(item.amount)
      return cur
    }, 0)
    const _expense = bill.bills.filter(item => item.pay_type === 1).reduce((cur, item) => {
      cur += parseInt(item.amount);
      return cur
    }, 0)
    setState({
      income: _income,
      expense: _expense
    })
  }, [bill.bills])

  // 前往账单详情页
  const navigateToDetail = (item: TSBill.Bills) => {

  }

  return (
    <div className={style.item}>
      <div className={style.headerDate}>
        <div className={style.date}>{bill.date}</div>
        <div className={style.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt='支' />
            <span>¥{ expense.toFixed(2) }</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥{ income.toFixed(2) }</span>
          </span>
        </div>
      </div>
      {
        bill && bill.bills.map(item => {
          return (
            <Cell 
              className={style.bill}
              key={item.id}
              onClick={() => navigateToDetail(item)}
              title={
                <>
                  <CustomIcon 
                    className={style.itemIcon}
                    type={item.type_id ? typeMap[item.type_id as keyof typeof typeMap].icon : undefined}
                  />
                  <span>{ item.type_name }</span>
                </>
              }
              description={<span style={{ color: item.pay_type == 2 ? 'red' : '#39be77' }}>{`${item.pay_type == 1 ? '-' : '+'}${item.amount}`}</span>}
              help={<div>{dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}</div>}
            />
          )
        })
      }
    </div>
  )
}

export default BillItem;