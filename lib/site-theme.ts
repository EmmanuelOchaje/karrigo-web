export type SiteTheme = "light" | "dark";

/** Where the visitor's choice is kept. A preference, not a session — so
 *  localStorage, and the pre-paint script in the root layout reads the same
 *  key. Light until they choose otherwise: the design's own look. */
export const SITE_THEME_KEY = "karrigo-theme";

/** Runs in <head> before first paint, so a returning dark-mode visitor never
 *  sees a white flash. Written as a string because it executes before React. */
export const SITE_THEME_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(SITE_THEME_KEY)})==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;
