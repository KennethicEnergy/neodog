import { useRouter } from 'next/navigation';
import Icon from '../icon';
import styles from './styles.module.scss';

const samplePopupData = [
  { name: 'New appointment', icon: '/images/popup-appointment.svg', route: '/appointments' },
  { name: 'Check-in Pet', icon: '/images/popup-check-in-pets.svg', route: '/pets-and-client' },
  { name: 'Add Client', icon: '/images/popup-client.svg', route: '/pets-and-client' },
  { name: 'Create Invoice', icon: '/images/popup-create-invoice.svg', route: '' }
];

const HeaderPopup = ({
  isOpen,
  setPopupOpen
}: {
  isOpen: boolean;
  setPopupOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  const redirect = (route: string) => {
    if (route && isOpen) {
      router.push(route);
    }
    setPopupOpen(false);
  };

  return (
    <div className={styles.popup}>
      {samplePopupData.map((data, index) => (
        <div key={index} className={styles.popupItem} onClick={() => redirect(data.route)}>
          <Icon src={data.icon} />
          <span>{data.name}</span>
        </div>
      ))}
    </div>
  );
};

export default HeaderPopup;
