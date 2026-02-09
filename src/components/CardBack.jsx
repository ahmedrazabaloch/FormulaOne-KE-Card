import logo from "../assets/logo.png";

const BackBgPattern = () => (
  <svg
    viewBox="0 0 400 600"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
    }}
    preserveAspectRatio="none"
  >
    <defs>
      <filter id="thinShadowB" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
        <feOffset dx="0.5" dy="1" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.03" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <pattern id="dotPatternB" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="#9ca3af" opacity="0.3" />
      </pattern>

      <radialGradient id="fadeMaskB" cx="0.1" cy="0.4" r="0.9">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      <mask id="meshMaskB">
        <rect width="400" height="600" fill="url(#fadeMaskB)" />
      </mask>

      <filter id="grainB">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.04" />
        </feComponentTransfer>
      </filter>
    </defs>

    <rect width="400" height="600" fill="#ffffff" />

    {/* Geometric shards - different orientation */}
    <g filter="url(#thinShadowB)">
      <path d="M-20,-50 L420,380 L450,340 L10,-90 Z" fill="#f9f9f9" />
      <path d="M120,-30 L480,330 L510,290 L150,-70 Z" fill="#f5f5f5" opacity="0.6" />
      <path d="M-150,300 L250,650 L300,610 L-100,260 Z" fill="#fbfbfb" />
      <path d="M-80,420 L280,720 L330,680 L-30,380 Z" fill="#f3f3f3" opacity="0.8" />
      <path d="M200,100 L450,400 L500,360 L250,60 Z" fill="#fafafa" />
    </g>

    {/* Halftone mesh */}
    <g mask="url(#meshMaskB)">
      <rect width="400" height="600" fill="url(#dotPatternB)" />
    </g>

    {/* Surface grain */}
    <rect width="400" height="600" filter="url(#grainB)" pointerEvents="none" opacity="0.5" />

    {/* Red swoosh at bottom */}
    <g>
      <path d="M400,600 L0,600 C100,590 250,560 400,460 Z" fill="#fecaca" opacity="0.18" />
      <path d="M400,600 L60,600 C150,595 300,570 400,510 Z" fill="#991b1b" opacity="0.06" />
      <path d="M400,600 L120,600 C220,598 330,580 400,540 Z" fill="#b91c1c" opacity="0.12" />
      <path d="M400,600 L180,600 C250,598 350,585 400,560 Z" fill="#ed1c24" opacity="0.95" />
      <path d="M400,600 L260,600 C320,599 380,595 400,580 Z" fill="#ffffff" opacity="0.1" />
    </g>
  </svg>
);

const CardBack = ({ data, orientation = "portrait" }) => {
  return (
    <div className={`card-modern ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      <BackBgPattern />

      {/* HEADER */}
      <div className="card-back-header">
        <h3>Vehicle Deputed on KE Duty</h3>
      </div>

      {/* FORM FIELDS */}
      <div className="form-table-modern">
        {[
          ["Licence No", data.licenceNo],
          ["Licence Category", data.licenceCategory],
          ["Licence Validity", data.licenceValidity],
          ["Date of Issue", data.dateOfIssue],
          ["Vehicle No", data.vehicleNo],
          ["Vehicle Type", data.vehicleType],
          ["Shift Type", data.shiftType],
          ["Regional", data.region],
          ["Departure /BC", data.departureBC],
        ].map(([label, value]) => (
          <div className="table-row-modern" key={label}>
            <span className="table-label">{label}:</span>
            <span className="table-value">{value || ""}</span>
          </div>
        ))}

        <div className="table-row-modern">
          <span className="table-label">Valid From:</span>
          <span className="table-value-inline">{data.validFrom || ""}</span>
          <span className="table-label-inline">Valid To:</span>
          <span className="table-value-inline">{data.validTo || ""}</span>
        </div>
      </div>

      {/* RETURN SECTION */}
      <div className="return-section-clean">
        <div className="return-title-red">If found please return to:</div>
        <img src={logo} className="card-logo-return" alt="Company Logo" />
        <div className="address-large">
          Suite No. 302-A, Sea Breeze Plaza
          <br />
          Shahrah-e-Faisal, Karachi
          <br />
          <strong>Tel:</strong> 021-32783613-4
        </div>
      </div>
    </div>
  );
};

export default CardBack;
