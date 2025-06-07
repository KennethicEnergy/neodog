'use client';
import { AuthForm } from '@/components/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/common/card/Card';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.scss';

const LoginPage = () => {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    const response = await login(data);
    if (response && response.success) {
      router.push('/');
    }
  };

  return (
    <div className={styles.authPage}>
      <Card className={styles.authCard}>
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="login" onSubmit={handleSubmit} isLoading={isLoading} />
          {error && <p className={styles.formMessage}>{error}</p>}
          <p className={styles.formDescription}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className={styles.authLink}>
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
