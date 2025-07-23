import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../button';
import { DateRangePicker, type DateRange } from '../date-range-picker';
import { FileInput } from '../file-input';
import { SearchInput } from '../search-input';
import { Textarea } from '../textarea';
import styles from './example.module.scss';
import {
  Checkbox,
  DatePicker,
  Input,
  RadioButton,
  Select,
  TimeInput,
  Toggle,
  type SelectOption
} from './index';

const FormComponentsExample = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedRadio, setSelectedRadio] = useState<string>('');
  const [isToggled, setIsToggled] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [textValue, setTextValue] = useState<string>('');
  const [emailValue, setEmailValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [timeValue, setTimeValue] = useState<string>('');
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [smallDateRange, setSmallDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [mediumDateRange, setMediumDateRange] = useState<DateRange>({ startDate: '', endDate: '' });
  const [largeDateRange, setLargeDateRange] = useState<DateRange>({ startDate: '', endDate: '' });

  const petBreeds: SelectOption[] = [
    { value: 'labrador', label: 'Labrador Retriever' },
    { value: 'german-shepherd', label: 'German Shepherd' },
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'bulldog', label: 'Bulldog' },
    { value: 'poodle', label: 'Poodle' }
  ];

  const searchSuggestions = [
    'Labrador Retriever',
    'German Shepherd',
    'Golden Retriever',
    'Bulldog',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Yorkshire Terrier'
  ];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.brandWrapper} onClick={() => router.push('/')}>
          <Image src="/images/brand.svg" alt="logo" width={24} height={24} />
          <h3 className={styles.brand}>NeoDog</h3>
        </div>
        <h2 className={styles.sectionTitle}>Form Components Library</h2>
        <p className={styles.sectionDescription}>
          A collection of reusable form components that follow the design system.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Input Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Pet Name</label>
            <Input
              type="text"
              placeholder="Enter pet name"
              value={textValue}
              onValueChange={setTextValue}
              helperText="Enter your pet's full name"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Email Address</label>
            <Input
              type="email"
              placeholder="Enter email address"
              value={emailValue}
              onValueChange={setEmailValue}
              error={true}
              helperText="Please enter a valid email address"
            />
          </div>
        </div>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              value={passwordValue}
              onValueChange={setPasswordValue}
              helperText="Password must be at least 8 characters"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Disabled Input</label>
            <Input
              type="text"
              placeholder="This input is disabled"
              value="Disabled value"
              disabled={true}
              helperText="This field cannot be edited"
            />
          </div>
        </div>
        <div className={styles.inputSizes}>
          <h4>Input Sizes</h4>
          <div className={styles.sizeExamples}>
            <Input size="sm" placeholder="Small input" helperText="Small size input" />
            <Input size="md" placeholder="Medium input (default)" helperText="Medium size input" />
            <Input size="lg" placeholder="Large input" helperText="Large size input" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>SearchInput Variants</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Default SearchInput</label>
            <SearchInput
              placeholder="Search for pets by name, breed, or owner..."
              value={searchValue}
              onValueChange={setSearchValue}
              suggestions={searchSuggestions}
              onSuggestionSelect={(suggestion: string) => setSearchValue(suggestion)}
              onSearch={(value: string) => console.log('Searching for:', value)}
              helperText="Type to search or select from suggestions"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Search with Loading</label>
            <SearchInput
              placeholder="Searching..."
              loading={true}
              disabled={true}
              helperText="Search results are loading"
            />
          </div>
          <div className={styles.componentExample + ' ' + styles.disabledExample}>
            <label className={styles.label}>Disabled SearchInput</label>
            <SearchInput disabled placeholder="Search is disabled..." />
          </div>
        </div>
        <div className={styles.searchInputSizes}>
          <h4>SearchInput Sizes</h4>
          <div className={styles.sizeExamples}>
            <SearchInput size="sm" placeholder="Small search" helperText="Small search input" />
            <SearchInput
              size="md"
              placeholder="Medium search (default)"
              helperText="Medium search input"
            />
            <SearchInput size="lg" placeholder="Large search" helperText="Large search input" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>TimeInput Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Appointment Time</label>
            <TimeInput
              value={timeValue}
              onValueChange={setTimeValue}
              helperText="Select appointment time"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Operating Hours</label>
            <TimeInput min="09:00" max="17:00" helperText="Select time between 9 AM and 5 PM" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Select Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Pet Breed</label>
            <Select
              options={petBreeds}
              placeholder="Choose a breed"
              value={selectedOption}
              onValueChange={setSelectedOption}
              helperText="Select your pet's breed from the list"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Status</label>
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' }
              ]}
              placeholder="Select status"
              error={true}
              helperText="This field is required"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>DatePicker Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Appointment Date</label>
            <DatePicker
              value={selectedDate}
              onValueChange={setSelectedDate}
              minDate="2024-01-01"
              maxDate="2024-12-31"
              helperText="Select a date for your appointment"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Birth Date</label>
            <DatePicker
              maxDate={new Date().toISOString().split('T')[0]}
              helperText="Select your birth date"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>DateRangePicker Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Appointment Period</label>
            <DateRangePicker
              value={dateRange}
              onValueChange={setDateRange}
              minDate="2024-01-01"
              maxDate="2024-12-31"
              helperText="Select start and end dates for appointment period"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Vacation Period</label>
            <DateRangePicker
              placeholder="Select vacation dates"
              helperText="Choose your vacation start and end dates"
            />
          </div>
        </div>
        <div className={styles.dateRangePickerSizes}>
          <h4>DateRangePicker Sizes</h4>
          <div className={styles.sizeExamples}>
            <DateRangePicker
              size="sm"
              value={smallDateRange}
              onValueChange={setSmallDateRange}
              placeholder="Small date range"
              helperText="Small size date range picker"
            />
            <DateRangePicker
              size="md"
              value={mediumDateRange}
              onValueChange={setMediumDateRange}
              placeholder="Medium date range (default)"
              helperText="Medium size date range picker"
            />
            <DateRangePicker
              size="lg"
              value={largeDateRange}
              onValueChange={setLargeDateRange}
              placeholder="Large date range"
              helperText="Large size date range picker"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Checkbox Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <Checkbox
              label="I agree to the terms and conditions"
              checked={isChecked}
              onCheckedChange={setIsChecked}
              helperText="Please read the terms before checking"
            />
          </div>
          <div className={styles.componentExample}>
            <Checkbox
              label="Send me marketing emails"
              helperText="Receive updates about new features"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>RadioButton Components</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Pet Size</label>
            <div className={styles.radioGroup}>
              <RadioButton
                name="pet-size"
                label="Small (under 20 lbs)"
                value="small"
                checked={selectedRadio === 'small'}
                onCheckedChange={() => setSelectedRadio('small')}
              />
              <RadioButton
                name="pet-size"
                label="Medium (20-50 lbs)"
                value="medium"
                checked={selectedRadio === 'medium'}
                onCheckedChange={() => setSelectedRadio('medium')}
              />
              <RadioButton
                name="pet-size"
                label="Large (over 50 lbs)"
                value="large"
                checked={selectedRadio === 'large'}
                onCheckedChange={() => setSelectedRadio('large')}
              />
            </div>
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Gender</label>
            <div className={styles.radioGroup}>
              <RadioButton
                name="gender"
                label="Male"
                value="male"
                checked={selectedRadio === 'male'}
                onCheckedChange={() => setSelectedRadio('male')}
              />
              <RadioButton
                name="gender"
                label="Female"
                value="female"
                checked={selectedRadio === 'female'}
                onCheckedChange={() => setSelectedRadio('female')}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Toggle Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <Toggle
              label="Enable notifications"
              size="md"
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
              helperText="Receive push notifications for appointments"
            />
          </div>
          <div className={styles.componentExample}>
            <Toggle
              label="Dark mode"
              size="lg"
              checked={darkMode}
              onCheckedChange={setDarkMode}
              helperText="Switch to dark theme"
            />
          </div>
        </div>
        <div className={styles.toggleSizes}>
          <h4>Toggle Sizes</h4>
          <div className={styles.sizeExamples}>
            <Toggle
              label="Small toggle"
              size="sm"
              checked={isToggled}
              onCheckedChange={setIsToggled}
            />
            <Toggle
              label="Medium toggle"
              size="md"
              checked={isToggled}
              onCheckedChange={setIsToggled}
            />
            <Toggle
              label="Large toggle"
              size="lg"
              checked={isToggled}
              onCheckedChange={setIsToggled}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Textarea Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Pet Description</label>
            <Textarea
              placeholder="Describe your pet's personality, habits, and special needs..."
              value={textareaValue}
              onValueChange={setTextareaValue}
              rows={4}
              maxLength={500}
              showCharacterCount={true}
              helperText="Provide detailed information about your pet"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Medical Notes</label>
            <Textarea
              placeholder="Enter medical history and current medications..."
              error={true}
              helperText="This field is required for medical records"
            />
          </div>
        </div>
        <div className={styles.textareaSizes}>
          <h4>Textarea Sizes</h4>
          <div className={styles.sizeExamples}>
            <Textarea
              size="sm"
              placeholder="Small textarea"
              rows={2}
              helperText="Small size textarea"
            />
            <Textarea
              size="md"
              placeholder="Medium textarea (default)"
              rows={3}
              helperText="Medium size textarea"
            />
            <Textarea
              size="lg"
              placeholder="Large textarea"
              rows={4}
              helperText="Large size textarea"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>FileInput Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Pet Photos</label>
            <FileInput
              accept="image/*"
              multiple={true}
              maxSize={5 * 1024 * 1024} // 5MB
              showFileList={true}
              helperText="Upload photos of your pet (max 5MB each)"
            />
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Medical Documents</label>
            <FileInput
              accept=".pdf,.doc,.docx"
              maxSize={10 * 1024 * 1024} // 10MB
              showFileList={true}
              helperText="Upload medical records and documents"
            />
          </div>
        </div>
        <div className={styles.fileInputSizes}>
          <h4>FileInput Sizes</h4>
          <div className={styles.sizeExamples}>
            <FileInput size="sm" accept="image/*" helperText="Small file input" />
            <FileInput size="md" accept="image/*" helperText="Medium file input (default)" />
            <FileInput size="lg" accept="image/*" helperText="Large file input" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Button Component</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Button Variants</label>
            <div className={styles.buttonGroup}>
              <Button variant="default" size="md">
                Primary
              </Button>
              <Button variant="secondary" size="md">
                Secondary
              </Button>
              <Button variant="outline" size="md">
                Outline
              </Button>
              <Button variant="destructive" size="md">
                Delete
              </Button>
            </div>
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Button Sizes</label>
            <div className={styles.buttonGroup}>
              <Button variant="default" size="sm">
                Small
              </Button>
              <Button variant="default" size="md">
                Medium
              </Button>
              <Button variant="default" size="lg">
                Large
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Button States</label>
            <div className={styles.buttonGroup}>
              <Button variant="default" size="md">
                Normal
              </Button>
              <Button variant="default" size="md" disabled>
                Disabled
              </Button>
              <Button variant="default" size="md" isLoading>
                Loading
              </Button>
            </div>
          </div>
          <div className={styles.componentExample}>
            <label className={styles.label}>Additional Variants</label>
            <div className={styles.buttonGroup}>
              <Button variant="ghost" size="md">
                Ghost
              </Button>
              <Button variant="link" size="md">
                Link
              </Button>
              <Button variant="dark" size="md">
                Dark
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.componentTitle}>Component States</h3>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <label className={styles.label}>Disabled Select</label>
            <Select
              options={petBreeds}
              placeholder="Disabled select"
              disabled={true}
              helperText="This field is disabled"
            />
          </div>
          <div className={styles.componentExample}>
            <Checkbox
              label="Disabled checkbox"
              disabled={true}
              helperText="This checkbox is disabled"
            />
          </div>
        </div>
        <div className={styles.componentGrid}>
          <div className={styles.componentExample}>
            <Toggle label="Disabled toggle" disabled={true} helperText="This toggle is disabled" />
          </div>
          <div className={styles.componentExample}>
            <DatePicker disabled={true} helperText="This date picker is disabled" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormComponentsExample;
