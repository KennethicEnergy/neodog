import DummyIcon from '../../common/dummy-icon';
import styles from './styles.module.scss';

const Footer = () => {
  const FOOTER_MENUS = ['Terms', 'Privacy', 'Help'];

  const renderAllRightsReserved = () => {
    return <div className={styles.allRightsReserved}>© 2025 NeoDog. All rights reserved.</div>;
  };

  const renderFooterMenus = () => (
    <div className={styles.footerMenus}>
      {FOOTER_MENUS.map((menu, index) => (
        <div key={index} className={styles.menu}>
          {menu}
        </div>
      ))}
      <DummyIcon />
      <DummyIcon />
      <DummyIcon />
    </div>
  );

  return (
    <footer className={styles.footer}>
      {renderAllRightsReserved()}
      {renderFooterMenus()}
    </footer>
  );
};

export default Footer;
