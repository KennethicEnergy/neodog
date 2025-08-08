import VaccinationsTable from '@/app/(pages)/vaccinations/components/VaccinationsTable';
import Loader from '@/components/common/loader';
import React from 'react';
import styles from './ClientDetailView.module.scss';

interface VaccinationTableRow extends Record<string, unknown> {
  id?: number;
  clientName?: string[];
  petName?: string;
  vaccine?: string;
  expiryDate?: string;
  dateCreated?: string;
  status?: string;
  statusCode?: string;
  actions: object[];
}

interface VaccinationTabProps {
  vaccinationsLoading: boolean;
  filteredVaccinations: VaccinationTableRow[];
}

const VaccinationTab: React.FC<VaccinationTabProps> = ({
  vaccinationsLoading,
  filteredVaccinations
}) => {
  return (
    <div className={styles.activity}>
      <h4>Vaccination Records</h4>
      {vaccinationsLoading ? (
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading vaccination records...</p>
        </div>
      ) : filteredVaccinations.length > 0 ? (
        <VaccinationsTable vaccinations={filteredVaccinations} hideActions={true} />
      ) : (
        <div style={{ color: '#888', padding: '2rem 0', textAlign: 'center' }}>
          No vaccination records found for this client.
        </div>
      )}
    </div>
  );
};

export default VaccinationTab;
