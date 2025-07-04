import { Client } from '@/services/client.api';
import { useClientStore } from '@/store/client.store';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import Loader from '../../common/loader';
import styles from './styles.module.scss';

const AddClient = ({ client }: { client?: Client }) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const addToast = useToastStore((state) => state.addToast);
  const [form, setForm] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    mobile_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipcode: ''
  });
  const { createClient, updateClient, isLoading, fetchClients } = useClientStore();
  const [mobileError, setMobileError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const isEditing = !!client;

  // Load clients data when modal opens and pre-populate form if editing
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        await fetchClients(1, 10);

        // Pre-populate form if editing an existing client
        if (client) {
          setForm({
            first_name: client.first_name || '',
            middle_name: client.middle_name || '',
            last_name: client.last_name || '',
            mobile_number: client.mobile_number || '',
            email: client.email || '',
            address: client.address || '',
            city: client.city || '',
            state: client.state || '',
            zipcode: client.zip || ''
          });
        }
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, [fetchClients, client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'mobile_number') {
      // Only allow digits
      if (!/^\d*$/.test(value)) {
        setMobileError('Mobile number must be numeric');
      } else {
        setMobileError('');
      }
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d+$/.test(form.mobile_number)) {
      setMobileError('Mobile number must be numeric');
      return;
    }
    setMobileError('');

    let result;
    if (isEditing && client) {
      result = await updateClient(client.id, form);
    } else {
      result = await createClient(form);
    }

    if (result.success) {
      const clientName = `${form.first_name} ${form.middle_name ? form.middle_name + ' ' : ''}${form.last_name}`;
      addToast({
        scheme: 'success',
        title: isEditing ? 'Client Updated' : 'Client Created',
        message: `${clientName} was ${isEditing ? 'updated' : 'created'} successfully.`,
        timeout: 2000
      });
      setForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        mobile_number: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipcode: ''
      });
      closeModal();
    } else {
      addToast({
        scheme: 'danger',
        title: isEditing ? 'Update Failed' : 'Creation Failed',
        message: result.message || `Failed to ${isEditing ? 'update' : 'create'} client.`,
        timeout: 4000
      });
    }
  };

  if (initialLoading) {
    return (
      <div className={styles.modalContainer}>
        <div className={styles.loadingWrapper}>
          <Loader />
          <p>Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalContainer}>
      <h3 className={styles.header}>{isEditing ? 'Edit Client' : 'Add Client'}</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Client Information</p>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="first_name">
                First Name
              </label>
              <input
                id="first_name"
                className={styles.input}
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="middle_name">
                Middle Name
              </label>
              <input
                id="middle_name"
                className={styles.input}
                type="text"
                name="middle_name"
                value={form.middle_name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="last_name">
                Last Name
              </label>
              <input
                id="last_name"
                className={styles.input}
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="mobile_number">
                Phone Number
              </label>
              <input
                id="mobile_number"
                className={styles.input}
                type="tel"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                pattern="\d*"
                inputMode="numeric"
                disabled={isLoading}
                required
                aria-invalid={!!mobileError}
              />
              {mobileError && <div style={{ color: 'red', fontSize: 12 }}>{mobileError}</div>}
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className={styles.sectionTitle}>Address Details</div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="address">
                Address
              </label>
              <input
                id="address"
                className={styles.input}
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="city">
                City
              </label>
              <input
                id="city"
                className={styles.input}
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="state">
                State
              </label>
              <input
                id="state"
                className={styles.input}
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="zipcode">
                Zip Code
              </label>
              <input
                id="zipcode"
                className={styles.input}
                type="text"
                name="zipcode"
                value={form.zipcode}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit" disabled={isLoading || initialLoading}>
              {isLoading ? (
                <>
                  <Loader />
                  <span>{isEditing ? 'Updating Client...' : 'Adding Client...'}</span>
                </>
              ) : isEditing ? (
                'Update Client'
              ) : (
                'Add Client'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
