import StatusTag from '@/components/common/status-tag';
import { vaccinationApi } from '@/services/vaccination.api';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Loader from '../add-vaccine/../../common/loader';
import styles from './view-vaccinations.module.scss';

interface ViewVaccinationsModalProps {
  petId: string | number;
  onClose: () => void;
}

// Extended type to include vaccination_files
interface VaccinationWithFiles {
  id: number;
  client_id: number;
  pet_id: number;
  vaccination_name_id: number;
  vaccination_status_id: number;
  expiration_date: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  vaccination_name?: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  vaccination_status?: {
    id: number;
    code: string;
    name: string;
    description: string;
  };
  vaccination_files?: Array<{
    id: number;
    vaccination_id: number;
    path: string;
    original_name: string;
    name: string;
    full_path: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }>;
}

const ViewVaccinationsModal: React.FC<ViewVaccinationsModalProps> = ({ petId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [vaccinations, setVaccinations] = useState<VaccinationWithFiles[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      vaccinationApi.viewRecordsByPetId(petId),
      vaccinationApi.getVaccinationNameReferences(),
      vaccinationApi.getVaccinationStatusReferences()
    ])
      .then(([res]) => {
        const all: VaccinationWithFiles[] = res.data?.result?.vaccinations || [];
        setVaccinations(Array.isArray(all) ? all : []);
      })
      .finally(() => setLoading(false));
  }, [petId]);

  const handleDownload = async (file: { full_path: string; original_name: string }) => {
    try {
      const downloadUrl = `https://api.neodog.app/api/storage/${file.full_path}`;

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.original_name;
      link.target = '_blank';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className={styles.modalContainer}>
      <h3 className={styles.header}>Vaccination Record</h3>
      <div className={styles.section}>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <Loader />
            <p>Loading vaccinations...</p>
          </div>
        ) : vaccinations.length === 0 ? (
          <div className={styles.noRecords}>No vaccination records found for this pet.</div>
        ) : (
          vaccinations.map((vax: VaccinationWithFiles) => (
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
                    Due:{' '}
                    {vax.expiration_date ? new Date(vax.expiration_date).toLocaleDateString() : '-'}
                  </div>
                </div>
                <div className={styles.vaccineActions}>
                  <button className={styles.actionButton} onClick={() => {}}>
                    <Image src="/images/actions/view.svg" alt="View" width={18} height={18} />
                  </button>
                  <button className={styles.actionButton} onClick={() => {}}>
                    <Image src="/images/actions/edit.svg" alt="Edit" width={18} height={18} />
                  </button>
                  {vax.vaccination_files && vax.vaccination_files.length > 0 ? (
                    vax.vaccination_files.map((file) => (
                      <button
                        key={file.id}
                        className={styles.actionButton}
                        onClick={() => handleDownload(file)}
                        title={`Download ${file.original_name}`}>
                        <Image
                          src="/images/actions/download.svg"
                          alt="Download"
                          width={18}
                          height={18}
                        />
                      </button>
                    ))
                  ) : (
                    <button className={styles.actionButton} disabled>
                      <Image
                        src="/images/actions/download.svg"
                        alt="No files to download"
                        width={18}
                        height={18}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
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
