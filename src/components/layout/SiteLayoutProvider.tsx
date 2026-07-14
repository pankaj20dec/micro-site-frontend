"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchSiteLayoutContentClient } from "@/lib/layout-content-api";
import {
  defaultSiteLayout,
  type SiteLayoutContent,
} from "@/lib/layout-content-defaults";

const SiteLayoutContext = createContext<SiteLayoutContent>(defaultSiteLayout);

export function SiteLayoutProvider({ children }: { children: ReactNode }) {
  const [layout, setLayout] = useState<SiteLayoutContent>(defaultSiteLayout);

  useEffect(() => {
    let cancelled = false;
    fetchSiteLayoutContentClient().then((data) => {
      if (!cancelled) setLayout(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteLayoutContext.Provider value={layout}>{children}</SiteLayoutContext.Provider>
  );
}

export function useSiteLayout() {
  return useContext(SiteLayoutContext);
}
