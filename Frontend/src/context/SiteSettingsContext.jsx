import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getSettings } from "../services/settingsService";

const SiteSettingsContext = createContext(null);

const CACHE_KEY = "site_settings_cache";
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setSettings(data);
          setLoading(false);
          return data;
        }
      }

      // Fetch from API
      const res = await getSettings();
      setSettings(res.data);
      
      // Cache the result
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: res.data,
        timestamp: Date.now()
      }));
      
      return res.data;
    } catch (err) {
      console.error("Failed to load site settings:", err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshSettings()
      .catch((err) => console.error("Settings load error:", err.message))
      .finally(() => setLoading(false));
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  return ctx;
}
