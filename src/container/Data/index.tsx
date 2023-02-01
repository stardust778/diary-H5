import { Icon, Progress } from 'zarm';
import { useEffect, useRef } from 'react';
import { useSetState } from '@/common/hooks';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { typeMap } from '@/common/utils/typemap';
import CustomIcon from '@/common/components/CustomIcon';
import PopupDate from '@/common/components/PopupDate';
import style from './index.module.less';
import $request from '@/common/utils/request';
import echarts from 'echarts';

interface IState {
  currentMonth: string;
  totalType: 'expense' | 'income';
  totalExpense: number;
  totalIncome: number;
  expenseData: TSData.DataItem[];
  incomeData: TSData.DataItem[];
  pieType: 'expense' | 'income';
}

let proportionChart: any = null;  // 用于存放 echart 初始化返回的实例

const Data = () => {
  const monthRef = useRef<any>();
  const [state, setState] = useSetState<IState>({
    currentMonth: dayjs().format('YYYY-MM'),
    totalType: 'expense',
    totalExpense: 0,
    totalIncome: 0,
    expenseData: [],
    incomeData: [],
    pieType: 'expense'  // 饼图的「收入」和「支出」控制
  })
  const { 
    currentMonth, totalType, 
    totalExpense, totalIncome, 
    expenseData, incomeData,
    pieType
  } = state;

  // 时间弹窗
  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  }

  const selectMonth = (item: string) => {
    setState({
      currentMonth: item
    })
  }

  // 绘制饼图方法
  const setPieChart = (data: TSData.DataItem[]) => {
    proportionChart = echarts.init(document.getElementById('proportion') as HTMLDivElement | HTMLCanvasElement);
    proportionChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      // 图例
      legend: {
        data: data.map(item => item.type_name)
      },
      series: [
        {
          name: '支出',
          type: 'pie',
          radius: '55%',
          data: data.map(item => {
            return {
              value: item.number,
              name: item.type_name
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }

  // 获取数据详情
  const getData = async () => {
    const res = await $request.get<TSData.Item>('/api/bill/data', { date: currentMonth })
    // 支出
    const _expense = res.data.total_data.filter(item => item.pay_type === 1).sort((a, b) => b.number - a.number);
    const _income = res.data.total_data.filter(item => item.pay_type === 2).sort((a, b) => b.number - a.number);
    setState({
      totalExpense: Number(res.data.total_expense),
      totalIncome: Number(res.data.total_income),
      expenseData: _expense,
      incomeData: _income,
    })
    setPieChart(pieType === 'expense' ? _expense : _income)
  }

  useEffect(() => {
    getData();
    return () => {
      proportionChart.dispose()
    }
  }, [currentMonth])

  // 切换收入支出类型
  const changeTotalType = (type: 'expense' | 'income') => {
    setState({ totalType: type })
  }

  // 切换饼图收入支出类型
  const changePieType = (type: 'expense' | 'income') => {
    setState({ pieType: type })
    setPieChart(type === 'expense' ? expenseData : incomeData)
  }

  return (
    <div className={style.data}>
      <div className={style.total}>
        <div className={style.time} onClick={monthShow}>
          <span>{ currentMonth }</span>
          <Icon className={style.date} type="date" />
        </div>
        <div className={style.title}>共支出</div>
        <div className={style.expense}>¥{ totalExpense }</div>
        <div className={style.income}>共收入¥{ totalIncome }</div>
      </div>
      <div className={style.structure}>
        <div className={style.head}>
          <span className={style.title}>收支构成</span>
          <div className={style.tab}>
            <span 
              onClick={() => changeTotalType('expense')} 
              className={classnames({[style.expense]: true, [style.active]: totalType === 'expense'})}>
              支出
            </span>
            <span
              onClick={() => changeTotalType('income')}
              className={classnames({[style.income]: true, [style.active]: totalType === 'income'})}
            >
              收入
            </span>
          </div>
        </div>
        <div className={style.content}>
          {
            (totalType === 'expense' ? expenseData : incomeData).map(item => {
              return (
                <div key={item.type_id} className={style.item}>
                  <div className={style.left}>
                    <div className={style.type}>
                      <span className={classnames({[style.expense]: totalType === 'expense', [style.income]: totalType === 'expense'})}>
                        <CustomIcon type={item.type_id ? typeMap[item.type_id as keyof typeof typeMap].icon : ''}/>
                      </span>
                      <span className={style.name}>{ item.type_name }</span>
                    </div>
                    <div className={style.progress}>￥{ Number(item.number).toFixed(2) || 0 }</div>
                  </div>
                  <div className={style.right}>
                    <div className={style.percent}>
                      <Progress
                        shape='line'
                        percent={Number(((item.number / (totalType == 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2))}
                        theme='primary'
                      />
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className={style.proportion}>
          <div className={style.head}>
            <span className={style.title}>收支构成</span>
            <div className={style.tab}>
              <span 
                onClick={() => changePieType('expense')} 
                className={classnames({[style.expense]: true, [style.active]: pieType === 'expense'})}>
                支出
              </span>
              <span 
                onClick={() => changePieType('income')} 
                className={classnames({[style.expense]: true, [style.active]: pieType === 'income'})}>
                收入
              </span>
            </div>
          </div>
          <div id="proportion"></div>
        </div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth}/>
    </div>
  )
}

export default Data;