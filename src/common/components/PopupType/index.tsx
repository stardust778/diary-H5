import React, { forwardRef, useEffect } from 'react';
import { Popup, Icon } from 'zarm';
import classnames from 'classnames';
import $request from '@/common/utils/request';
import style from './index.module.less';
import { useSetState } from '@/common/hooks';

interface IProps {
  onSelect: Function;
}

interface IState {
  show: boolean;
  active: number | 'all';
  expense: TSBill.typeItem[];
  income: TSBill.typeItem[];
}

const PopupType = forwardRef((props: IProps, ref: any) => {
  const [state, setState] = useSetState<IState>({
    show: false,  // 组件的显示和隐藏
    active: 1,  // 激活的标签
    expense: [],  // 支出标签类型
    income: [],   // 收入标签类型
  })
  const { show, active, expense, income } = state;
  const { onSelect } = props;
  useEffect(() => {
    (async () => {
      const res = await $request.get<TSBill.type>('/api/type/list');
      const _expense = res.data.list.filter(item => item.type === 1);
      const _income = res.data.list.filter(item => item.type === 2);
      setState({
        expense: _expense,
        income: _income
      })
    })()
  }, [])

  if(ref) {
    ref.current = {
       // 外部可以通过 ref.current.show 来控制组件的显示
      show: () => {
        setState({
          show: true
        })
      },
      close: () => {
        setState({
          show: false
        })
      }
    }
  }

  // 选择类型回调
  const choseType = (item: { id: 'all' | number, name?: string, type?: number, user_id?: number }) => {
    setState({
      active: item.id,
      show: false,
    })
    onSelect(item)
  }
  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setState({ show: false})}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={style.popupType}>
        <div className={style.header}>
          请选择类型
          <Icon type='wrong' className={style.cross} onClick={() => setState({ show: false })}/>
        </div>
        <div className={style.content}>
          <div 
            onClick={() => choseType({ id: 'all' })}
            className={classnames({[style.all]: true, [style.active]: active === 'all'})}
          >全部类型</div>
          <div className={style.title}>支出</div>
          <div className={style.expenseWrap}>
            {
              expense.map((item, index) => {
                return (
                  <p 
                    key={index} 
                    onClick={() => choseType(item)}
                    className={classnames({[style.active]: active === item.id})}
                  >{ item.name }</p>
                )
              })
            }
          </div>
          <div className={style.tltle}>收入</div>
          <div className={style.incomeWrap}>
            {
              income.map((item, index) => {
                return (
                  <p 
                    key={index} 
                    onClick={() => choseType(item)}
                    className={classnames({[style.active]: active === item.id})}
                  >{ item.name }</p>
                )
              })
            }
          </div>
        </div>
      </div>
    </Popup>
  )
})

export default PopupType;