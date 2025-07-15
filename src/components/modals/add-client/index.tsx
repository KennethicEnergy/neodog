import { Button } from '@/components/common/button';
import { Client } from '@/services/client.api';
import { useClientStore } from '@/store/client.store';
import { useModalStore } from '@/store/modal-store';
import { useToastStore } from '@/store/toast.store';
import React, { useEffect, useState } from 'react';
import { Input } from '../../common/input';
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
            zipcode: client.zipcode || ''
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

  const handleChange = (field: string, value: string) => {
    if (field === 'mobile_number') {
      // Allow digits, plus signs, parentheses, and spaces
      if (!/^[\d\s\(\)\+]*$/.test(value)) {
        setMobileError(
          'Mobile number can only contain digits, spaces, parentheses, and plus signs'
        );
      } else {
        setMobileError('');
      }
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[\d\s\(\)\+]+$/.test(form.mobile_number)) {
      setMobileError('Mobile number can only contain digits, spaces, parentheses, and plus signs');
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
              <Input
                id="first_name"
                type="text"
                name="first_name"
                value={form.first_name}
                onValueChange={(value) => handleChange('first_name', value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="middle_name">
                Middle Name
              </label>
              <Input
                id="middle_name"
                type="text"
                name="middle_name"
                value={form.middle_name}
                onValueChange={(value) => handleChange('middle_name', value)}
                disabled={isLoading}
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="last_name">
                Last Name
              </label>
              <Input
                id="last_name"
                type="text"
                name="last_name"
                value={form.last_name}
                onValueChange={(value) => handleChange('last_name', value)}
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
              <Input
                id="mobile_number"
                type="tel"
                name="mobile_number"
                value={form.mobile_number}
                onValueChange={(value) => handleChange('mobile_number', value)}
                pattern="\d*"
                inputMode="numeric"
                disabled={isLoading}
                required
                error={!!mobileError}
                helperText={mobileError}
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onValueChange={(value) => handleChange('email', value)}
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
              <Input
                id="address"
                name="address"
                value={form.address}
                onValueChange={(value) => handleChange('address', value)}
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
              <Input
                id="city"
                type="text"
                name="city"
                value={form.city}
                onValueChange={(value) => handleChange('city', value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="state">
                State
              </label>
              <Input
                id="state"
                type="text"
                name="state"
                value={form.state}
                onValueChange={(value) => handleChange('state', value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className={styles.col}>
              <label className={styles.label} htmlFor="zipcode">
                Zip Code
              </label>
              <Input
                id="zipcode"
                type="text"
                name="zipcode"
                value={form.zipcode}
                onValueChange={(value) => handleChange('zipcode', value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              variant="default"
              isLoading={isLoading || initialLoading}
              disabled={isLoading || initialLoading}>
              {isLoading || initialLoading
                ? isEditing
                  ? 'Updating Client...'
                  : 'Adding Client...'
                : isEditing
                  ? 'Update Client'
                  : 'Add Client'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
