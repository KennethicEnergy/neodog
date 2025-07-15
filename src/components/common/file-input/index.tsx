import Image from 'next/image';
import * as React from 'react';
import styles from './styles.module.scss';

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  error?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileSelect?: (files: FileList | null) => void;
  size?: 'sm' | 'md' | 'lg';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  showFileList?: boolean;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      error,
      helperText,
      leftIcon,
      rightIcon,
      disabled,
      onChange,
      onFileSelect,
      size = 'md',
      accept,
      multiple = false,
      maxSize,
      showFileList = false,
      ...props
    },
    ref
  ) => {
    const fileInputId = React.useId();
    const helperTextId = `${fileInputId}-helper-text`;
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [dragActive, setDragActive] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      onChange?.(e);
      onFileSelect?.(files);

      if (files) {
        const fileArray = Array.from(files);
        setSelectedFiles(fileArray);
      }
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragIn = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setDragActive(true);
      }
    };

    const handleDragOut = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = e.dataTransfer.files;
        const fileArray = Array.from(files);
        setSelectedFiles(fileArray);

        // Create a synthetic event
        const syntheticEvent = {
          target: { files }
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
        onFileSelect?.(files);
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const removeFile = (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
    };

    return (
      <div className={styles.fileInputContainer}>
        <div
          className={`
            ${styles.fileInputWrapper}
            ${dragActive ? styles.dragActive : ''}
            ${error ? styles.error : ''}
          `}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}>
          {leftIcon && (
            <div className={styles.leftIcon} aria-hidden="true">
              {leftIcon}
            </div>
          )}
          <input
            type="file"
            id={fileInputId}
            className={`
              ${styles.fileInput}
              ${styles[size]}
              ${leftIcon ? styles.hasLeftIcon : ''}
              ${rightIcon ? styles.hasRightIcon : ''}
              ${className || ''}
            `}
            ref={ref}
            disabled={disabled}
            aria-invalid={error}
            aria-describedby={helperText ? helperTextId : undefined}
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
            {...props}
          />
          <div className={styles.fileInputContent}>
            <Image
              src="/images/actions/upload.svg"
              alt="Upload"
              width={48}
              height={48}
              className={styles.uploadIcon}
            />
            <div className={styles.fileInputText}>
              <span className={styles.fileInputLabel}>
                {dragActive ? 'Drop files here' : 'Choose files or drag and drop'}
              </span>
              <span className={styles.fileInputSubtext}>
                {accept ? `Accepted formats: ${accept}` : 'All file types accepted'}
                {maxSize && ` (Max size: ${formatFileSize(maxSize)})`}
              </span>
            </div>
          </div>
          {rightIcon && (
            <div className={styles.rightIcon} aria-hidden="true">
              {rightIcon}
            </div>
          )}
        </div>

        {showFileList && selectedFiles.length > 0 && (
          <div className={styles.fileList}>
            {selectedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                <button
                  type="button"
                  className={styles.removeFile}
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {helperText && (
          <p
            id={helperTextId}
            className={`${styles.helperText} ${error ? styles.error : ''}`}
            role={error ? 'alert' : undefined}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
FileInput.displayName = 'FileInput';

export { FileInput };
