import { Button } from '@/components/common/Button/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/Form/Form';
import { Input } from '@/components/common/Input/Input';
import type { LoginCredentials, RegisterCredentials } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import styles from './styles.module.scss';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: LoginCredentials | RegisterCredentials) => Promise<void>;
  isLoading: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address').trim().toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long')
});

const signupSchema = z
  .object({
    facility_name: z.string().min(1, 'Facility name is required'),
    facility_address: z.string().min(1, 'Facility address is required'),
    operating_hours_from: z.string().min(1, 'Operating hours from is required'),
    operating_hours_to: z.string().min(1, 'Operating hours to is required'),
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().min(1, 'Middle name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    mobile_number: z.string().min(1, 'Mobile number is required'),
    address: z.string().min(1, 'Address is required'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password is too long'),
    password_confirmation: z.string().min(1, 'Password confirmation is required')
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ['password_confirmation']
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  error,
  fieldErrors
}) => {
  const schema = type === 'login' ? loginSchema : signupSchema;
  const form = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      type === 'login'
        ? { email: '', password: '' }
        : {
            facility_name: '',
            facility_address: '',
            operating_hours_from: '',
            operating_hours_to: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            mobile_number: '',
            address: '',
            email: '',
            password: '',
            password_confirmation: ''
          },
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
    shouldFocusError: true,
    delayError: 1000
  });

  const [hasSubmitted, setHasSubmitted] = React.useState(false);
  const [showFacilityFields, setShowFacilityFields] = React.useState(false);

  // Watch the initial required fields and their errors
  const initialFields = form.watch(['first_name', 'middle_name', 'last_name', 'mobile_number', 'address', 'email', 'password', 'password_confirmation']);
  const formErrors = form.formState.errors;

  // Check if all initial fields are filled and valid
  useEffect(() => {
    const allFieldsFilled = initialFields.every(field => field && field.trim() !== '');
    const hasNoErrors = !Object.keys(formErrors).some(key => 
      ['first_name', 'middle_name', 'last_name', 'mobile_number', 'address', 'email', 'password', 'password_confirmation'].includes(key)
    );
    setTimeout(() => {
      setShowFacilityFields(allFieldsFilled && hasNoErrors);
    }, 1000);
  }, [initialFields, formErrors]);

  const handleSubmit = async (data: LoginFormData | SignupFormData) => {
    setHasSubmitted(true);
    if (type === 'login') {
      await onSubmit(data as LoginCredentials);
    } else {
      await onSubmit(data as RegisterCredentials);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        {type === 'signup' && (
          <>
            <div className={styles.nameInputs}>
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="First Name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middle_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Middle Name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Mobile Number" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Address" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showFacilityFields && (
              <div className={`${styles.form} ${styles.facilityFields} ${styles.facilityFieldsVisible}`}>
                <p className={styles.description}>Now Lets name your facility ✨</p>
                <FormField
                  control={form.control}
                  name="facility_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Facility Name" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facility_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Facility Address" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className={styles.timeInputs}>
                  <FormField
                    control={form.control}
                    name="operating_hours_from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open From</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operating_hours_to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Until</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {type === 'login' && (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {fieldErrors &&
          Object.entries(fieldErrors).map(([field, messages]) =>
            messages.map((msg, idx) => (
              <p key={field + idx} className={styles.formFieldError}>
                {msg}
              </p>
            ))
          )}

        {error && hasSubmitted && (
          <div className={styles.formMessage} role="alert">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className={styles.fullWidth}
          disabled={isLoading}
          aria-label={type === 'login' ? 'Sign In' : 'Sign Up'}>
          {isLoading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};
