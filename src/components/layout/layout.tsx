'use client';
import { useAuthStore } from '@/store/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from './footer';
import Header from './header';
import styles from './layout.module.scss';
import Sidebar from './sidebar';

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, getUser } = useAuthStore();

  useEffect(() => {
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const token = localStorage.getItem('auth_token');
    const persisted = localStorage.getItem('auth-storage');
    const hasUser = persisted && JSON.parse(persisted).user;

    if (isAuthPage || !token || !hasUser) return;

    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getUser();

        if (token && response) {
          setLoading(false);
        } else {
          setError('Invalid user data');
          localStorage.removeItem('auth_token');
          setLoading(false);
        }
      } catch (error) {
        setError('Failed to authenticate. Please try again.');
        console.error('Authentication error:', error);
        localStorage.removeItem('auth_token');
        setLoading(false);
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser, pathname]);

  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated &&
      !error &&
      !pathname.startsWith('/login') &&
      !pathname.startsWith('/signup') &&
      !pathname.startsWith('/register')
    ) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, error, pathname, router]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Don't render layout for auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

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
