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
import type { LoginCredentials, RegisterCredentials } from '@/types/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.scss';

const SignupPage = () => {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: RegisterCredentials | LoginCredentials) => {
    if ('facility_name' in data) {
      const formattedData = {
        ...data,
        operating_hours_from:
          data.operating_hours_from?.length === 5
            ? `${data.operating_hours_from}:00`
            : data.operating_hours_from,
        operating_hours_to:
          data.operating_hours_to?.length === 5
            ? `${data.operating_hours_to}:00`
            : data.operating_hours_to
      };
      const response = await register(formattedData);
      if (response && response.success) {
        router.push('/');
      }
    }
  };

  return (
    <div className={styles.authPage}>
      <Card className={styles.authCard}>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="signup" onSubmit={handleSubmit} isLoading={isLoading} />
          {error && <p className={styles.formMessage}>{error}</p>}
          <p className={styles.formDescription}>
            Already have an account?{' '}
            <Link href="/login" className={styles.authLink}>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
