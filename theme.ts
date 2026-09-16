/**
 * M-Kart — design tokens, v2
 *
 * Semantic tokens with matched light and dark modes.
 * Components reference roles (`surface`, `textSecondary`) — never raw hex.
 * Switching mode swaps the palette underneath; no component changes.
 */

/* ------------------------------------------------------------------
   THE ACCENT
   One hue, two tones. This is not two brand colours — it is the same
   colour at the two lightnesses each background needs.

     accent      #C6F432   the lime. FILL ONLY. Identical in both modes.
     onAccent    #12180A   the only text colour allowed on top of accent.
     accentText  varies    the lime used AS text or an icon.

   Why accentText has to vary:
     #C6F432 on #FFFFFF  = 1.4:1   unreadable, fails WCAG badly
     #C6F432 on #0E0F0D  = 14.8:1  excellent
     #4E6B00 on #FFFFFF  = 7.1:1   passes AA and AAA
------------------------------------------------------------------ */

const accent = {
  base:     '#C6F432',
  on:       '#12180A',
  darkTone: '#4E6B00',   // accent-as-text on light backgrounds
} as const;

/** The warm second accent. Not `danger` — it never means an error. It marks
 *  the kitchen end of a route, a kitchen that has not opened yet, and the
 *  decorative circles. Identical in both modes, like the lime. */
const accentWarm = '#FF6A2B';

/** Text on the dark panels. Warmer than white, which reads clinical against
 *  the lime. Used at full strength for headings and at 50–66% for body copy
 *  and labels — set those with an opacity utility, not a second token. */
const cream = '#FFF4D6';

export const dark = {
  bg:              '#0E0F0D',
  surface:         '#1A1C19',
  surfaceRaised:   '#242621',
  border:          '#2E312C',
  borderStrong:    '#3A3C38',

  text:            '#FFFFFF',
  textSecondary:   '#8E9189',
  textTertiary:    '#6E7169',

  /** Marketing copy on the dark panels. The app's own dark screens keep
   *  `text` — this is the website's warmer voice, not a second UI colour. */
  cream,

  accent:          accent.base,
  onAccent:        accent.on,
  accentText:      accent.base,     // lime reads fine on dark
  accentWarm,

  danger:          '#FF6B4A',
  dangerBg:        'rgba(255,107,74,0.14)',
  dangerText:      '#FF8E74',

  /** Toggle knob. White in both modes — it rides on accent or on borderStrong. */
  knob:            '#FFFFFF',

  /** Device bezel on the marketing pages. Mockup furniture, not product UI.
   *  Near-black with a hairline of white over it, so the frame reads as glass
   *  and metal against the dark hero panel rather than as a flat outline. */
  bezel:           '#171815',

  /** Skin tone in the illustrations, as drawn by unDraw. Identical in both
   *  modes — a person does not change colour with the theme. */
  illustrationSkin: '#ED9DA0',

  scrim:           'rgba(14,15,13,0.62)',
} as const;

export const light = {
  bg:              '#FFFFFF',
  /** The marketing page's ground, and the chips that sit on the white cards
   *  standing on it. Deliberately darker than a near-white: the site is a
   *  field of white cards, and they need something to stand on. */
  surface:         '#DEDEDE',
  surfaceRaised:   '#EDEBDF',
  border:          '#E4E7DE',
  borderStrong:    '#D3D7CB',

  text:            '#0E0F0D',
  textSecondary:   '#6F7565',
  textTertiary:    '#8A8F7C',

  cream,

  accent:          accent.base,     // fill stays identical
  onAccent:        accent.on,
  accentText:      accent.darkTone, // darker tone for text and icons
  accentWarm,

  danger:          '#C0391C',
  dangerBg:        '#FFEDE8',
  dangerText:      '#C0391C',

  knob:            '#FFFFFF',
  bezel:           '#0A0B09',   // see the note in the dark palette
  illustrationSkin: '#ED9DA0',

  scrim:           'rgba(14,15,13,0.45)',
} as const;

/* ------------------------------------------------------------------
   COMPONENT RULES — identical in both modes
   These are what keep the two themes feeling like one product.
------------------------------------------------------------------ */

export const rules = {
  /** Primary button: accent fill, onAccent label. Same in both modes. */
  buttonPrimary:   { bg: 'accent',        label: 'onAccent' },
  /** Secondary: raised surface. Reads correctly in either mode. */
  buttonSecondary: { bg: 'surfaceRaised', label: 'text' },
  /** Outline: transparent with a border. */
  buttonOutline:   { bg: 'transparent',   label: 'text', border: 'borderStrong' },
  /** Ghost: text only, no fill. */
  buttonGhost:     { bg: 'transparent',   label: 'textSecondary' },

  input:      { bg: 'surface',       text: 'text', placeholder: 'textTertiary' },
  card:       { bg: 'surface',       border: 'border' },
  selected:   { bg: 'accent',        label: 'onAccent' },
  activeTab:  { underline: 'accent', label: 'text' },
  divider:    'border',
} as const;

