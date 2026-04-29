import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './loading.module.css';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <ScrollReveal variant="fade" delayMs={100}>
          <div className={styles.loader}>
            <div className={styles.spinner}>
              <div /><div /><div /><div />
            </div>
            <h1 className={styles.title}>Loading Al Falah Foundation</h1>
            <p className={styles.subtitle}>Please wait while we prepare your experience…</p>
          </div>
        </ScrollReveal>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 3 }, (_, i) => (
            <ScrollReveal key={i} variant="up" delayMs={200 + i * 100}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine2} />
                <div className={styles.skeletonLine3} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

