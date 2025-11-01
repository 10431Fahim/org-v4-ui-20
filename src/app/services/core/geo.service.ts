// src/app/shared/services/geo.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class GeoService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Nominatim দিয়ে country_code আনবে (প্যাকেজ ছাড়া)
  async getCountryByBrowserLocation(timeoutMs = 6000): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId) || !('geolocation' in navigator)) {
      return null; // SSR বা unsupported হলে
    }

    // 1) ইউজারের লোকেশন নিন (consent লাগবে)
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: timeoutMs,
        maximumAge: 600000, // 10 মিনিট পুরোনো cache allow
      });
    }).catch(() => null as any);
    if (!pos) return null;

    const { latitude, longitude } = pos.coords;

    // 2) OSM Nominatim reverse geocoding (থার্ড-পার্টি API)
    // নোট: ব্রাউজার থেকে ডাইরেক্ট কল করলে রেট-লিমিট/ব্লক হতে পারে।
    // প্রোডাকশনে নিজের সার্ভার দিয়ে proxy করলে ভালো।
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      const res = await fetch(url, {
        headers: {
          // কিছু সেট করা যাবে না (User-Agent), ব্রাউজার ব্লক করে—ঠিক আছে
          // 'User-Agent': 'yourapp/1.0 (contact@yourdomain)'
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      const cc = data?.address?.country_code?.toUpperCase?.();
      return cc || null;
    } catch {
      return null;
    }
  }
}
