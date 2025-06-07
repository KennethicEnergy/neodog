import Icon from '@/components/common/icon';
import { FOOTER_MENUS, FOOTER_SOCIALS } from '@/utils/constants';
import styles from './styles.module.scss';

const Footer = () => {
  const renderAllRightsReserved = () => {
    return <div className={styles.allRightsReserved}>© 2025 NeoDog. All rights reserved.</div>;
  };

  const renderSocials = () => {
    return (
      <div className={styles.socials}>
        {FOOTER_SOCIALS.map((social, index) => (
          <Icon
            key={index}
            src={social.icon}
            height={24}
            width={24}
            onClick={() => window.open(social.link, '_blank')}
          />
        ))}
      </div>
    );
  };

  const renderFooterMenus = () => (
    <div className={styles.footerMenus}>
      {FOOTER_MENUS.map((menu, index) => (
        <div key={index} className={styles.menu}>
          {menu}
        </div>
      ))}
      {renderSocials()}
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
