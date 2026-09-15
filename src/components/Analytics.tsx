"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_STORAGE_KEY = "tpp_visitor_id";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_STORAGE_KEY, id);
  }
  return id;
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const startedAt = Date.now();
    let pageViewId: string | null = null;
    let cancelled = false;

    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname, visitorId: getVisitorId() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) pageViewId = data.id ?? null;
      })
      .catch(() => {});

    const sendDuration = () => {
      if (!pageViewId) return;
      const durationMs = Date.now() - startedAt;
      const blob = new Blob(
        [JSON.stringify({ id: pageViewId, durationMs })],
        { type: "application/json" },
      );
      navigator.sendBeacon("/api/analytics/duration", blob);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendDuration();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", sendDuration);

    return () => {
      cancelled = true;
      sendDuration();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", sendDuration);
    };
  }, [pathname]);

  return null;
}
