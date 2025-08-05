import { Slot } from '@radix-ui/react-slot';
import Image from 'next/image';
import * as React from 'react';
import styles from './styles.module.scss';

export type ButtonVariant =
  | 'default'
  | 'danger'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'dark'
  | 'white';
export type ButtonSize = 'default' | 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;

    return (
      <Comp
        className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}>
        {isLoading ? (
          <span className={styles.loading} aria-hidden="true">
            <Image
              src="/images/loader/ellipsis-loader.gif"
              alt="Loading..."
              width={20}
              height={20}
              className={styles.loader}
            />
          </span>
        ) : null}
        <span className={isLoading ? styles.hidden : ''}>{children}</span>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button };
