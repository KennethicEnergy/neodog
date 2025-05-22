import Card from '@/src/components/common/card';
import Table from '@/src/components/common/table';
import styles from './page.module.scss';

const DashboardPage = () => {
  return (
    <>
      <div className={styles.gridRow}>
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '250px' }}
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '250px' }}
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '250px' }}
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '250px' }}
        />
      </div>
      <div className={styles.gridRow2}>
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '550px' }}
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '550px' }}
        />
      </div>
      <div className={styles.gridRow2}>
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '550px' }}
        />
        <Card
          title="Lorem Ipsum"
          description="Lorem ipsum, dolor sit amet"
          cardStyles={{ height: '550px' }}
        />
      </div>

      <div className={styles.gridRow}>
        <Table />
      </div>
    </>
  );
};

export default DashboardPage;
