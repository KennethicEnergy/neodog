import { useClientStore } from '@/store/client.store';
import React, { useState } from 'react';
import styles from './styles.module.scss';

const AddClient = () => {
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
  const { createClient, isLoading } = useClientStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createClient(form);
    if (result.success) {
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
    }
  };

  return (
    <div className={styles.modalContainer}>
      <h2 className={styles.header}>Add Client</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Client Information</div>
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
                required
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
                type="text"
                name="mobile_number"
                value={form.mobile_number}
                onChange={handleChange}
                required
              />
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
                required
              />
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Client'}
            </button>
          </div>
        </div>
        {/* {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>} */}
      </form>
    </div>
  );
};

export default AddClient;
