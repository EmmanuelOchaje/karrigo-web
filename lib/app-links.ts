/**
 * Where an emailed link (https://go.karrigo.app/<app>/...) lands when the app
 * is NOT installed. With the app installed, iOS universal links and Android
 * App Links open it directly and this page never loads. Keep the paths in step
 * with karrigo-be/src/messaging/app-links.ts and each app's src/lib/email-links.ts.
 */

export type LinkApp = "partner" | "eats";

/**
 * The customer site. The "continue on the web" buttons must point here with a
 * full URL: this page is served on the link host, where a relative path such
 * as /track is rewritten to /go/track and 404s.
 */
export const SITE_URL = (process.env.SITE_URL?.trim() || "https://karrigo.app").replace(/\/+$/, "");

export type LinkTarget = {
  app: LinkApp;
  /** What the person was trying to do, in their words. */
  title: string;
  body: string;
  /** A web page that does the same job, when the site has one. */
  web?: { href: string; label: string };
};

const APP_NAME: Record<LinkApp, string> = {
  partner: "Karrigo Partner",
  eats: "Karrigo",
};

export function appName(app: LinkApp): string {
  return APP_NAME[app];
}

const PARTNER: Record<string, Omit<LinkTarget, "app">> = {
  "": {
    title: "Open Karrigo Partner",
    body: "This link opens in the Karrigo Partner app, for kitchens and riders.",
  },
  "kitchen": {
    title: "Your kitchen on Karrigo",
    body: "Orders, menu and payouts for your kitchen are in the Karrigo Partner app.",
  },
  "kitchen/menu": {
    title: "Your menu",
    body: "Edit your dishes and prices in the Karrigo Partner app.",
  },
  "kitchen/business": {
    title: "Your kitchen's status",
    body: "See whether your kitchen is approved, or send an appeal, in the Karrigo Partner app.",
  },
  "kitchen/help": {
    title: "Contact support",
    body: "Message the Karrigo team from the Karrigo Partner app.",
  },
  "kitchen/sign-in": {
    title: "Sign in to your kitchen",
    body: "Sign in from the Karrigo Partner app.",
  },
  "kitchen/forgot-password": {
    title: "Reset your password",
    body: "Reset your kitchen password from the Karrigo Partner app.",
  },
  "rider": {
    title: "Ride with Karrigo",
    body: "Go online and take deliveries in the Karrigo Partner app.",
  },
  "rider/documents": {
    title: "Your rider documents",
    body: "Check or resubmit your documents in the Karrigo Partner app.",
  },
  "rider/help": {
    title: "Contact support",
    body: "Message the Karrigo team from the Karrigo Partner app.",
  },
};

const ORDER_ID = /^[A-Za-z0-9_-]+$/;

/** The page to show for a link path (the segments after the host), or null if it isn't one of ours. */
export function resolveLink(segments: string[]): LinkTarget | null {
  const [app, ...rest] = segments;
  const path = rest.join("/");

  if (app === "partner") {
    const entry = PARTNER[path] ?? PARTNER[""];
    return { app, ...entry };
  }

  if (app === "eats") {
    if (rest[0] === "order" && rest.length === 2 && ORDER_ID.test(rest[1])) {
      return {
        app,
        title: "Your order",
        body: "Follow your order in the Karrigo app, or track it on the web.",
        web: { href: `${SITE_URL}/track?order=${encodeURIComponent(rest[1])}`, label: "Track on the web" },
      };
    }
    if (path === "help") {
      return {
        app,
        title: "Contact support",
        body: "Message the Karrigo team from the Karrigo app.",
      };
    }
    return {
      app,
      title: "Open Karrigo",
      body: "Order from kitchens and stores near you in the Karrigo app.",
      web: { href: SITE_URL, label: "Continue on the web" },
    };
  }

  return null;
}

/** Store listings, set per app once the apps are published. */
export function storeUrls(app: LinkApp): { ios?: string; android?: string } {
  const env = process.env;
  const ios = app === "partner" ? env.PARTNER_IOS_STORE_URL : env.EATS_IOS_STORE_URL;
  const android = app === "partner" ? env.PARTNER_ANDROID_STORE_URL : env.EATS_ANDROID_STORE_URL;
  return { ios: ios || undefined, android: android || undefined };
}
