import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <ScrollReveal variant="fade" delayMs={200}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.subtitle}>
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/" className={styles.btn}>
              ← Return Home
            </Link>
          </div>
        </ScrollReveal>
        <ScrollReveal variant="up" delayMs={400}>
          <div className={styles.decor}>
            <div className={styles.decorItem} />
            <div className={styles.decorItem} />
            <div className={styles.decorItem} />
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}

