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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.scss';

const LoginPage = () => {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleSubmit = async (data: { email: string; password: string }) => {
    const response = await login(data);
    if (response && response.success) {
      addToast({
        scheme: 'success',
        title: 'Success',
        message: 'Successfully logged in',
        timeout: 2000
      });
      router.push('/');
    } else if (response && response.message) {
      addToast({
        scheme: 'danger',
        title: 'Login Error',
        message: response.message,
        timeout: 4000
      });
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
