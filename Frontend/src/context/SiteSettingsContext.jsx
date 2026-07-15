import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getSettings } from "../services/settingsService";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    const res = await getSettings();
    setSettings(res.data);
    return res.data;
  }, []);

  useEffect(() => {
    refreshSettings()
      .catch((err) => console.error("Failed to load site settings:", err.message))
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
