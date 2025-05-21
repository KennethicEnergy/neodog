import React from 'react';
import styles from './styles.module.scss';
import Card from '../../common/card';

const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '550px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '550px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '350px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '350px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '350px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '350px'}}/>
      </div>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '150px'}}/>
      </div>
    </main>
  )
}

export default Main