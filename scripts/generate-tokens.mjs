import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import {
  dark,
  light,
  bodyWeightByMode,
  font,
  type,
  marketingType,
  space,
  radius,
  size,
  shadow,
  motion,
} from "../theme.ts";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

const kebab = (s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

const cssShadow = (s) =>
  s
    ? `${s.shadowOffset.width}px ${s.shadowOffset.height}px ${s.shadowRadius}px rgba(10,11,9,${s.shadowOpacity})`
    : "none";

const palette = (tokens, mode) =>
  [
    ...Object.entries(tokens).map(([k, v]) => `  --${kebab(k)}: ${v};`),
    `  --body-weight: ${bodyWeightByMode[mode]};`,
    `  --card-shadow: ${cssShadow(shadow[mode])};`,
  ].join("\n");

const colorNames = Object.keys(light).map(kebab);

const out = `/*
 * GENERATED FILE — do not edit.
 * Run \`npm run tokens\` to regenerate from theme.ts.
 */

/* Tailwind v4 has no --duration-* theme namespace, so these stay plain custom
   properties. Reference them as duration-(--duration-fast). */
:root {
${["fast", "normal", "slow", "buzz"]
  .map((k) => `  --duration-${k}: ${motion[k]}ms;`)
  .join("\n")}
  --default-transition-timing-function: ${motion.easing};
  --stagger: ${motion.stagger}ms;
  --rise: ${motion.rise}px;
}

:root,
[data-theme="light"] {
${palette(light, "light")}
}

[data-theme="dark"] {
${palette(dark, "dark")}
}

@theme inline {
  --font-sans: var(--font-dm-sans), system-ui, sans-serif;

${colorNames.map((n) => `  --color-${n}: var(--${n});`).join("\n")}

  --font-weight-body: var(--body-weight);
  --shadow-card: var(--card-shadow);

${Object.entries({ ...type, ...marketingType })
  .map(([name, t]) =>
    [
      `  --text-${kebab(name)}: ${t.size}px;`,
      `  --text-${kebab(name)}--line-height: ${t.lineHeight}px;`,
      `  --text-${kebab(name)}--letter-spacing: ${t.letterSpacing}px;`,
      `  --text-${kebab(name)}--font-weight: ${t.weight};`,
    ].join("\n"),
  )
  .join("\n\n")}

${Object.entries(space)
  .map(([k, v]) => `  --spacing-${kebab(k)}: ${v}px;`)
  .join("\n")}
${Object.entries(size)
  .map(([k, v]) => `  --spacing-${kebab(k)}: ${v}px;`)
  .join("\n")}

${Object.entries(radius)
  .map(([k, v]) => `  --radius-${kebab(k)}: ${v}px;`)
  .join("\n")}
}
`;

writeFileSync(join(root, "app", "tokens.css"), out);
console.log(`tokens.css written — ${colorNames.length} colours, font ${font.family}`);
