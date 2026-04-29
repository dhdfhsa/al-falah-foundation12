import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.main} aria-busy="true" aria-live="polite">
      <div className={styles.loader}>
        <div className={styles.spinner} aria-hidden="true">
          <div />
          <div />
          <div />
          <div />
        </div>
        <h1 className={styles.title}>Loading Al Falah Foundation</h1>
        <p className={styles.subtitle}>
          Please wait while we prepare your experience...
        </p>
      </div>

      <div className={styles.skeletonGrid} aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonLine} />
            <div className={styles.skeletonLine2} />
            <div className={styles.skeletonLine3} />
          </div>
        ))}
      </div>
    </main>
  );
}
