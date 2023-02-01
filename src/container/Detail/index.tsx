import Header from '@/common/components/Header';
import style from './index.module.less';
import { useEffect, useRef } from 'react';
import { useSetState } from '@/common/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import $request from '@/common/utils/request';
import qs from 'query-string';
import dayjs from 'dayjs';
import classnames from 'classnames';
import CustomIcon from '@/common/components/CustomIcon';
import { typeMap } from '@/common/utils/typemap';
import { Modal, Toast } from 'zarm';
import PopupBill from '@/common/components/PopupBill';


interface IState {
  detail: TSBill.billDetail
}

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = qs.parse(location.search);
  const editRef = useRef<any>();
  const [state, setState] = useSetState<IState>({
    detail: {}
  })
  const { detail } = state;
  useEffect(() => {
    getDetail()
  }, [])
  
  const getDetail = async () => {
    const params = {
      id
    }
    const res = await $request.get<TSBill.billDetail>('/api/bill/detail', params);
    setState({
      detail: res.data
    })
  }

  // 删除账单方法
  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: async () => {
        const res = await $request.post('api/bill/delete', { id })
        Toast.show('删除成功')
        navigate(-1)
      }
    })
  }

  return (
    <div className={style.detail}>
      <Header title='账单详情'/>
      <div className={style.card}>
        <div className={style.type}>
        <span className={classnames({ [style.expense]: detail.pay_type == 1, [style.income]: detail.pay_type == 2 })}>
          {/* typeMap 是我们事先约定好的 icon 列表 */}
          <CustomIcon className={style.iconfont} type={detail.type_id ? typeMap[detail.type_id as keyof typeof typeMap].icon : ''} />
        </span>
          <span>{ detail.type_name || '' }</span>
        </div>
        {
          detail.pay_type === 1
            ? <div className={classnames(style.amount, style.expense)}>-{detail.amount}</div>
            : <div className={classnames(style.amount, style.incom)}>+{ detail.amount }</div>
        }
        <div className={style.info}>
          <div className={style.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={style.remark}>
            <span>备注</span>
            <span>{ detail.remark || '-' }</span>
          </div>
        </div>
        <div className={style.operation}>
          <span onClick={deleteDetail}><CustomIcon type='shanchu' />删除</span>
          <span onClick={() => editRef.current && editRef.current.show()}><CustomIcon type='tianjia' />编辑</span>
        </div>
      </div>
      <PopupBill ref={editRef} onReload={getDetail} detail={detail}/>
    </div>
  )
}

export default Detail;