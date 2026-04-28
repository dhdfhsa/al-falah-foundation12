"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import styles from "./LeaderMessage.module.css";

interface Leader {
  id: number;
  name: string;
  title: string;
  mainMessage: string;
  subMessage: string;
  image: string; // Added image field
  founded?: string;
  stat1?: string;
}

const LEADERS: Leader[] = [
  {
    id: 1,
    name: "Muhammad Habib",
    title: "Founder & Executive Director",
    mainMessage: "At Al Falah Foundation, we believe that <em>every life has value</em> and <em>every act of kindness creates ripples of change</em>. Our mission is simple: to serve the most vulnerable with unwavering compassion and dignity.",
    subMessage: "Whether through education that opens doors, healthcare that saves lives, or food that nourishes hope—we are committed to transforming not just lives, but entire communities.",
    image: "/levi-meir-clancy-3g3V1TWQi8k-unsplash.jpg", 
    founded: "2010",
    stat1: "1.5M+",
  },
  {
    id: 2,
    name: "Zaid Al-Mansur", // Updated name to match the portrait
    title: "Director of Programs",
    mainMessage: "Our programs are <em>designed with purpose</em> and <em>executed with precision</em>. Every scholarship, every meal, every medical intervention is a step toward genuine, sustainable change in the lives of those we serve.",
    subMessage: "We measure our success not in numbers, but in the smiles of children in classrooms, the hope in parents' eyes, and the health restored to our communities.",
    image: "/luis-villasmil-hh3ViD0r0Rc-unsplash.jpg",
    founded: "500+",
    stat1: "Programs",
  },
  {
    id: 3,
    name: "Dr. Rahman Khan",
    title: "Medical Director",
    mainMessage: "Healthcare is a <em>fundamental right</em>, not a <em>luxury</em>. Through our mobile clinics and partnerships, we bring healing to remote villages where medical care once seemed impossible.",
    subMessage: "Every patient we treat, every preventive measure we take, reinforces our commitment to building a healthier, more resilient Bangladesh for generations to come.",
    image: "/mhrezaa-HZS-CkFEQds-unsplash.jpg",
    founded: "50+",
    stat1: "Villages",
  },
];

export default function LeaderMessage(): ReactElement {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true);
          setTimeout(() => setIsVisible(true), 100);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isLoaded]);

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + LEADERS.length) % LEADERS.length);
        setIsTransitioning(false);
    }, 400);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % LEADERS.length);
        setIsTransitioning(false);
    }, 400);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
    }, 400);
  };

  const leader = LEADERS[currentIndex];

  return (
      <section className={`${styles.section} ${isVisible ? styles.sectionVisible : ""}`} ref={sectionRef} id="testimonials">
      <div className={styles.container}>
        <div className={styles.bgDecor} />

        <div className={styles.quoteIcon}>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.4-5-10-5C1.6 0 0 1.75 0 3c0 1.25.75 4 1.972 6.3C2.75 15.08 5.75 21 9 21c.75 0 2.25 0 2.25 0" />
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-4.4-5-10-5C13.6 0 12 1.75 12 3c0 1.25.75 4 1.972 6.3C13.75 15.08 16.75 21 20 21c.75 0 2.25 0 2.25 0" />
          </svg>
        </div>

        <div className={styles.sliderWrapper}>
          <button
            className={styles.navButton}
            onClick={handlePrev}
            aria-label="Previous leader"
            disabled={isTransitioning}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className={`${styles.content} ${isTransitioning ? styles.contentTransition : ""}`}>
            <div className={`${styles.profile} ${isVisible ? styles.profileSlideIn : ""}`}>
              <div className={styles.imageWrapper}>
                <div className={styles.imagePlaceholder}>
                    {/* Real Image Tag */}
                    <img 
                        src={leader.image} 
                        alt={leader.name} 
                        className={styles.leaderImage} 
                    />
                </div>
                <div className={styles.imageAccent} />
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.leaderName}>{leader.name}</h3>
                <p className={styles.leaderTitle}>{leader.title}</p>
                <div className={styles.profileDecor} />
              </div>
            </div>

            <div className={`${styles.message} ${isVisible ? styles.messageSlideIn : ""}`}>
              <p className={styles.messageText} dangerouslySetInnerHTML={{ __html: `"${leader.mainMessage}"` }} />
              <p className={styles.messageSubtext}>"{leader.subMessage}"</p>

              <div className={styles.signature}>
                <p className={styles.signatureName}>{leader.name}</p>
                <p className={styles.signatureTitle}>{leader.title}</p>
              </div>
              <div className={styles.messageLine} />
            </div>
          </div>

          <button
            className={styles.navButton}
            onClick={handleNext}
            aria-label="Next leader"
            disabled={isTransitioning}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className={styles.indicators}>
          {LEADERS.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.indicator} ${idx === currentIndex ? styles.indicatorActive : ""}`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to leader ${idx + 1}`}
              disabled={isTransitioning}
            />
          ))}
        </div>

      </div>
    </section>
  );
}