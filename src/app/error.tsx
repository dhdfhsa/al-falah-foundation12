"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import styles from './error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Error Boundary]', error);
  }, [error]);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <ScrollReveal variant="fade" delayMs={150}>
          <div className={styles.errorCard}>
            <div className={styles.errorIcon}>
              <svg viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="36" fill="url(#errorGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                <path d="M34 26L46 54M34 54L46 26" stroke="#c94444" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <radialGradient id="errorGrad" cx="40%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#c94444"/>
                    <stop offset="70%" stopColor="#8b1e1e"/>
                    <stop offset="100%" stopColor="#4a0f0f"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
            <h1 className={styles.title}>Something Went Wrong</h1>
            <p className={styles.subtitle}>
              We&apos;re sorry, but an unexpected error occurred. 
              Please try reloading or contact support if the problem persists.
            </p>
            <div className={styles.actions}>
              <button className={styles.retryBtn} onClick={() => reset()}>
                Try Again
              </button>
              <Link href="/" className={styles.homeBtn}>
                Go Home
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>
      <Footer />
    </>
  );
}

