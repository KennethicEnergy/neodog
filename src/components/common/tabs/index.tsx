import { TAppointmentItem, TAppointmentTabData, TTabData } from '@/types/pet-management';
import { useMemo, useState } from 'react';
import styles from './styles.module.scss';

const Tabs = ({ type, data }: { type: string; data: TTabData }) => {
  const [activeFilter, setActiveFilter] = useState(type === 'appointments' ? 'all' : 'upcoming');

  const filteredAppointments = useMemo(() => {
    if (activeFilter === 'all') {
      return (data as TAppointmentTabData)?.appointments || [];
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return (
      (data as TAppointmentTabData)?.appointments?.filter((appointment: TAppointmentItem) => {
        if (activeFilter === 'today') {
          return appointment.date === todayStr;
        } else if (activeFilter === 'tomorrow') {
          return appointment.date === tomorrowStr;
        }
        return true;
      }) || []
    );
  }, [activeFilter, data]);

  const getFilterCounts = useMemo(() => {
    const appointments = (data as TAppointmentTabData)?.appointments || [];
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    return {
      all: appointments.length,
      today: appointments.filter((apt) => apt.date === today).length,
      tomorrow: appointments.filter((apt) => apt.date === tomorrowStr).length
    };
  }, [data]);

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <div className={styles.tabs}>
      <h3>{data?.title}</h3>
      <div className={styles.tabFilters}>
        {data?.filters.map((filter) => (
          <div
            key={filter.id}
            className={`${styles.filter} ${activeFilter === filter.id ? styles.active : ''}`}
            onClick={() => handleFilterClick(filter.id)}>
            {filter.label} ({getFilterCounts[filter.id as keyof typeof getFilterCounts] || 0})
          </div>
        ))}
      </div>
      <div className={styles.tabContent}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className={styles.content}>
              <div className={styles.info}>
                <div className={styles.owner}>{appointment.owner}</div>
                <div className={styles.pet}>
                  {appointment.pet} - {appointment.appointmentType}
                </div>
              </div>
              <div className={styles.date}>{appointment.dateLabel}</div>
            </div>
          ))
        ) : (
          <div className={styles.noAppointments}>
            No {type === 'appointment' ? 'appointments' : 'vaccination'} found for{' '}
            {activeFilter === 'all' ? 'this filter' : activeFilter}.
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
