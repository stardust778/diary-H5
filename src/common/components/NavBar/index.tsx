import React, { FC } from 'react';
import { useSetState } from '@/common/hooks';
import { TabBar } from 'zarm';
import { useNavigate } from 'react-router-dom';
import style from './index.module.less';
import CustomIcon from '../CustomIcon';

const NavBar: FC<TSNavbar.IProps> = ({ showNav  }) => {
  const navigate = useNavigate();
  const [state, setState] = useSetState<TSNavbar.IState>({
    activeKey: '/'
  });
  const { activeKey } = state;
  const changeTab = (path: string) => {
    setState({ activeKey: path });
    navigate(path);
  }
  return (
    <TabBar 
      visible={showNav} 
      className={style.tab} 
      activeKey={activeKey}
      onChange={(path) => changeTab(path as string)}
    >
      <TabBar.Item 
        itemKey={'/'}
        title='账单'
        icon={<CustomIcon type="zhangdan" />}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type='tongji'/>}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode" />}
      />
    </TabBar>
  )
}

export default NavBar;