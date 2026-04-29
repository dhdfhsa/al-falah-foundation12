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
    name: "Gazi Mohammad Abdulla Al Noman",
    title: "Founder",
    mainMessage: "আসসালামুআলকইকুম ২০১৯ সালে প্রতিষ্ঠিত আল-ফালাহ ফাউন্ডেশনে আপনাকে স্বাগতম। আমরা মূলত একটি অরাজনৈতিক মানবকল্যাণমূলক প্রতিষ্ঠান, যা সমাজের অবহেলিত, দুস্থ ও পিছিয়ে পড়া মানুষের মৌলিক চাহিদা পূরণে নিবেদিত। একটি সুন্দর, বৈষম্যহীন ও স্বনির্ভর সমাজ গড়ার স্বপ্ন নিয়ে আমাদের যাত্রা শুরু। ",
    subMessage: "​আমরা সুবিধাবঞ্চিত শিশুদের শিক্ষা সামগ্রী কিনে দিই, দরিদ্র জনগোষ্ঠীকে স্বাস্থ্য সহায়তায় আর্থিক অনুদান দিই। বন্যা বা শীতের মতো দুর্যোগে বস্ত্র ও খাবার বিতরণ করি এবং ইফতারের ব্যবস্থা করার মাধ্যমে মানুষের পাশে দাঁড়াই। এছাড়াও, কর্মসংস্থানের চেষ্টা করা এবং ধর্মীয় দাওয়াতি কার্যক্রম পরিচালনা করাও আমাদের উদ্দেশ্য।​আমাদের জন্য দোয়া করবেন, যাতে আমরা আরো ভালো ভালো কাজগুলো করতে পারি। জাযাকাল্লাহু খাইরান ওয়া জাযাকিল্লাহু খাইরান।",
    image: "/Gemini_Generated_Image_xt4komxt4komxt4k.png", 
    founded: "2019",
    stat1: "1.5M+",
  },
  {
    id: 2,
    name: "Rayan Rouf Sahi", // Updated name to match the portrait
    title: "Adviser",
    mainMessage: "আল ফালাহ ফাউন্ডেশন  অসহায়ের পাশে দাড়ানো ও দারিদ্র্য বিমোচনের লক্ষ্য  নিয়ে তার যাত্রা শুরু করেছিল। আমি চেষ্টা করবো সবসময় আমার মেধা দিয়ে শ্রম দিয়ে জনগণের  সাহায্য করতে এবং আপনাদের সাহায্য কামনা করি।",
    subMessage: "",
    image: "/Gemini_Generated_Image_7hm9em7hm9em7hm9.png",
    founded: "2019",
    stat1: "Programs",
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