/* ------------------------------------------------------------------
   WHICH MODE, WHERE
   Not by system preference. By screen purpose, so it is predictable.
------------------------------------------------------------------ */

export const modeByScreen = {
  dark: [
    'splash', 'signUp', 'verifyCode', 'locationPermission',
    'nameAddress', 'welcome', 'orderPlaced', 'tracking',
    'orderProblem', 'noRiders', 'runningLate',
  ],
  light: [
    'home', 'restaurant', 'dish', 'search', 'cart', 'checkout',
    'payment', 'orderHistory', 'orderDetail', 'rate',
    'account', 'addresses', 'notifications', 'help',
  ],
} as const;

/**
 * The rule in one line:
 *   DARK  = moments where the app is doing something and you are waiting.
 *   LIGHT = moments where you are reading, choosing, or comparing.
 *
 * Onboarding, order placed, tracking and failures are dark: they are
 * full-screen single-message states, and dark makes them feel like the
 * app is holding the moment.
 *
 * Menus, carts, receipts and settings are light: dense text you scan,
 * and light is easier to read in sunlight, which is most of Makurdi.
 *
 * v1 ignores the system dark-mode setting entirely. Every screen has one
 * mode. Both palettes exist so that adding a system toggle later is a
 * config change rather than a redesign.
 */

export const font = {
  family: 'Plus Jakarta Sans',
  weight: { light: '300', regular: '400', medium: '500', semibold: '600',
            bold: '700', extrabold: '800' },
} as const;

export const type = {
  display: { size: 25, lineHeight: 27, letterSpacing: -1.1, weight: '600' },
  h1:      { size: 22, lineHeight: 24, letterSpacing: -0.9, weight: '600' },
  h2:      { size: 17, lineHeight: 21, letterSpacing: -0.5, weight: '600' },
  h3:      { size: 14, lineHeight: 18, letterSpacing: -0.2, weight: '600' },
  body:    { size: 13, lineHeight: 21, letterSpacing: 0,    weight: '300' },
  bodyMed: { size: 13, lineHeight: 18, letterSpacing: 0,    weight: '400' },
  label:   { size: 12, lineHeight: 16, letterSpacing: 0,    weight: '500' },
  caption: { size: 11, lineHeight: 17, letterSpacing: 0,    weight: '300' },
  micro:   { size: 10, lineHeight: 15, letterSpacing: 0,    weight: '300' },
  button:  { size: 14, lineHeight: 18, letterSpacing: -0.2, weight: '600' },
  price:   { size: 13, lineHeight: 17, letterSpacing: -0.2, weight: '600' },
} as const;

/**
 * The scale above is phone-sized — it is the app's. The marketing site is read
 * on desktop as often as on a phone, so it gets its own, larger scale. Each
 * entry has a `-small` sibling for narrow screens; pair them as
 * `text-hero-small md:text-hero`.
 */
