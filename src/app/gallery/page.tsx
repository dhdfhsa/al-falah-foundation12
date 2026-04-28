"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./gallery.module.css";
import ScrollReveal from "@/components/ScrollReveal";

/* ───────────────────────────────
   Types & Data
─────────────────────────────── */
type Category = "all" | "food" | "education" | "medical" | "events";

interface GalleryItem {
  id: number;
  title: string;
  category: Category;
  imageUrl: string;
  description: string;
}

const GALLERY_DATA: GalleryItem[] = [
  {
    id: 1,
    title: "Food Distribution 2026",
    category: "food",
    imageUrl: "/gallery/food-1.jpg", // Replace with your Cloudinary/Public paths
    description: "Providing essential meals to families in Dhaka."
  },
  {
    id: 2,
    title: "Stationery Support",
    category: "education",
    imageUrl: "/gallery/edu-1.jpg",
    description: "Distributing books and pens to local school children."
  },
  {
    id: 3,
    title: "Free Medical Camp",
    category: "medical",
    imageUrl: "/gallery/med-1.jpg",
    description: "Basic health checkups for the underprivileged."
  },
  // Add more items here...
];

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "All Moments", value: "all" },
  { label: "Food Relief", value: "food" },
  { label: "Education", value: "education" },
  { label: "Health", value: "medical" },
  { label: "Events", value: "events" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState<Category>("all");

  const filteredItems = filter === "all" 
    ? GALLERY_DATA 
    : GALLERY_DATA.filter(item => item.category === filter);

  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <ScrollReveal variant="fade">
          <span className={styles.eyebrow}>Al Falah Foundation</span>
          <h1 className={styles.title}>Our <em>Impact</em> in Pictures</h1>
          <p className={styles.subtitle}>
            Witness the transformation and hope your support brings to communities across Bangladesh.
          </p>
        </ScrollReveal>
      </section>

      {/* Filter Tabs */}
      <div className={styles.filterBar}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`${styles.filterBtn} ${filter === cat.value ? styles.active : ""}`}
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className={styles.grid}>
        {filteredItems.map((item, index) => (
          <ScrollReveal key={item.id} variant="up" delayMs={index * 50}>
            <div className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.overlay}>
                  <span className={styles.tag}>{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}