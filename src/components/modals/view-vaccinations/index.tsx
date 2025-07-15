import StatusTag from '@/components/common/status-tag';
import type { Vaccination as VaccinationApiType } from '@/services/vaccination.api';
import { vaccinationApi } from '@/services/vaccination.api';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Loader from '../add-vaccine/../../common/loader';
import styles from './view-vaccinations.module.scss';

interface ViewVaccinationsModalProps {
  petId: string | number;
  onClose: () => void;
}

const ViewVaccinationsModal: React.FC<ViewVaccinationsModalProps> = ({ petId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [vaccinations, setVaccinations] = useState<VaccinationApiType[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      vaccinationApi.viewRecordsByPetId(petId),
      vaccinationApi.getVaccinationNameReferences(),
      vaccinationApi.getVaccinationStatusReferences()
    ])
      .then(([res]) => {
        const all: VaccinationApiType[] = res.data?.result?.vaccinations || [];
        setVaccinations(Array.isArray(all) ? all : []);
      })
      .finally(() => setLoading(false));
  }, [petId]);

  return (
    <div className={styles.modalContainer}>
      <h4 className={styles.header}>Vaccination Record</h4>
      <div className={styles.section}>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loader />
            <p>Loading vaccinations...</p>
          </div>
        ) : vaccinations.length === 0 ? (
          <div className={styles.noRecords}>No vaccination records found for this pet.</div>
        ) : (
          vaccinations.map(
            (vax: {
              id: number;
              vaccination_name?: { name?: string };
              vaccination_status?: { name?: string };
              vaccination_date?: string;
              expiration_date?: string;
            }) => (
              <div key={vax.id} className={styles.vaccineCard}>
                <div className={styles.vaccineCardHeader}>
                  <div>
                    <div className={styles.vaccineName}>
                      {vax.vaccination_name?.name || 'Vaccination'}
                    </div>
                    <div className={styles.vaccineType}>Vaccination</div>
                  </div>
                  <div>
                    <StatusTag status={vax.vaccination_status?.name || ''} bgColor="info" />
                  </div>
                </div>
                <div className={styles.vaccineDetails}>
                  <div className={styles.vaccineDates}>
                    <div>
                      Given:{' '}
                      {vax.vaccination_date
                        ? new Date(vax.vaccination_date).toLocaleDateString()
                        : '-'}
                    </div>
                    <div>
                      Due:{' '}
                      {vax.expiration_date
                        ? new Date(vax.expiration_date).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                  <div className={styles.vaccineActions}>
                    <button className={styles.actionButton} onClick={() => {}}>
                      <Image src="/images/actions/view.svg" alt="View" width={18} height={18} />
                    </button>
                    <button className={styles.actionButton} onClick={() => {}}>
                      <Image src="/images/actions/edit.svg" alt="Edit" width={18} height={18} />
                    </button>
                    <button className={styles.actionButton} onClick={() => {}}>
                      <Image
                        src="/images/actions/download.svg"
                        alt="Download"
                        width={18}
                        height={18}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewVaccinationsModal;
