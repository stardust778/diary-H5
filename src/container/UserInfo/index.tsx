import { useEffect } from 'react';
import { FilePicker, Button, Input, Toast } from 'zarm';
import Header from '@/common/components/Header';
import style from './index.module.less';
import { useNavigate } from 'react-router-dom';
import { useSetState } from '@/common/hooks';
import $request from '@/common/utils/request';
import axios from 'axios';
import { baseUrl, imgUrlTrans } from '@/common/utils/upload';

interface IState {
  user: {
    id?: number;
    username?: string;
    signature?: string;
    avatar?: string;
  };
  avatar: string;
  signature: string;
}

const UserInfo = () => {
  const [state, setState] = useSetState<IState>({
    user: {},
    avatar: '',
    signature: ''
  })
  const { user, avatar, signature } = state;
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSelect = (file: any) => {
    console.log('file', file)
    if(file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过 200 KB!!');
      return
    }
    let formData = new FormData();
    // 生成 form-data 数据类型
    formData.append('file', file.file);
    axios({
      method: 'post',
      url: `${baseUrl}/upload`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': token
      }
    }).then(res => {
      setState({ avatar: imgUrlTrans(res.data) })
    })
  }

  // 获取用户信息
  const getUserInfo = async () => {
    const res = await $request.get<IState['user']>('/api/user/get_userinfo')
    setState({ user: res.data, avatar: imgUrlTrans(res.data.avatar), signature: res.data.signature })
  }

  // 编辑用户信息
  const save = async () => {
    const res = await $request.post('/api/user/edit_userinfo', {
      signature, avatar
    })
    Toast.show('修改成功');
    navigate(-1);
  }

  useEffect(() => {
    getUserInfo();
  }, [])

  return (
    <>
      <Header title='用户信息' />
      <div className={style.userinfo}>
        <h1>个人资料</h1>
        <div className={style.item}>
          <div className={style.title}>头像</div>
          <div className={style.avatar}>
            <img className={style.avatarUrl} src={avatar} alt=""/>
            <div className={style.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker onChange={handleSelect} accept='image/*'>
                <Button theme='primary' size='xs'>点击上传</Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={style.item}>
          <div className={style.title}>个性签名</div>
          <div className={style.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value: string | undefined) => setState({ signature: value })}
            />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme='primary'>保存</Button>
      </div>
    </>
  )
}

export default UserInfo;