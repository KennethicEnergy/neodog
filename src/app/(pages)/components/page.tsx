'use client';

import FormComponentsExample from '@/components/common/form-components/example';
import styles from './page.module.scss';

const SettingsPage = () => {
  return (
    <div className={styles.componentsPage}>
      <div className={styles.content}>
        <FormComponentsExample />
      </div>
    </div>
  );
};

export default SettingsPage;
