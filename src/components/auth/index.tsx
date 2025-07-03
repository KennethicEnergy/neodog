import { Button } from '@/components/common/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/common/form';
import { Input } from '@/components/common/input';
import type { LoginCredentials, RegisterCredentials } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
// import FacilityOperatingDays, { type FacilityOperatingDaysValue } from './FacilityOperatingDays';
import Loader from '../common/loader';
import OperatingDaysSelector, {
  type SimpleOperatingDaysValue
} from '../common/operating-days-selector';
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
    operating_hours_from: z.string().optional(),
    operating_hours_to: z.string().optional(),
    operating_days: z.string().min(1, 'Operating days are required'),
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().optional(),
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

export const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, isLoading }) => {
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
            operating_days: '',
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

  const [showFacilityFields, setShowFacilityFields] = React.useState(false);
  // Comment out FacilityOperatingDays state and use FacilityOperatingDaysSimple state
  // const [facilityDays, setFacilityDays] = useState<FacilityOperatingDaysValue>({ ... });
  const [facilityDaysSimple, setFacilityDaysSimple] = useState<SimpleOperatingDaysValue>({
    selectedDays: {
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false
    },
    time: { from: '', to: '' }
  });
  const [operatingDaysError, setOperatingDaysError] = React.useState<string>('');

  // Watch the initial required fields and their errors
  const initialFields = form.watch([
    'first_name',
    'middle_name',
    'last_name',
    'mobile_number',
    'address',
    'email',
    'password',
    'password_confirmation'
  ]);
  const formErrors = form.formState.errors;

  // Check if all initial fields are filled and valid
  useEffect(() => {
    const allFieldsFilled = initialFields.every((field) => field && field.trim() !== '');
    const hasNoErrors = !Object.keys(formErrors).some((key) =>
      [
        'first_name',
        'middle_name',
        'last_name',
        'mobile_number',
        'address',
        'email',
        'password',
        'password_confirmation'
      ].includes(key)
    );
    setTimeout(() => {
      setShowFacilityFields(allFieldsFilled && hasNoErrors);
    }, 1000);
  }, [initialFields, formErrors]);

  // Sync operating days with form state
  useEffect(() => {
    if (type === 'signup' && showFacilityFields) {
      form.setValue('operating_days', JSON.stringify(facilityDaysSimple.selectedDays));
    }
  }, [facilityDaysSimple.selectedDays, type, showFacilityFields, form]);

  const handleSubmit = async (data: LoginFormData | SignupFormData) => {
    if (type === 'login') {
      await onSubmit(data as LoginCredentials);
    } else {
      const { time } = facilityDaysSimple;

      // Clear previous errors
      setOperatingDaysError('');

      // Validate that at least one day is selected
      const hasSelectedDays = Object.values(facilityDaysSimple.selectedDays).some((day) => day);
      if (!hasSelectedDays) {
        setOperatingDaysError('Please select at least one operating day');
        return;
      }

      // Validate that time values are provided
      if (!time.from || !time.to) {
        setOperatingDaysError('Please provide operating hours');
        return;
      }

      await onSubmit({
        ...(data as RegisterCredentials),
        operating_hours_from: time.from,
        operating_hours_to: time.to,
        operating_days: JSON.stringify(facilityDaysSimple.selectedDays)
      } as RegisterCredentials);
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
              <div
                className={`${styles.form} ${styles.facilityFields} ${styles.facilityFieldsVisible}`}>
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
              </div>
            )}

            {type === 'signup' && showFacilityFields && (
              <>
                <OperatingDaysSelector
                  value={facilityDaysSimple}
                  onChange={setFacilityDaysSimple}
                  isLoading={isLoading}
                  startLabel="Open From"
                  endLabel="Open Until"
                />
                {operatingDaysError && (
                  <p className={styles.formFieldError}>{operatingDaysError}</p>
                )}
              </>
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

        {/* {fieldErrors &&
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
        )} */}

        <Button
          type="submit"
          className={styles.fullWidth}
          disabled={isLoading}
          aria-label={type === 'login' ? 'Sign In' : 'Sign Up'}>
          {isLoading ? <Loader /> : type === 'login' ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};
