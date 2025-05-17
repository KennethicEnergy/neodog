import Main  from "../components/layout/main";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <Main/>
      </div>
    </div>
  );
}
