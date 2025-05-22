import Card from '../../common/card';
import Table from '../../common/table';
import Footer from '../footer';
import styles from './styles.module.scss';

const Main = () => {
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

      <div className={styles.footerRow}>
        <Footer />
      </div>
    </>
  );
};

export default Main;
