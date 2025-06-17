import BaseModal from '@/components/common/base-modal';
import Icon from '@/components/common/icon';
import StatusTag from '@/components/common/status-tag';
import AddPet from '@/components/modals/add-pet';
import { useModalStore } from '@/store/modal-store';
import React, { useState } from 'react';
import styles from './ClientDetailView.module.scss';

interface Client {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  mobile_number: string;
  address: string;
  email: string;
  city?: string;
  state?: string;
  zip?: string;
  created_at?: string;
  updated_at?: string;
  pets_count?: number;
  last_visit?: string;
  status?: string;
}

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  owner: string;
  lastVisit: string;
  status: string;
  image: string | null;
}

interface ClientDetailViewProps {
  client: Client;
  pets: Pet[];
  onBack: () => void;
}

const getStatusClass = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'info';
    default:
      return 'info';
  }
};

const TABS = [
  'Activity',
  'Appointments',
  'Vaccination Records',
  'Tasks Log',
  'Documents',
  'Financial',
  'Notes'
];

// Mock recent activity for demo purposes
const recentActivity = [
  {
    title: 'Annual Check-up',
    description: 'For Bella',
    date: 'April 18, 2025',
    time: '11:00 AM'
  },
  {
    title: 'Vaccination Updated',
    description: 'Rabies Vaccine For Bella',
    date: 'April 18, 2025',
    time: '10:00 AM'
  },
  {
    title: 'Invoice Paid',
    description: '$120.00 For Annual Check-Up',
    date: 'April 18, 2025',
    time: '9:00 AM'
  },
  {
    title: 'New Pet Added',
    description: 'Molly Was Added To The Pet List',
    date: 'April 18, 2025',
    time: '9:00 AM'
  }
];

const ClientDetailView: React.FC<ClientDetailViewProps> = ({ client, pets, onBack }) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [selectedTab, setSelectedTab] = useState<string>('Activity');

  const addPet = ({ clientId }: { clientId: string }) => {
    openModal(
      <BaseModal onClose={closeModal}>
        <AddPet clientId={clientId} />
      </BaseModal>
    );
  };

  return (
    <div className={styles.clientDetail}>
      <button className={styles.back} onClick={onBack}>
        ← Back to List
      </button>
      <div className={styles.header}>
        <div className={styles.avatar} />
        <div className={styles.info}>
          <h2 className={styles.name}>
            {client.first_name} {client.middle_name ? client.middle_name + ' ' : ''}
            {client.last_name}
            <StatusTag
              status={client.status?.toUpperCase() || 'INACTIVE'}
              bgColor={getStatusClass(client?.status)}
            />
          </h2>
          <div className={styles.since}>
            Client Since{' '}
            {client.created_at
              ? new Date(client.created_at).toLocaleString('default', {
                  month: 'long',
                  year: 'numeric'
                })
              : 'N/A'}
          </div>
          <div className={styles.contact}>
            <div className={styles.contactItem}>
              <Icon src="/images/contact/mail.svg" height={16} width={16} /> {client.email}
            </div>
            <div className={styles.contactItem}>
              <Icon src="/images/contact/phone.svg" height={16} width={16} /> {client.mobile_number}
            </div>
            <div className={styles.contactItem}>
              <Icon src="/images/contact/location.svg" height={16} width={16} /><p>{client.address}
              {client.city ? `, ${client.city}` : ''}
              {client.state ? `, ${client.state}` : ''}</p>
            </div>
          </div>
          <div className={styles.actions}>
            <button>Mail</button>
            <button>Call</button>
          </div>
        </div>
        <div className={styles.pets}>
          {pets?.map((pet) => (
            <div key={pet.id} className={styles.pet}>
              <div className={styles.petAvatar} />
              <div className={styles.petName}>{pet.name}</div>
              <div className={styles.petBreed}>{pet.breed}</div>
            </div>
          ))}
        </div>
        <div
          className={styles.addContainer}
          onClick={() => addPet({ clientId: client.id.toString() })}>
          <Icon
            src="/images/icon-plus.svg"
            height={40}
            width={40}
            bgColor="#7F7F7F"
            shape="circle"
          />
          <span>Add Pet</span>
        </div>
      </div>

      <div className={styles.tabs} role="tablist">
        {TABS.map((tab) => (
          <div
            key={tab}
            className={selectedTab === tab ? styles.tabActive : ''}
            onClick={() => setSelectedTab(tab)}
            role="tab"
            aria-selected={selectedTab === tab}
            tabIndex={selectedTab === tab ? 0 : -1}>
            {tab}
          </div>
        ))}
      </div>

      {selectedTab === 'Activity' && (
        <div className={styles.activity}>
          <h4>Recent Activity</h4>
          <div>
            {recentActivity.map((activity, idx) => (
              <div key={idx} className={styles.activityRow}>
                <div className={styles.activityAvatar} />
                <div className={styles.activityInfo}>
                  <div className={styles.activityTitle}>{activity.title}</div>
                  <div className={styles.activityDesc}>{activity.description}</div>
                </div>
                <div className={styles.activityDate}>
                  <div>{activity.date}</div>
                  <div className={styles.activityTime}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedTab !== 'Activity' && (
        <div className={styles.activity}>
          <h4>{selectedTab}</h4>
          <div style={{ color: '#888', padding: '2rem 0', textAlign: 'center' }}>
            {selectedTab} content coming soon.
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailView;
