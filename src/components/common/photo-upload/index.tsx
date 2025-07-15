import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { FileInput } from '../file-input';
import styles from './styles.module.scss';

interface PhotoUploadProps {
  id?: string;
  value?: File | null;
  onChange?: (file: File | null) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  accept?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Upload Photo',
  error = false,
  helperText,
  disabled = false,
  size = 'md',
  accept = 'image/*'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview URL when file changes
  React.useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const handleFileSelect = (files: FileList | null) => {
    const file = files?.[0] || null;
    onChange?.(file);
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles.sm;
      case 'lg':
        return styles.lg;
      default:
        return styles.md;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 20;
      case 'lg':
        return 32;
      default:
        return 24;
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.uploadCircle} ${getSizeClass()} ${error ? styles.error : ''} ${
          disabled ? styles.disabled : ''
        }`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={placeholder}>
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Pet photo preview"
            className={styles.previewImage}
            fill
            sizes="(max-width: 768px) 100vw, 120px"
          />
        ) : (
          <div className={styles.placeholder}>
            <Image
              src="/images/placeholders/upload-photo.svg"
              alt="Upload photo placeholder"
              className={styles.placeholderIcon}
              width={getIconSize()}
              height={getIconSize()}
            />
            <span className={styles.placeholderText}>{placeholder}</span>
          </div>
        )}

        {!disabled && (
          <div className={styles.overlay}>
            <span className={styles.overlayText}>
              {previewUrl ? 'Change Photo' : 'Upload Photo'}
            </span>
          </div>
        )}
      </div>

      {/* Hidden FileInput component that handles the actual file selection */}
      <div className={styles.hiddenFileInput}>
        <FileInput
          ref={fileInputRef}
          id={id}
          accept={accept}
          onFileSelect={handleFileSelect}
          disabled={disabled}
          multiple={false}
          size={size}
          error={error}
          helperText={helperText}
        />
      </div>
    </div>
  );
};

export default PhotoUpload;
