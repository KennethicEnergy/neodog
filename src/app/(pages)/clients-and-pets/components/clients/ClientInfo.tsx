import Icon from '@/components/common/icon';
import StatusTag from '@/components/common/status-tag';
import React from 'react';
import styles from './ClientDetailView.module.scss';
import { Client } from './types';

interface ClientInfoProps {
  client: Client;
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

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  return (
    <div className={styles.info}>
      <h2 className={styles.name}>
        {client.first_name} {client.middle_name ? client.middle_name + ' ' : ''}
        {client.last_name}
        <div>
          <StatusTag
            status={client.status?.toUpperCase() || 'INACTIVE'}
            bgColor={getStatusClass(client?.status)}
          />
        </div>
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
          <Icon src="/images/contact/location.svg" height={16} width={16} />
          <p>
            {client.address}
            {client.city ? `, ${client.city}` : ''}
            {client.state ? `, ${client.state}` : ''}
          </p>
        </div>
      </div>
      <div className={styles.actions}>
        <button>Mail</button>
        <button>Call</button>
      </div>
    </div>
  );
};

export default ClientInfo;
