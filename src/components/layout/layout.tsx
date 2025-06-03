'use client';
import { useEffect, useState } from 'react';
import Footer from './footer';
import Header from './header';
import styles from './layout.module.scss';
import Sidebar from './sidebar';

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <main className={styles.main}>{children}</main>
        <div className={styles.footerRow}>
          <Footer />
        </div>
      </div>
    </div>
  );
}
