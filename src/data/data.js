// src/data/data.js
export const BASE_URL = import.meta.env.VITE_API_URL || "";

export const SALON_CONFIG = {
  name: import.meta.env.VITE_SALON_NAME || "Aura Salon & Day Spa",
  subtitle: import.meta.env.VITE_SALON_SUBTITLE || "Hair • Skin • Wellness",
  tagline: import.meta.env.VITE_SALON_TAGLINE || "Thoughtful hair styling, refreshing skin facials, and calming spa care.",
  phone: import.meta.env.VITE_SALON_PHONE || "+91 98765 43210",
  email: import.meta.env.VITE_SALON_EMAIL || "contact@aurasalon.demo",
  address: import.meta.env.VITE_SALON_ADDRESS || "Suite 101, Central Boulevard, Luxury Promenade, Metro City",
  mapsUrl: import.meta.env.VITE_SALON_MAPS_URL || "https://maps.google.com/?q=Luxury+Salon+Spa",
};
