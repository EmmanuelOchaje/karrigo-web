/**
 * Flat illustration of an M-Kart rider on a scooter with a delivery box.
 * Drawn rather than sourced so it uses the theme tokens directly, and so it
 * costs a few KB instead of a few hundred — the whole site has to work on 3G.
 */
export function RiderIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 300"
      className={className}
      role="img"
      aria-label="An M-Kart rider on a scooter carrying a delivery box"
    >
      <ellipse cx="215" cy="252" rx="150" ry="9" className="fill-surface-raised" />

      {/* speed lines */}
      <g className="stroke-accent" strokeWidth="7" strokeLinecap="round" opacity="0.5">
        <path d="M26 136 h44" />
        <path d="M14 168 h32" />
        <path d="M30 200 h38" />
      </g>

      {/* delivery box */}
      <g>
        <rect x="88" y="118" width="62" height="56" rx="8" className="fill-accent" />
        <rect
          x="88"
          y="118"
          width="62"
          height="56"
          rx="8"
          fill="none"
          className="stroke-text"
          strokeWidth="5"
        />
        <path d="M119 118 v56 M88 146 h62" className="stroke-text" strokeWidth="4" />
      </g>

      {/* wheels */}
      <g>
        <circle cx="142" cy="214" r="30" className="fill-bg stroke-text" strokeWidth="9" />
        <circle cx="296" cy="214" r="30" className="fill-bg stroke-text" strokeWidth="9" />
        <circle cx="142" cy="214" r="7" className="fill-text" />
        <circle cx="296" cy="214" r="7" className="fill-text" />
      </g>

      {/* scooter body */}
      <g className="stroke-text" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* footboard */}
        <path d="M158 200 H250" strokeWidth="13" />
        {/* rear rack under the box */}
        <path d="M150 174 L162 198" strokeWidth="7" />
        {/* leg shield up to the bars */}
        <path d="M250 200 L274 150" strokeWidth="13" />
        {/* handlebar */}
        <path d="M274 150 L290 142" strokeWidth="8" />
        <path d="M284 132 L298 152" strokeWidth="8" />
        {/* seat post */}
        <path d="M178 178 L172 198" strokeWidth="8" />
      </g>
      {/* seat */}
      <rect x="150" y="162" width="64" height="17" rx="8" className="fill-text" />

      {/* rider */}
      <g>
        {/* torso */}
        <path
          d="M196 166 L207 124"
          className="stroke-accent"
          strokeWidth="26"
          strokeLinecap="round"
        />
        {/* arm to the handlebar. The halo underneath keeps it readable where it
            crosses the leg shield — both are the same dark. */}
        <path
          d="M206 130 L283 142"
          className="stroke-bg"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M206 130 L283 142"
          className="stroke-text"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        {/* head */}
        <circle cx="214" cy="103" r="17" className="fill-text" />
        {/* helmet: dome over the top half, peak pointing the way we are going */}
        <path d="M197 103 a17 17 0 0 1 34 0 z" className="fill-accent" />
        <path d="M228 97 L245 99 L245 106 L228 104 Z" className="fill-accent" />
        {/* near leg, drawn last so it reads in front of the scooter */}
        <path
          d="M197 168 L216 196 L240 200"
          className="stroke-bg"
          strokeWidth="19"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M197 168 L216 196 L240 200"
          className="stroke-text"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
