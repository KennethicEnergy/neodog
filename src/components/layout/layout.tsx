'use client';
import { useAuthStore } from '@/store/auth.store';
import { useModalStore } from '@/store/modal-store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '../common/loader';
import Footer from './footer';
import Header from './header';
import styles from './layout.module.scss';
import Sidebar from './sidebar';

export default function DefaultLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isModalOpen = useModalStore((state) => state.modals.length > 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, getUser } = useAuthStore();

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await getUser();
      setLoading(false);
      return user;
    } catch (error) {
      setError('Failed to authenticate. Please try again.');
      console.error('Authentication error:', error);
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'auth-storage') {
        setLoading(false);
        router.push('/login');
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const persisted = localStorage.getItem('auth-storage');
        const hasUser = persisted && JSON.parse(persisted).user;

        if (isAuthPage || !token || !hasUser) {
          setLoading(false);
          return;
        }

        const res = await checkAuth();
        console.log('@@ checkAuth, getUser', res);
      } catch (e) {
        console.error('Error in checkAuth:', e);
        setLoading(false);
        router.push('/login');
      }
    };

    initAuth();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUser, pathname, router]);

  useEffect(() => {
    if (
      !loading &&
      !isAuthenticated &&
      !error &&
      !pathname.startsWith('/login') &&
      !pathname.startsWith('/signup')
    ) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, error, pathname, router]);

  useEffect(() => {
    const handleAuthenticated = async () => {
      if (isAuthenticated) {
        const res = await checkAuth();
        setLoading(false);
      }
    };

    handleAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Don't render layout for auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <Loader />
          <p>Loading...</p>
        </div>
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
    <div className={styles.page} style={{ pointerEvents: isModalOpen ? 'none' : 'auto' }}>
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
