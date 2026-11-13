import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>© 2026 Saytrip. Bookings are made on partner sites.</p>
      <nav aria-label="Footer menu" className={styles.footerNav}>
        <a href="#">About</a>
        <a href="#">Partners</a>
        <a href="#">Privacy</a>
      </nav>
    </footer>
  );
};
