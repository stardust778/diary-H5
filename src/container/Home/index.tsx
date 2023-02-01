import { useEffect, useRef, useCallback } from 'react';
import { Icon, Pull } from 'zarm';
import style from './index.module.less';
import BillItem from '@/common/components/BillItem';
import { useSetState } from '@/common/hooks';
import dayjs from 'dayjs';
import { REFRESH_STATE, LOAD_STATE } from '@/common/utils/typemap';
import $request from '@/common/utils/request';
import PopupType from '@/common/components/PopupType';
import PopupDate from '@/common/components/PopupDate';
import PopupBill from '@/common/components/PopupBill';
import CustomIcon from '@/common/components/CustomIcon';

interface IState {
  currentTime: string;
  page: number;
  totalPage: number;
  list: TSBill.Item[];
  refreshing: number;
  loading: number;
  totalIncome: number;
  totalExpense: number;
  currentSelect: { id: 'all' | number, name?: string, type?: number, user_id?: number };
}

export default function Home() {
  const [state, setState] = useSetState<IState>({
    currentTime: dayjs().format('YYYY-MM'), // 当前筛选时间
    page: 1,  // 分页
    list: [],  // 账单列表
    totalPage: 0,  // 分页总数
    refreshing: REFRESH_STATE.normal,  // 下拉刷新状态
    loading: LOAD_STATE.normal,  // 上拉加载状态
    totalIncome: 0,
    totalExpense: 0,
    currentSelect: { id: 1, name: '餐饮', type: 1, user_id: 0 }
  })
  const typeRef = useRef<any>();  // 账单类型 ref
  const monthRef = useRef<any>();  // 月度筛选ref
  const billRef = useRef<any>();  // 添加账单ref

  const { 
    currentTime, page,
    totalPage, refreshing,
    loading, list,
    totalIncome, totalExpense,
    currentSelect
  } = state;

  useEffect(() => {
    getBillList() // 初始化
  }, [page, currentTime, currentSelect])

  const getBillList = async () => {
    const params = {
      page,
      page_size: 5,
      date: currentTime,
      type_id: currentSelect.id || 'all'
    }
    const res = await $request.get<TSBill.List>('/api/bill/list', params);
    if(page === 1) {
      setState({
        list: res.data.list,
        totalIncome: res.data.totalIncome,
        totalExpense: res.data.totalExpense
      })
    } else {
      setState({
        list: [...list].concat(res.data.list)
      })
    }
    setState({
      totalPage: res.data.totalPage,
      loading: LOAD_STATE.success,
      refreshing: REFRESH_STATE.success
    })
  }

  // 请求列表数据
  const refreshData = useCallback(() => {
    setState({
      refreshing: REFRESH_STATE.loading
    })
    if(page !== 1) {
      setState({
        page: 1
      })
      setState({
        refreshing: REFRESH_STATE.success
      })
    } else {
      getBillList();
    }
  }, [refreshing])

  const loadData = () => {
    if(page < totalPage) {
      setState({
        loading: LOAD_STATE.loading,
        page: page + 1
      })
    }
  }

  // 添加账单窗口
  const toggle = () => {
    typeRef.current && typeRef.current.show();
  }

  // 选择月份窗口
  const monthToggle = () => {
    monthRef.current && monthRef.current.show();
  }

  // 新增账单弹窗
  const addToggle = () => {
    billRef.current && billRef.current.show();
  }

  const select = useCallback((item: IState['currentSelect']) => {
    setState({
      refreshing: REFRESH_STATE.loading,
      page: 1,
      currentSelect: item
    })
  }, [])

  const selectMonth = useCallback((item: string) => {
    setState({
      refreshing: REFRESH_STATE.loading,
      page: 1,
      currentTime: item
    })
  }, [])


  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <span className={style.expense}>总支出：<b>¥ { totalExpense }</b></span>
          <span className={style.income}>总收入：<b>¥ { totalIncome }</b></span>
        </div>
        <div className={style.typeWrap}>
          <div className={style.left} onClick={toggle}>
            <span className={style.title}>{ currentSelect.name || '全部类型' } <Icon className={style.arrow} /></span>
          </div>
          <div className={style.right}>
            <span className={style.time} onClick={monthToggle}>{ currentTime }<Icon className={style.arrow} type="arrow-bottom" /></span>
          </div>
        </div>
      </div>
      <div className={style.contentWrap}>
        {
          list.length ? (
            <Pull
              animationDuration={200}
              stayTime={400}
              refresh={{
                state: refreshing,
                handler: refreshData
              }}
              load={{
                state: loading,
                distance: 200,
                handler: loadData
              }}
            >
              {
                list.map((item, index) => {
                  return (
                    <div key={index}>
                      <BillItem bill={item}/>
                    </div>
                  )
                })
              }
            </Pull>
          ) : null
        }
      </div>
      <div className={style.add} onClick={addToggle}><CustomIcon type='tianjia' /></div>
      <PopupType ref={typeRef} onSelect={select}/>
      <PopupDate ref={monthRef} mode={'month'} onSelect={selectMonth}/>
      <PopupBill ref={billRef} onReload={refreshData}/>
    </div>
  )
}