export const marketingType = {
  /** Headings are 800 across the site — the lime and the near-black do the
   *  shouting on the panels, and a lighter heading beside them reads unfinished.
   *  Letter-spacing is the design's em value multiplied out at each size. */
  hero:          { size: 84, lineHeight: 82, letterSpacing: -3.8, weight: '800' },
  heroSmall:     { size: 40, lineHeight: 39, letterSpacing: -1.8, weight: '800' },
  /** A page-level section heading on the light ground. */
  section:       { size: 56, lineHeight: 56, letterSpacing: -2.2, weight: '800' },
  sectionSmall:  { size: 30, lineHeight: 30, letterSpacing: -1.2, weight: '800' },
  /** A heading inside a dark panel — smaller, because the panel already
   *  carries the emphasis the size would otherwise have to. */
  panel:         { size: 48, lineHeight: 49, letterSpacing: -1.9, weight: '800' },
  panelSmall:    { size: 28, lineHeight: 29, letterSpacing: -1.1, weight: '800' },
  /** A heading inside one of the two offer cards. */
  cardTitle:     { size: 36, lineHeight: 38, letterSpacing: -1.3, weight: '800' },
  cardTitleSmall:{ size: 25, lineHeight: 26, letterSpacing: -0.9, weight: '800' },
  /** The closing call to action, the largest type on the page after the hero. */
  cta:           { size: 62, lineHeight: 62, letterSpacing: -2.8, weight: '800' },
  ctaSmall:      { size: 30, lineHeight: 30, letterSpacing: -1.4, weight: '800' },

  lede:          { size: 18.5, lineHeight: 29, letterSpacing: 0,  weight: '500' },
  ledeSmall:     { size: 15.5, lineHeight: 24, letterSpacing: 0,  weight: '500' },
  /** Body copy inside a panel or a card. */
  panelBody:     { size: 15.5, lineHeight: 24, letterSpacing: 0,  weight: '500' },
  siteBody:      { size: 15, lineHeight: 22.5, letterSpacing: 0,  weight: '500' },
  siteLabel:     { size: 13.5, lineHeight: 21, letterSpacing: 0,  weight: '500' },
  /** Names and questions — the bold-but-not-heading tier. */
  siteTitle:     { size: 17.5, lineHeight: 21, letterSpacing: -0.35, weight: '700' },
  siteQuestion:  { size: 15.5, lineHeight: 20, letterSpacing: 0,  weight: '700' },
  siteAnswer:    { size: 14.5, lineHeight: 23, letterSpacing: 0,  weight: '500' },
  siteChip:      { size: 12.5, lineHeight: 16, letterSpacing: 0,  weight: '600' },
  navLink:       { size: 14, lineHeight: 18, letterSpacing: 0,    weight: '600' },
  siteButton:    { size: 14.5, lineHeight: 18, letterSpacing: 0,  weight: '700' },
  stat:          { size: 21, lineHeight: 21, letterSpacing: -0.6, weight: '800' },
  statLabel:     { size: 12, lineHeight: 16, letterSpacing: 0,    weight: '500' },
  eyebrow:       { size: 11.5, lineHeight: 16, letterSpacing: 0.46, weight: '700' },
  /** The wordmark. Its own entry because it is a mark, not a heading — it
   *  never changes size with the rest of the scale. */
  logo:          { size: 20, lineHeight: 20, letterSpacing: -0.9, weight: '800' },
} as const;

/** Body copy is 300 on dark, 400 on light — thin type disappears on white. */
export const bodyWeightByMode = { dark: '300', light: '400' } as const;

/** `section` is the gap between marketing sections — the app scale tops out
 *  at 28px, which is right inside a screen and far too tight between them. */
export const space  = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:28, screenX:18,
                        /** Between marketing sections: `section` on a desktop
                         *  width, `sectionSm` once the page is narrow. */
                        sectionSm:48, section:88,
                        /** Inside the marketing page's big blocks. The panels
                         *  are wide, so their inner padding is a scale of its
                         *  own rather than the top of the app's. Each pairs
                         *  with `xxl` at narrow widths. */
                        padHeroX:54, padHero:64, padPanel:60, padCard:42,
                        padCta:68, padPageEnd:44, gapWide:52 } as const;
export const radius = { field:15, card:15, sheet:20, header:24, otp:13, pill:999, icon:20,
                        /** Marketing furniture: the hero's stat pills, the
                         *  four-step cards, a card's inset image, the device. */
                        chip:18, step:26, slot:24, device:58, deviceSm:34,
                        /** The marketing page's big inset "panel" corners —
                         *  hero, footer and other full-bleed-feeling blocks
                         *  that sit inset from the page edge with generous
                         *  rounding. Distinct from `card` (15px), which is
                         *  for dense in-page cards like kitchen tiles. */
                        panelXs:22, panelSm:30, panelMd:36, panelLg:44 } as const;
export const size   = { buttonHeight:46, fieldHeight:46, backButton:29, featureIcon:64 } as const;

/** Shadows only exist in light mode. Dark uses surface steps for depth. */
export const shadow = {
  light: { shadowColor:'#0A0B09', shadowOpacity:0.08, shadowRadius:12,
           shadowOffset:{width:0,height:4}, elevation:3 },
  dark:  null,
} as const;

export const motion = {
  fast:150, normal:220, slow:400, easing:'ease-out',
  /** Gap between staggered entrance animations. Keep it small — this is a
   *  content site, not a showreel, and every delay is a delay to reading. */
  stagger: 70,
  /** How far an element travels as it fades in. */
  rise: 14,
  /** One full cycle of the hero devices' buzz: a short shake burst and a long
   *  rest. The rest is most of it — a phone that never stops ringing is noise. */
  buzz: 3800,
  /** One hop of the order notification: a bounce and a smaller settling hop. */
  bounce: 2400,
} as const;

export default { dark, light, rules, modeByScreen, font, type, space, radius, size, shadow, motion };
