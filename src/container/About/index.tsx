import React from 'react'
import Header from '@/common/components/Header'

import s from './index.module.less'

const About = () => {
  return <>
    <Header title='关于我们' />
    <div className={s.about}>
      <h2>关于项目</h2>
      <article>这个项目的初衷，是想让从事前端开发的同学，进入全栈开发的领域。当然，不能说学完本教程你就能胜任任何全栈开发。但至少，你已经可以从设计数据库表开始，把自己的一个想法转化成实际可见的项目。</article>
      <h2>关于小册</h2>
      <article>服务端采用 Node 上层架构 Egg.js，前端采用 React 框架 + Zarm 移动端组件库。</article>
    </div>
  </>
};

export default About;