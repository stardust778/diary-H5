import { forwardRef } from 'react';
import { useSetState } from '@/common/hooks';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';

interface IProps {
  onSelect: Function;
  mode?: 'month' | 'date'
}

interface IState {
  show: boolean;
  now: Date;
}

const PopupDate = forwardRef(({ onSelect, mode = 'date' }: IProps, ref: any) => {
  const [state, setState] = useSetState<IState>({
    show: false,
    now: new Date()
  })
  const { show, now } = state;
  const choseMonth = (item: Date) => {
    setState({
      now: item,
      show: false
    })
    if(mode === 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if(mode === 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  if(ref) {
    ref.current= {
      show: () => {
        setState({ show: true })
      },
      close: () => {
        setState({ show: false })
      }
    }
  }

  return (
    <Popup
      visible={show}
      direction='bottom'
      onMaskClick={() => setState({ show: false })}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div>
        <DatePicker 
          visible={show}
          value={now}
          mode={mode}
          onOk={choseMonth}
          onCancel={() => setState({ show: false })}
        />
      </div>
    </Popup>
  )
})

export default PopupDate;