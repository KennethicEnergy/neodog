import Main  from "../components/layout/main";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.content}>
        <Header />
        <Main/>
      </div>
    </div>
  );
}
