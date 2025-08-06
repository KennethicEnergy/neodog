import { useModalStore } from '@/store/modal-store';
import { useEffect, useMemo, useState } from 'react';
import BaseModal from '../base-modal';
import Icon from '../icon';
import StatusTag from '../status-tag';
import styles from './styles.module.scss';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

interface TableHeader {
  key: string;
  label: string;
}

interface BaseTableData {
  title?: string;
  icon?: string;
  viewAll?: boolean;
}

interface TableProps<T extends Record<string, unknown>> extends BaseTableData {
  data: T[]; // Generic data array
  headers: TableHeader[]; // Dynamic headers
  fixedColumns?: number | number[]; // Column indices to fix (e.g., [0, 2, 5] or just 2 for first N columns)
  fixedRows?: number | number[]; // Row indices to fix (e.g., [0, 1] or just 2 for first N rows)
  maxHeight?: string; // Custom max height for the table body
  enableSorting?: boolean; // Enable/disable sorting functionality
  columnOverflow?: 'left' | 'right' | 'auto'; // Control overflow direction for fixed columns
  tableOnly?: boolean;
  totalCount?: number; // Optional: total number of items for server-side pagination
  currentPage?: number; // Optional: current page for controlled pagination
  onPageChange?: (page: number) => void; // Optional: page change handler for controlled pagination
  hidePagination?: boolean;
}

const ITEMS_PER_PAGE = 10;

