import { useEffect } from 'react';
import style from './index.module.less';
import $request from '@/common/utils/request';
import { useSetState } from '@/common/hooks';
import { useNavigate } from 'react-router-dom';
import { Cell, Button } from 'zarm';

interface IState {
  user: {
    id?: number;
    username?: string;
    signature?: string;
    avatar?: string;
  }
}

const User = () => {
  const [state, setState] = useSetState<IState>({
    user: { }
  })
  const navigate = useNavigate();

  const { user } = state;

  const getUserInfo = async () => {
    const res = await $request.get<IState['user']>('/api/user/get_userinfo');
    setState({ user: res.data });
  }

  // 退出登录
  const logout = async () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <div className={style.user}>
      <div className={style.head}>
        <div className={style.info}>
          <span>昵称：{ user.username || '' }</span>
          <span>
            <img style={{ width: 30, height: 30, verticalAlign: '-10px' }} src="//s.yezgea02.com/1615973630132/geqian.png" alt="" />
            <b>{user.signature || '暂无个签'}</b>
          </span>
        </div>
        <img className={style.avatar} style={{ width: 60, height: 60, borderRadius: 8 }} src={user.avatar || ''} alt="" />
      </div>
      <div className={style.content}>
        <Cell
          hasArrow
          title='用户信息修改'
          onClick={() => navigate('/userinfo')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/gxqm.png" alt="" />}
        />
        <Cell
          hasArrow
          title="重制密码"
          onClick={() => navigate('/account')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615974766264/zhaq.png" alt="" />}
        />
        <Cell
          hasArrow
          title="关于我们"
          onClick={() => navigate('/about')}
          icon={<img style={{ width: 20, verticalAlign: '-7px' }} src="//s.yezgea02.com/1615975178434/lianxi.png" alt="" />}
        />
      </div>
      <Button className={style.logout} block theme="danger" onClick={logout}>退出登录</Button>
    </div>
  )
}

export default User;