import styles from './styles.module.scss';

const DummyIcon = ({ shape, onClick }: { shape: string; onClick?: () => void }) => {
  return (
    <div
      className={`${styles.dummyIcon} ${styles[shape]} ${onClick != null ? styles.clickable : ''}`}
      onClick={onClick}
    />
  );
};

export default DummyIcon;
