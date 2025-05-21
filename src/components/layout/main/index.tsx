import React from 'react';
import styles from './styles.module.scss';
import Card from '../../common/card';

const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim, nisi?" cardStyles={{height: '200px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim, nisi?" cardStyles={{height: '200px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim, nisi?" cardStyles={{height: '200px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim, nisi?" cardStyles={{height: '200px'}}/>
      </div>
    </main>
  )
}

export default Main