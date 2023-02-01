import React from 'react';
import { Cell, Input, Button, Toast } from 'zarm';
import { createForm } from 'rc-form';
import Header from '@/common/components/Header';
import $request from '@/common/utils/request';
import style from './index.module.less';

interface IProps {
  form: {
    getFieldProps: Function
    getFieldValue: Function
    getFieldError: Function
    validateFields: Function
    getFieldDecorator: Function
  }
}

const Account = (props: IProps) => {
  const { getFieldProps, getFieldError } = props.form;
  // 提交修改方法
  const submit = () => {
    props.form.validateFields(async (err: Error, value: { oldpass: string, newpass: string, newpass2: string }) => {
      if(!err) {
        if(value.newpass !== value.newpass2) {
          Toast.show('新密码输入不一致');
          return
        }
        await $request.post('/api/user/modify_pass', {
          old_pass: value.oldpass,
          new_pass: value.newpass,
          new_pass2: value.newpass2
        })
        Toast.show('修改成功')
      }
    })
  }
  return (
    <>
      <Header title="重制密码"/>
      <div className={style.account}>
        <div className={style.form}>
          <Cell title="原密码">
            <Input 
              clearable
              type="text"
              placeholder="请输入原密码"
              { ...getFieldProps('oldpass', { rules: [{ required: true }] }) }
            />
          </Cell>
          <Cell title="新密码">
            <Input 
              clearable
              type="text"
              placeholder="请输入新密码"
              { ...getFieldProps('newpass', { rules: [{ required: true }] }) }
            />
          </Cell>
          <Cell title="确认密码">
            <Input
              clearable
              type="text"
              placeholder="请再此输入新密码确认"
              {...getFieldProps('newpass2', { rules: [{ required: true }] })}
            />
          </Cell>
        </div>
        <Button className={style.btn} block theme="primary" onClick={submit}>提交</Button>
      </div>
    </>
  )
}

export default createForm()(Account);