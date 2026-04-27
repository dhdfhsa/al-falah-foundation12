import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoSection}>
            <h3 className={styles.logo}>Al Falah Foundation</h3>
            <p className={styles.tagline}>Serving Bangladesh with compassion and dignity</p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Programs</h4>
              <Link href="/programs" className={styles.link}>Education</Link>
              <Link href="/programs" className={styles.link}>Food Aid</Link>
              <Link href="/programs" className={styles.link}>Healthcare</Link>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Support</h4>
              <Link href="/donate" className={styles.link}>Donate</Link>
              <Link href="/volunteer" className={styles.link}>Volunteer</Link>
              <Link href="/contact" className={styles.link}>Contact Us</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Al Falah Foundation. All rights reserved.
          </p>
          <div className={styles.social}>
            <span className={styles.socialText}>Follow us:</span>
            <div className={styles.socialLinks}>
              <Link href="#" className={styles.socialLink} aria-label="Facebook">📘</Link>
              <Link href="#" className={styles.socialLink} aria-label="Twitter">🐦</Link>
              <Link href="#" className={styles.socialLink} aria-label="Instagram">📷</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}