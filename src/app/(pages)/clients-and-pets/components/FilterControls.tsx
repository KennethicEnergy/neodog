import BaseModal from '@/components/common/base-modal';
import { Button } from '@/components/common/button';
import Icon from '@/components/common/icon';
import AddClient from '@/components/modals/add-client';
import AddPet from '@/components/modals/add-pet';
import { useModalStore } from '@/store/modal-store';
import styles from './FilterControls.module.scss';

interface FilterControlsProps {
  activeTab: 'pets' | 'clients';
  showFilter: boolean;
  onFilterToggle: () => void;
}

const FilterControls = ({ activeTab, showFilter, onFilterToggle }: FilterControlsProps) => {
  console.log('showFilter', showFilter);
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const openAddModal = () => {
    openModal(
      <BaseModal onClose={closeModal}>
        {activeTab === 'pets' ? <AddPet /> : <AddClient />}
      </BaseModal>
    );
  };

  return (
    <div className={styles.filterContainer}>
      <button className={styles.filterButton} onClick={onFilterToggle}>
        <Icon src={`/images/pets-and-clients/filter.svg`} width={18} height={18} />
        Filter
        <Icon src={`/images/pets-and-clients/filter-dropdown.svg`} width={18} height={18} />
      </button>
      <Button className={styles.addButton} onClick={openAddModal} variant="dark" size="default">
        {activeTab === 'pets' ? 'Add Pet' : 'Add Client'}
      </Button>
    </div>
  );
};

export default FilterControls;
