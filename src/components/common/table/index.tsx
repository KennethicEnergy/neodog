import { useModalStore } from '@/src/store/modal-store';
import { TTableData } from '@/src/types/table';
import { useMemo, useState } from 'react';
import BaseModal from '../base-modal';
import Icon from '../icon';
import styles from './styles.module.scss';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface TableProps extends TTableData {
  fixedColumns?: number | number[]; // Column indices to fix (e.g., [0, 2, 5] or just 2 for first N columns)
  fixedRows?: number | number[]; // Row indices to fix (e.g., [0, 1] or just 2 for first N rows)
  maxHeight?: string; // Custom max height for the table body
  enableSorting?: boolean; // Enable/disable sorting functionality
}

const Table = ({
  title,
  icon,
  data,
  viewAll = false,
  fixedColumns = [],
  fixedRows = [],
  maxHeight = '400px',
  enableSorting = true
}: TableProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const headers = [
    { key: 'date', label: 'Date' },
    { key: 'client', label: 'Client' },
    { key: 'pet', label: 'Pet' },
    { key: 'task', label: 'Task' },
    { key: 'assignedTo', label: 'Assigned To' },
    { key: 'status', label: 'Status' }
  ];

  const fixedColIndices = Array.isArray(fixedColumns)
    ? fixedColumns
    : Array.from({ length: fixedColumns }, (_, i) => i);

  const fixedRowIndices = Array.isArray(fixedRows)
    ? fixedRows
    : Array.from({ length: fixedRows }, (_, i) => i);

  const tableClasses = [
    styles.tableWrapper,
    fixedColIndices.length > 0 ? styles.hasFixedColumns : '',
    fixedRowIndices.length > 0 ? styles.hasFixedRows : '',
    enableSorting ? styles.sortingEnabled : ''
  ]
    .filter(Boolean)
    .join(' ');

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    if (!enableSorting) return;

    let direction: SortDirection = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key: direction ? key : '', direction });
  };

  const isRightAlignedColumn = (index: number) => {
    const totalColumns = headers.length;
    const halfColumns = Math.floor(totalColumns / 2);
    return index >= halfColumns;
  };

  const generateColumnPositions = () => {
    const leftPositions: Record<string, string> = {};
    const rightPositions: Record<string, string> = {};

    let leftOffset = 0;
    let rightOffset = 0;

    fixedColIndices.forEach((colIndex) => {
      if (isRightAlignedColumn(colIndex)) {
        rightPositions[`--right-col-${colIndex}`] = `${rightOffset * 150}px`;
        rightOffset++;
      } else {
        leftPositions[`--left-col-${colIndex}`] = `${leftOffset * 150}px`;
        leftOffset++;
      }
    });

    return { ...leftPositions, ...rightPositions };
  };

  const getSortIcon = (key: string) => {
    if (!enableSorting || sortConfig.key !== key) {
      return '↕';
    }

    if (sortConfig.direction === 'asc') {
      return '↑';
    } else if (sortConfig.direction === 'desc') {
      return '↓';
    }

    return '↕';
  };

  const expandView = () => {
    console.log('Opening Table with');
    openModal(
      <BaseModal onClose={closeModal}>
        <Table data={data} title="Checked-In Dogs" icon="/images/paw-white.svg" />
      </BaseModal>
    );
  };

  return (
    <div
      className={tableClasses}
      style={
        {
          '--fixed-columns': fixedColIndices.join(','),
          '--max-height': maxHeight,
          ...generateColumnPositions()
        } as React.CSSProperties & Record<string, string | number>
      }>
      <div className={styles.tableInfo}>
        <div>
          {icon && <Icon src={icon} bgColor="#3b82f6" />}
          {title && <h3>{title}</h3>}
        </div>
        {viewAll && (
          <div className={styles.viewAll} onClick={expandView}>
            View All
          </div>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header.key}
                  className={`${fixedColIndices.includes(index) ? styles.fixedColumn : ''} ${enableSorting ? styles.sortable : ''}`}
                  data-column-index={index}
                  onClick={() => handleSort(header.key)}>
                  <div className={styles.headerContent}>
                    <span>{header.label}</span>
                    {enableSorting && (
                      <span className={styles.sortIcon}>{getSortIcon(header.key)}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={fixedRowIndices.includes(rowIndex) ? styles.fixedRow : ''}>
                <td
                  className={fixedColIndices.includes(0) ? styles.fixedColumn : ''}
                  data-column-index={0}>
                  {row.date}
                </td>
                <td
                  className={fixedColIndices.includes(1) ? styles.fixedColumn : ''}
                  data-column-index={1}>
                  {row.client}
                </td>
                <td
                  className={fixedColIndices.includes(2) ? styles.fixedColumn : ''}
                  data-column-index={2}>
                  {row.pet}
                </td>
                <td
                  className={fixedColIndices.includes(3) ? styles.fixedColumn : ''}
                  data-column-index={3}>
                  {row.task}
                </td>
                <td
                  className={fixedColIndices.includes(4) ? styles.fixedColumn : ''}
                  data-column-index={4}>
                  {row.assignedTo}
                </td>
                <td
                  className={fixedColIndices.includes(5) ? styles.fixedColumn : ''}
                  data-column-index={5}>
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
