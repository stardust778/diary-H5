import React, 
{ 
  forwardRef, 
  useEffect, 
  useRef,
  useCallback
} from 'react';
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import { useSetState } from '@/common/hooks';
import style from './index.module.less';
import classnames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import PopupDate from '../PopupDate';
import { typeMap } from '@/common/utils/typemap';
import $request from '@/common/utils/request';
import CustomIcon from '../CustomIcon';

interface IState {
  show: boolean;
  payType: 'expense' | 'income';
  date: Dayjs;
  amount: string;
  expense: TSBill.typeItem[];
  income: TSBill.typeItem[];
  currentType: TSBill.typeItem;
  remark: string;
  showRemark: boolean;
}

interface IProps {
  onReload: Function;
  detail?: TSBill.billDetail;
}

const PopupBill = forwardRef((props: IProps, ref: any) => {
  const [state, setState] = useSetState<IState>({
    show: false,
    payType: 'expense',
    date: dayjs(),
    amount: '',  // 账单价格
    expense: [], // 支出类型数组
    income: [],  // 收入类型数组
    currentType: { id: 1, name: '餐饮', type: 1, user_id: 0 },
    remark: '',
    showRemark: false
  });
  const { 
    show, payType, 
    date, amount,
    expense, income,
    currentType,
    remark, showRemark
  } = state;

  const dateRef = useRef<any>();  // 时间弹窗ref
  const id = props.detail && props.detail.id  // 外部传进来的账单详情 id

  useEffect(() => {
    (async () => {
      const res = await $request.get<TSBill.type>('/api/type/list');
      const _expense = res.data.list.filter(item => item.type === 1);
      const _income = res.data.list.filter(item => item.type === 2);
      setState({
        expense: _expense,
        income: _income,
        currentType: _expense[0]
      })
    })()
  }, [])

  useEffect(() => {
    if(props.detail?.id) {
      const { detail } = props;
      setState({
        payType: detail.pay_type === 1 ? 'expense' : 'income',
        currentType: {
          id: detail.type_id,
          name: detail.type_name,
          type: detail.pay_type,
          user_id: detail.user_id
        },
        remark: detail.remark,
        amount: detail.amount,
        date: dayjs(detail.date)
      })
    }
  }, [props.detail])

  if(ref) {
    ref.current = {
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
    };
  }

  // 切换收入与支出类型
  const changeType = (type: IState['payType']) => {
    setState({ payType: type });
  }

  // 日期选择回调
  const selectDate = useCallback((val: Dayjs) => {
    setState({ date: val })
  }, [])

  // 日期弹窗
  const handleDateToggle = () => {
    dateRef.current && dateRef.current.show()
  }

  // 选择账单类型
  const choseType = (item: TSBill.typeItem) => {
    setState({
      currentType: item
    })
  }

  // 处理输入框改变值
  const handleMoney = (value: string | undefined) => {
    value = String(value);
    // 点击删除按钮时
    if(value === 'delete') {
      const _amount = amount.slice(0, amount.length - 1);
      setState({ amount: _amount });
      return
    }
    // 点击确认按钮时
    if(value === 'ok') {
      addBill()
      return 
    }
    // 输入值为"."，且已存在"."，则不让其继续字符串相加
    if(value === '.' && amount.includes('.')) return 
    // 小数点后保留两位，当超过两位时，不让字符串继续相加
    if(value !== '.' && amount.includes('.') && amount && amount.split('.')[1].length > 2) return 
    setState({ amount: amount + value })
  }

  // 添加账单
  const addBill = async () => {
    if(!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params: TSBill.addBill = {
      amount: Number(amount), // 账单金额小数点后保留两位
      type_id: currentType.id, // 账单种类id
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, // 日期传时间戳
      pay_type: payType == 'expense' ? 1 : 2, // 账单类型传 1 或 2
      remark: remark || '' // 备注
    };
    if(id) {
      params.id = id;
      const res = await $request.post('/api/bill/update', params);
      Toast.show('修改成功');
    } else {
      const res = await $request.post('/api/bill/add', params);
      setState({
        amount: '',
        payType: 'expense',
        currentType: expense[0],
        date: dayjs(),
        remark: '',
        show: false
      })
      Toast.show('添加成功');
    }
    if(props.onReload) props.onReload();
  }

  return (
    <Popup
      visible={show}
      direction='bottom'
      onMaskClick={() => setState({ show: false })}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={style.addWrap}>
        <header className={style.header}>
          <span 
            className={style.close} 
            onClick={() => setState({ show: false })}>
              <Icon type='wrong'/>
          </span>
        </header>
        <div className={style.filter}>
          <div className={style.type}>
            <span 
              onClick={() => changeType('expense')} 
              className={classnames({[style.expense]: true, [style.active]: payType === 'expense'})}
            >支出</span>
            <span
              onClick={() => changeType('income')}
              className={classnames({[style.income]: true, [style.active]: payType === 'income'})}
            >收入</span>
          </div>
          <div 
            className={style.time} 
            onClick={handleDateToggle}>{dayjs(date).format('MM-DD')} <Icon className={style.arrow} type="arrow-bottom" /></div>
        </div>
        <div className={style.money}>
          <span className={style.sufix}>￥</span>
          <span className={classnames(style.amount, style.animation)}>{ amount }</span>
        </div>
        <div className={style.typeWarp}>
          <div className={style.typeBody}>
          {
            (
              payType == 'expense' ? expense : income).map(item => 
              <div onClick={() => choseType(item)} key={item.id} className={style.typeItem}>
                <span className={classnames(
                  {
                    [style.iconfontWrap]: true, 
                    [style.expense]: payType === 'expense', 
                    [style.income]: payType === 'income', 
                    [style.active]: currentType.id === item.id})
                  }
                >
                  <CustomIcon className={style.iconfont} type={typeMap[item.id as keyof typeof typeMap].icon} />
                </span>
                <span>{item.name}</span>
              </div>
            )
          }
          </div>
        </div>
        <div className={style.remark}>
        {
          showRemark ? <Input
            autoHeight
            showLength
            maxLength={50}
            type="text"
            rows={3}
            value={remark}
            placeholder="请输入备注信息"
            onChange={(val: string | unknown) => setState({ remark: val as string })}
            onBlur={() => setState({ showRemark: false })}
          /> : <span onClick={() => setState({ showRemark: true })}>{remark || '添加备注'}</span>
        }
      </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)}/>
        <PopupDate ref={dateRef} onSelect={selectDate}/>
      </div>
    </Popup>
  )
})

export default PopupBill;