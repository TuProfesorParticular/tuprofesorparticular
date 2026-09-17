"use client";

import { useSyncExternalStore } from "react";

// Consentimiento de cookies no esenciales (hoy: anuncios de Google AdSense).
// La analítica propia no entra aquí — es anónima, no usa cookies y no
// requiere consentimiento previo según el criterio de la AEPD (ver
// /cookies, sección 3).
export type ConsentValue = "all" | "essential";

const STORAGE_KEY = "cookie-consent";
const CHANGE_EVENT = "cookie-consent-changed";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "all" || value === "essential" ? value : null;
}

export function setConsent(value: ConsentValue) {
  localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Retira la decisión guardada, para que el aviso vuelva a aparecer — es lo
// que hace el enlace "Preferencias de cookies" del pie de página.
export function clearConsent() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

// null = todavía no ha decidido (hay que enseñarle el aviso).
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribeConsent, getConsent, () => null);
}
