import React from 'react';
import { MapPin, Mail, PhoneCall } from 'lucide-react';
import styles from './ContactBar.module.css';

const ContactBar = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Location */}
        <div className={styles.item}>
          <div className={styles.iconBox}>
            <MapPin size={28} strokeWidth={1.5} />
          </div>
          <div className={styles.textContent}>
            <span className={styles.label}>Location:</span>
            <p className={styles.value}>7 Green Lake Street Crawfordsville</p>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Email */}
        <div className={styles.item}>
          <div className={styles.iconBox}>
            <Mail size={28} strokeWidth={1.5} />
          </div>
          <div className={styles.textContent}>
            <span className={styles.label}>Email:</span>
            <p className={styles.value}>Transfar@gmail.com</p>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Phone */}
        <div className={styles.item}>
          <div className={styles.iconBox}>
            <PhoneCall size={28} strokeWidth={1.5} />
          </div>
          <div className={styles.textContent}>
            <span className={styles.label}>Phone:</span>
            <p className={styles.value}>+00 468 (97) 234</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBar;