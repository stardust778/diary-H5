import React, { useCallback } from 'react';
import { Cell, Input, Button, Checkbox, Toast } from 'zarm';
import CustomIcon from '@/common/components/CustomIcon';
import Captcha from 'react-captcha-code';
import style from './index.module.less';
import { useSetState } from '@/common/hooks';
import $request from '@/common/utils/request';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';

interface Login {
  token: string;
}

const Login = () => {
  const [state, setState] = useSetState({
    type: 'login',  // 登录注册类型
    captcha: '',  // 验证码变化后存储值
    username: '',  // 账号
    password: '',  // 密码
    verify: '',  // 验证码
  })
  const navigate = useNavigate();

  const { type, captcha, username, password, verify } = state;

  const handleCaptchaChange = useCallback((captcha: string) => {
    console.log('captcha', captcha)
    setState({
      captcha
    })
  }, [])

  // 表单提交
  const onSubmit = async () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    try {
      if(type === 'login') {
        const res = await $request.post<Login>('api/user/login', {
          username,
          password
        })
        localStorage.setItem('token', res.data.token);
        navigate('/');
        if(res.code === 200) {
          setState({
            type: 'login'
          })
          Toast.show('登录成功');
        }
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        };
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        };
        const res = await $request.post<null>('api/user/register', {
          username, 
          password
        })
        if(res.code === 200) {
          Toast.show('注册成功');
          setState({
            type: 'register'
          })
        }
      }
     
    } catch(err) {
      console.log(err, 'err')
      Toast.show('系统错误');
      Promise.reject(err)
    }
  }

  return <div className={style.auth}>
    <div className={style.head} />
    <div className={style.tab}>
      <span className={classnames({ [style.avtive]: type == 'login' })} onClick={() => setState({ type: 'login' })}>登录</span>
      <span className={classnames({ [style.avtive]: type == 'register' })} onClick={() => setState({ type: 'register' })}>注册</span>
    </div>
    <div className={style.form}>
      <Cell icon={<CustomIcon type="zhanghao" />}>
        <Input
          clearable
          type="text"
          placeholder="请输入账号"
          onChange={(value: string | undefined) => setState({ username: value })}
        />
      </Cell>
      <Cell icon={<CustomIcon type="mima" />}>
        <Input
          clearable
          type="password"
          placeholder="请输入密码"
          onChange={(value: string | undefined) => setState({ password: value })}
        />
      </Cell>
      {
        type === 'register' ? 
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入验证码"
            onChange={(value: string | undefined) => setState({ verify: value })}
          />
          <Captcha charNum={4} onChange={handleCaptchaChange}/>
        </Cell> : null
      }
      
    </div>
    <div className={style.operation}>
      <div className={style.agree}>
        <Checkbox />
        <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
      </div>
      <Button block theme="primary" onClick={onSubmit}>{type == 'login' ? '登录' : '注册'}</Button>
    </div>
  </div>
}

export default Login