const Table = <T extends Record<string, unknown>>({
  title,
  icon,
  data,
  headers,
  viewAll = false,
  fixedColumns = [],
  fixedRows = [],
  maxHeight = '60vh',
  enableSorting = true,
  columnOverflow = 'auto',
  tableOnly = false,
  totalCount,
  currentPage,
  onPageChange,
  hidePagination = false
}: TableProps<T>) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  // Use controlled or internal page state
  const [internalPage, setInternalPage] = useState(1);
  const page = typeof currentPage === 'number' ? currentPage : internalPage;

  // Reset to first page if data changes and using internal state
  useEffect(() => {
    if (typeof currentPage !== 'number') setInternalPage(1);
  }, [data]);

  const fixedColIndices = Array.isArray(fixedColumns)
    ? fixedColumns
    : Array.from({ length: fixedColumns }, (_, i) => i);

  const fixedRowIndices = Array.isArray(fixedRows)
    ? fixedRows
    : Array.from({ length: fixedRows }, (_, i) => i);

  const tableClasses = [
    styles.tableWrapper,
    tableOnly && styles.tableOnly,
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
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle different data types for sorting
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortConfig.direction === 'asc' ? 1 : -1;

      // Convert to string for comparison if not numbers
      const aSort = typeof aValue === 'number' ? aValue : String(aValue).toLowerCase();
      const bSort = typeof bValue === 'number' ? bValue : String(bValue).toLowerCase();

      if (aSort < bSort) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aSort > bSort) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Always use server-side pagination: do not slice the data
  const paginatedData = useMemo(() => {
    return sortedData;
  }, [sortedData]);

  const safeTotalCount = typeof totalCount === 'number' ? totalCount : sortedData.length;
  const totalPages = Math.ceil(safeTotalCount / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

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
    openModal(
      <BaseModal onClose={closeModal}>
        <Table data={data} headers={headers} title={title || 'Table View'} icon={icon} />
      </BaseModal>
    );
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'Current':
      case 'current':
        return 'success';
      case 'INACTIVE':
      case 'Overdue':
      case 'overdue':
        return 'danger';
      case 'FOLLOW-UP REQUIRED':
      case 'Due Soon':
      case 'due_soon':
        return 'warning';
      case 'PENDING':
      case 'Missing':
      case 'missing':
        return 'primary';
      default:
        return 'info'; // fallback
    }
  };

  // Helper function to render cell content
  const renderCellContent = (row: T, headerKey: string) => {
    const value = row[headerKey];

    // If it's a number, you might want to format it
    if (typeof value === 'number') {
      return value.toLocaleString();
    }

    if (headerKey === 'name' && typeof value === 'string') {
      return <div className={styles.name}>{value}</div>;
    }

    if (headerKey === 'pet' && Array.isArray(value)) {
      return value.map((item: { image: string; name: string; breed: string }, index: number) => (
        <div className={styles.petItem} key={index}>
          <Icon src={item.image} height={40} width={40} shape="circle" />
          <div className={styles.petInfo}>
            <span className={styles.petName}>{item.name}</span>
            <span className={styles.petBreed}>{item.breed}</span>
          </div>
        </div>
      ));
    }

    if (headerKey === 'actions' && Array.isArray(value)) {
      return (
        <div className={styles.actionItems}>
          {value.map((item, index) => (
            <button className={styles.actionItem} key={index} onClick={item.onClick}>
              <Icon src={item.icon} />
            </button>
          ))}
        </div>
      );
    }

    if (headerKey === 'contact' && Array.isArray(value)) {
      if (!Array.isArray(value)) return 'N/A';
      return value.map((item, index) => (
        <div className={styles.arrayItem} key={index}>
          <span>
            {item.type === 'email' ? (
              <Icon src="/images/contact/mail.svg" />
            ) : (
              <Icon src="/images/contact/phone.svg" />
            )}
          </span>
          <span>{item.value}</span>
        </div>
      ));
    }

    if (headerKey === 'status' && typeof value === 'string') {
      return <StatusTag status={value} bgColor={getStatusClass(value)} />;
    }

    if (headerKey === 'ownerAndContact' && Array.isArray(value)) {
      return (
        <div className={styles.ownerAndContact}>
          <span className={styles.ownerName}>{value[0]}</span>
          <span className={styles.ownerContact}>{value[1]}</span>
        </div>
      );
    }

    if (headerKey === 'clientName' && Array.isArray(value)) {
      return (
        <div className={styles.ownerAndContact}>
          <span className={styles.ownerName}>{value[0]}</span>
          <span className={styles.ownerContact}>{value[1]}</span>
        </div>
      );
    }

    if (
      (headerKey === 'currentCount' ||
        headerKey === 'dueSoonCount' ||
        headerKey === 'overdueCount' ||
        headerKey === 'missingCount') &&
      typeof value === 'string'
    ) {
      return <StatusTag status={value} bgColor={getStatusClass(value)} />;
    }

    if (headerKey === 'petName' && typeof value === 'string') {
      return <div className={styles.name}>{value}</div>;
    }

    if (headerKey === 'vaccine' && typeof value === 'string') {
      return <div className={styles.vaccineName}>{value}</div>;
    }

    if (headerKey === 'expiryDate' && typeof value === 'string') {
      return <div className={styles.date}>{value}</div>;
    }

    if (headerKey === 'dateCreated' && typeof value === 'string') {
      return <div className={styles.date}>{value}</div>;
    }

    return String(value);
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
      {(title || icon || viewAll) && (
        <div className={styles.tableInfo}>
          <div>
            {icon && <Icon src={icon} bgColor="blueActive" />}
            {title && <h3>{title}</h3>}
          </div>
          {viewAll && (
            <div className={styles.viewAll} onClick={expandView}>
              View All
            </div>
          )}
        </div>
      )}

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
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={headers.length} className={styles.noData}>
                  <div className={styles.noDataText}>No data found</div>
                </td>
              </tr>
            )}
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex + (page - 1) * ITEMS_PER_PAGE}
                className={fixedRowIndices.includes(rowIndex) ? styles.fixedRow : ''}>
                {headers.map((header, colIndex) => (
                  <td
                    key={header.key}
                    className={`${fixedColIndices.includes(colIndex) ? styles.fixedColumn : ''} ${fixedColIndices.includes(colIndex) && isRightAlignedColumn(colIndex) ? styles.fixedColumnRight : ''}`}
                    data-column-index={colIndex}>
                    {renderCellContent(row, header.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      {safeTotalCount >= ITEMS_PER_PAGE && !hidePagination && (
        <div
          className={styles.pagination}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Showing X-Y of Z */}
          <div className={styles.paginationInfo}>
            {(() => {
              const firstItem = (page - 1) * ITEMS_PER_PAGE + 1;
              const lastItem = Math.min(page * ITEMS_PER_PAGE, safeTotalCount);
              if (firstItem === lastItem) {
                return `Showing ${firstItem} of ${safeTotalCount}`;
              }
              return `Showing ${firstItem}-${lastItem} of ${safeTotalCount}`;
            })()}
          </div>
          {/* Right: Pagination Controls */}
          <div className={styles.paginationControls}>
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}>
              Prev
            </button>
            {/* Smart Pagination Buttons */}
            {(() => {
              const pageButtons = [];
              const pageWindow = 2; // pages before/after current
              const startPage = Math.max(2, page - pageWindow);
              const endPage = Math.min(totalPages - 1, page + pageWindow);

              // Always show first page
              pageButtons.push(
                <button
                  key={1}
                  className={`${styles.pageButton} ${page === 1 ? styles.activePage : ''}`}
                  onClick={() => handlePageChange(1)}
                  disabled={page === 1}>
                  1
                </button>
              );

              // Ellipsis if needed before window
              if (startPage > 2) {
                pageButtons.push(
                  <span key="start-ellipsis" className={styles.ellipsis}>
                    ...
                  </span>
                );
              }

              // Pages in window
              for (let p = startPage; p <= endPage; p++) {
                pageButtons.push(
                  <button
                    key={p}
                    className={`${styles.pageButton} ${page === p ? styles.activePage : ''}`}
                    onClick={() => handlePageChange(p)}
                    disabled={page === p}>
                    {p}
                  </button>
                );
              }

              // Ellipsis if needed after window
              if (endPage < totalPages - 1) {
                pageButtons.push(
                  <span key="end-ellipsis" className={styles.ellipsis}>
                    ...
                  </span>
                );
              }

              // Always show last page if more than 1
              if (totalPages > 1) {
                pageButtons.push(
                  <button
                    key={totalPages}
                    className={`${styles.pageButton} ${page === totalPages ? styles.activePage : ''}`}
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}>
                    {totalPages}
                  </button>
                );
              }

              return pageButtons;
            })()}
            <button
              className={styles.pageButton}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}>
              Next
            </button>
            {/* Select Page Dropdown */}
            <label className={styles.selectPageLabel} style={{ marginLeft: '8px' }}>
              <span>Select Page:</span>
              <select
                className={styles.selectPageDropdown}
                value={page}
                onChange={(e) => handlePageChange(Number(e.target.value))}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
