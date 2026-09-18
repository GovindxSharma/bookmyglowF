/**
 * Centralized consistent image mapping for all staff and clients across BookMyGlow.
 * Ensures that identical names ALWAYS resolve to the exact same authentic Indian portrait.
 */

export const STAFF_IMAGE_MAP = {
  "rahul sharma": "/images/stylists/rahul-sharma.jpg",
  "rahul": "/images/stylists/rahul-sharma.jpg",
  "pooja patel": "/images/stylists/pooja-patel.jpg",
  "pooja": "/images/stylists/pooja-patel.jpg",
  "komal jadeja": "/images/stylists/komal-jadeja.jpg",
  "komal": "/images/stylists/komal-jadeja.jpg",
  "amit varma": "/images/stylists/amit-varma.jpg",
  "amit": "/images/stylists/amit-varma.jpg",
  "sneha nair": "/images/stylists/sneha-nair.jpg",
  "sneha": "/images/stylists/sneha-nair.jpg",
};

export const CLIENT_IMAGE_MAP = {
  "ananya roy": "/images/reviews/ananya-roy.jpg",
  "ananya r.": "/images/reviews/ananya-roy.jpg",
  "ananya": "/images/reviews/ananya-roy.jpg",
  "siddharth malhotra": "/images/reviews/siddharth-malhotra.jpg",
  "siddharth": "/images/reviews/siddharth-malhotra.jpg",
  "rhea sen": "/images/reviews/rhea-sen.jpg",
  "rhea k.": "/images/reviews/rhea-sen.jpg",
  "rhea": "/images/reviews/rhea-sen.jpg",
  "priya patel": "/images/reviews/ananya-roy.jpg",
  "priya m.": "/images/reviews/ananya-roy.jpg",
  "priya": "/images/reviews/ananya-roy.jpg",
  "vikram s.": "/images/reviews/siddharth-malhotra.jpg",
  "vikram": "/images/reviews/siddharth-malhotra.jpg",
};

export const getStaffImage = (name, gender = "male") => {
  if (!name) return gender === "female" ? "/images/stylists/pooja-patel.jpg" : "/images/stylists/rahul-sharma.jpg";
  const cleaned = name.toLowerCase().replace(/\(.*?\)/g, "").trim();
  for (const [k, v] of Object.entries(STAFF_IMAGE_MAP)) {
    if (cleaned.includes(k) || k.includes(cleaned)) return v;
  }
  return gender === "female" ? "/images/stylists/pooja-patel.jpg" : "/images/stylists/rahul-sharma.jpg";
};

export const getClientImage = (name, gender = "female") => {
  if (!name) return "/images/reviews/ananya-roy.jpg";
  const cleaned = name.toLowerCase().replace(/\(.*?\)/g, "").trim();
  for (const [k, v] of Object.entries(CLIENT_IMAGE_MAP)) {
    if (cleaned.includes(k) || k.includes(cleaned)) return v;
  }
  return gender === "male" ? "/images/reviews/siddharth-malhotra.jpg" : "/images/reviews/ananya-roy.jpg";
};
