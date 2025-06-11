import styles from './styles.module.scss';

const DummyIcon = ({
  shape = 'square',
  onClick,
  height = 24,
  width = 24
}: {
  shape?: string;
  onClick?: () => void;
  height?: number;
  width?: number;
}) => {
  return (
    <div
      className={`${styles.dummyIcon} ${styles[shape]} ${onClick != null ? styles.clickable : ''}`}
      style={{ height, width }}
      onClick={onClick}
    />
  );
};

export default DummyIcon;
