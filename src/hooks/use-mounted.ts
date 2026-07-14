"use client";

import { useEffect, useState } from "react";

/** True only after the component has mounted on the client (safe for localStorage/sessionStorage). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
