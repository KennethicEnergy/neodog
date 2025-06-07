import clsx from 'clsx';
import styles from './styles.module.scss';

type StatusTagProps = {
  status: string;
  bgColor?: 'info' | 'primary' | 'success' | 'danger' | 'warning';
  className?: string;
};

const StatusTag = ({ status, bgColor = 'info', className }: StatusTagProps) => {
  return (
    <div className={clsx(styles.status, styles[bgColor], className)}>
      {status}
    </div>
  );
};

export default StatusTag;
