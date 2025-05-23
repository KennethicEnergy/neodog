import { TTableData } from '@/src/types/types';
import Icon from '../icon';
import styles from './styles.module.scss';

const Table = ({ title, icon, data }: TTableData) => {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableInfo}>
        <>
          {icon && <Icon icon={icon} width={12} height={12} />}
          {title && <h3>{title}</h3>}
        </>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Pet</th>
            <th>Task</th>
            <th>Assigned To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
          <tr>
            <td>April 19, 2024</td>
            <td>Sarah Johnson</td>
            <td>Bella</td>
            <td>Medication</td>
            <td>David Miller</td>
            <td>Select</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
