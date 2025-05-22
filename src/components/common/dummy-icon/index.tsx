import styles from './styles.module.scss';

const DummyIcon = ({ shape }: { shape: string }) => {
  return <div className={`${styles.dummyIcon} ${styles[shape]}`} />;
};

export default DummyIcon;
