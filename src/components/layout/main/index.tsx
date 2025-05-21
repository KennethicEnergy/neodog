import React from 'react';
import styles from './styles.module.scss';
import Card from '../../common/card';
import Footer from '../footer';
import Table from '../../common/table';

const Main = () => {
  return (
    <main className={styles.main}>
      <div className={styles.gridRow}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '250px'}}/>
      </div>
      <div className={styles.gridRow2}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '550px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '550px'}}/>
      </div>
      <div className={styles.gridRow2}>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '550px'}}/>
        <Card title="Lorem Ipsum" description="Lorem ipsum, dolor sit amet" cardStyles={{height: '550px'}}/>
      </div>

      <div className={styles.gridRow}>
        <Table />
      </div>

      <div className={styles.footerRow}>
        <Footer />
      </div>
    </main>
  )
}

export default Main