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
import { useToastStore } from '@/store/toast.store';
import type { LoginCredentials, RegisterCredentials } from '@/types/api';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './page.module.scss';

const SignupPage = () => {
  const router = useRouter();
  const { register, isLoading, isAuthenticated } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

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
        addToast({
          scheme: 'success',
          title: 'Success',
          message: 'Successfully signed up',
          timeout: 2000
        });
        router.push('/');
      } else if (response && response.message) {
        addToast({
          scheme: 'danger',
          title: 'Signup Error',
          message: response.message,
          timeout: 4000
        });
      }
    }
  };

  return (
    <div className={styles.authPage}>
      <Card className={styles.authCard}>
        <div className={styles.brandWrapper}>
          <Image src="/images/brand.svg" alt="logo" width={24} height={24} />
          <h2 className={styles.brand}>NeoDog</h2>
        </div>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="signup" onSubmit={handleSubmit} isLoading={isLoading} />
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
