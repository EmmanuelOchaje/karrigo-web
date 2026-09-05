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

export const dark = {
  bg:              '#0E0F0D',
  surface:         '#1A1C19',
  surfaceRaised:   '#242621',
  border:          '#2E312C',
  borderStrong:    '#3A3C38',

  text:            '#FFFFFF',
  textSecondary:   '#8E9189',
  textTertiary:    '#6E7169',

  accent:          accent.base,
  onAccent:        accent.on,
  accentText:      accent.base,     // lime reads fine on dark

  danger:          '#FF6B4A',
  dangerBg:        'rgba(255,107,74,0.14)',
  dangerText:      '#FF8E74',

  /** Toggle knob. White in both modes — it rides on accent or on borderStrong. */
  knob:            '#FFFFFF',

  /** Device bezel on the marketing pages. Mockup furniture, not product UI.
   *  Lighter than the page on dark, darker than the page on light — either way
   *  the frame has to be visible against the background it sits on. */
  bezel:           '#242621',

  /** Skin tone in the illustrations, as drawn by unDraw. Identical in both
   *  modes — a person does not change colour with the theme. */
  illustrationSkin: '#ED9DA0',

  scrim:           'rgba(14,15,13,0.62)',
} as const;

export const light = {
  bg:              '#FFFFFF',
  surface:         '#F6F7F3',
  surfaceRaised:   '#EDEFE8',
  border:          '#E4E7DE',
  borderStrong:    '#D3D7CB',

  text:            '#0E0F0D',
  textSecondary:   '#6B6F66',
  textTertiary:    '#9A9E93',

  accent:          accent.base,     // fill stays identical
  onAccent:        accent.on,
  accentText:      accent.darkTone, // darker tone for text and icons

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
  family: 'DMSans',
  weight: { light: '300', regular: '400', medium: '500', semibold: '600' },
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
  hero:          { size: 76, lineHeight: 74, letterSpacing: -3.8, weight: '600' },
  heroSmall:     { size: 44, lineHeight: 45, letterSpacing: -2.0, weight: '600' },
  section:       { size: 42, lineHeight: 46, letterSpacing: -1.9, weight: '600' },
  sectionSmall:  { size: 30, lineHeight: 34, letterSpacing: -1.3, weight: '600' },
  lede:          { size: 17, lineHeight: 28, letterSpacing: 0,    weight: '400' },
  siteBody:      { size: 15, lineHeight: 25, letterSpacing: 0,    weight: '400' },
  siteLabel:     { size: 13, lineHeight: 18, letterSpacing: 0,    weight: '500' },
  stat:          { size: 24, lineHeight: 28, letterSpacing: -1.0, weight: '600' },
  eyebrow:       { size: 12, lineHeight: 16, letterSpacing: 1.4,  weight: '600' },
} as const;

/** Body copy is 300 on dark, 400 on light — thin type disappears on white. */
export const bodyWeightByMode = { dark: '300', light: '400' } as const;

/** `section` is the gap between marketing sections — the app scale tops out
 *  at 28px, which is right inside a screen and far too tight between them. */
export const space  = { xs:4, sm:8, md:12, lg:16, xl:20, xxl:28, screenX:16,
                        section:76 } as const;
export const radius = { field:15, card:15, sheet:20, header:24, otp:13, pill:999, icon:20 } as const;
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
  /** One cycle of the idle sway on the hero devices. Long and slow on purpose:
   *  it should read as the page breathing, not as something demanding attention. */
  sway: 4200,
} as const;

export default { dark, light, rules, modeByScreen, font, type, space, radius, size, shadow, motion };
