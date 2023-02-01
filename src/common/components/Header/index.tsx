import { useNavigate } from 'react-router-dom';
import { NavBar, Icon } from 'zarm';
import style from './index.module.less';

interface IProps {
  title: string;
}

const Header = (props: IProps) => {
  const navigate = useNavigate();
  return (
    <div className={style.headerWarp}>
      <div className={style.block}>
        <NavBar 
          className={style.header}
          left={<Icon type='arrow-left' theme='primary' onClick={() => navigate(-1)} />}
          title={props.title}
        />
      </div>
    </div>
  )
}

export default Header;