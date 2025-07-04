import VaccinationsTable from '@/app/(pages)/vaccinations/components/VaccinationsTable';
import Loader from '@/components/common/loader';
import React from 'react';
import styles from './ClientDetailView.module.scss';
import { TransformedVaccination } from './types';

interface VaccinationTabProps {
  vaccinationsLoading: boolean;
  filteredVaccinations: TransformedVaccination[];
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
        <VaccinationsTable vaccinations={filteredVaccinations} />
      ) : (
        <div style={{ color: '#888', padding: '2rem 0', textAlign: 'center' }}>
          No vaccination records found for this client.
        </div>
      )}
    </div>
  );
};

export default VaccinationTab;
