import { useState, useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation
} from 'react-router-dom';
import NavBar from './common/components/NavBar';

import { routes } from './router/index';
// import { ConfigProvider } from 'zarm';
// import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
function App() {
  const [showNav, setShowNav] = useState(false);
  const needNav = ['/', '/data', '/user'] // 需要底部导航栏的路径
  const location = useLocation();
  const { pathname } = location;
  useEffect(() => {
    setShowNav(needNav.includes(pathname))
  }, [pathname])

  return (
    <>
      <Routes>
        {routes.map(route => <Route key={route.path} path={route.path} element={<route.component /> }/>)}
      </Routes>
      <NavBar showNav={showNav} />
    </>
  )
}

export default App
