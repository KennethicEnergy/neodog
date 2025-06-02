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
  columnOverflow?: 'left' | 'right' | 'auto'; // Control overflow direction for fixed columns
}

const Table = ({
  title,
  icon,
  data,
  viewAll = false,
  fixedColumns = [],
  fixedRows = [],
  maxHeight = '400px',
  enableSorting = true,
  columnOverflow = 'auto'
}: TableProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const headers = [
    { key: 'pet', label: 'Pet' },
    { key: 'client', label: 'Client' },
    { key: 'lodging', label: 'Lodging' },
    { key: 'locker', label: 'Locker' },
    { key: 'checkIn', label: 'Check In' },
    { key: 'checkOut', label: 'Check Out' },
    { key: 'services', label: 'Services' },
    { key: 'belongings', label: 'Belongings' },
    { key: 'details', label: 'Details' }
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
    const lastColumnIndex = totalColumns - 1;

    // If columnOverflow is 'auto', determine based on position
    if (columnOverflow === 'auto') {
      // Last column should overflow left, others based on position
      if (index === lastColumnIndex) {
        return true; // Last column overflows left
      }
      const halfColumns = Math.floor(totalColumns / 2);
      return index >= halfColumns;
    }

    // If columnOverflow is explicitly set, use that for all fixed columns
    return columnOverflow === 'left';
  };

  const generateColumnPositions = () => {
    const leftPositions: Record<string, string> = {};
    const rightPositions: Record<string, string> = {};

    let leftOffset = 0;
    let rightOffset = 0;

    // Sort fixed columns by their index to ensure proper positioning
    const sortedFixedCols = [...fixedColIndices].sort((a, b) => a - b);

    sortedFixedCols.forEach((colIndex) => {
      if (isRightAlignedColumn(colIndex)) {
        // For right-aligned (overflow left) columns, position from the right
        rightPositions[`--right-col-${colIndex}`] = `${rightOffset * 150}px`;
        rightOffset++;
      } else {
        // For left-aligned (overflow right) columns, position from the left
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
                  className={`${fixedColIndices.includes(index) ? styles.fixedColumn : ''} ${fixedColIndices.includes(index) && isRightAlignedColumn(index) ? styles.fixedColumnRight : ''} ${enableSorting ? styles.sortable : ''}`}
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
                {headers.map((header, colIndex) => (
                  <td
                    key={header.key}
                    className={`${fixedColIndices.includes(colIndex) ? styles.fixedColumn : ''} ${fixedColIndices.includes(colIndex) && isRightAlignedColumn(colIndex) ? styles.fixedColumnRight : ''}`}
                    data-column-index={colIndex}>
                    {row[header.key as keyof typeof row]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;