import logo from "../assets/logo.png";
import signature from "../assets/authority-signature.png";

const FrontBgPattern = () => (
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
      <filter id="thinShadowF" x="-20%" y="-20%" width="140%" height="140%">
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

      <pattern id="dotPatternF" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.1" fill="#9ca3af" opacity="0.3" />
      </pattern>

      <radialGradient id="fadeMaskF" cx="0.1" cy="0.4" r="0.9">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>

      <mask id="meshMaskF">
        <rect width="400" height="600" fill="url(#fadeMaskF)" />
      </mask>

      <filter id="grainF">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.04" />
        </feComponentTransfer>
      </filter>
    </defs>

    <rect width="400" height="600" fill="#ffffff" />

    {/* Geometric shards */}
    <g filter="url(#thinShadowF)">
      <path d="M-50,100 L300,-150 L340,-120 L-10,130 Z" fill="#f8f8f8" />
      <path d="M-80,250 L200,0 L250,30 L-30,280 Z" fill="#f4f4f4" opacity="0.7" />
      <path d="M150,-50 L450,250 L480,220 L180,-80 Z" fill="#fbfbfb" />
      <path d="M250,100 L450,350 L500,310 L300,60 Z" fill="#f2f2f2" opacity="0.6" />
      <path d="M-100,450 L200,650 L250,620 L-50,420 Z" fill="#fafafa" />
      <path d="M100,350 L400,580 L440,540 L140,310 Z" fill="#f6f6f6" opacity="0.8" />
    </g>

    {/* Halftone mesh */}
    <g mask="url(#meshMaskF)">
      <rect width="400" height="600" fill="url(#dotPatternF)" />
    </g>

    {/* Surface grain */}
    <rect width="400" height="600" filter="url(#grainF)" pointerEvents="none" opacity="0.5" />
  </svg>
);

const CardFront = ({ data, inspectionId = "", orientation = "portrait" }) => {
  return (
    <div className={`card-modern ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      <FrontBgPattern />

      {/* LOGO */}
      <div className="card-logo-section-clean">
        <img src={logo} className="card-logo-modern" alt="Company Logo" />
      </div>

      {/* PHOTO */}
      <div className="card-photo-section">
        {data.photo ? (
          <img src={data.photo} className="employee-photo-modern" alt="Employee" />
        ) : (
          <div className="photo-placeholder-card"></div>
        )}
      </div>

      {/* FORM FIELDS */}
      <div className="form-table-modern">
        {[
          ["Serial No", data.serialNo],
          ["Employee Code", data.employeeCode],
          ["Employee Name", data.employeeName],
          ["Designation", data.designation],
          ["CNIC No", data.cnic],
          ["Inspection ID", inspectionId],
        ].map(([label, value]) => (
          <div className="table-row-modern" key={label}>
            <span className="table-label">{label}:</span>
            <span className="table-value">{value || ""}</span>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="card-footer-modern">
        <div className="footer-left">
          <strong>Deputed at: K-Electric</strong>
          <br />
          <strong>Limited</strong>
        </div>
        <div className="footer-right-adjusted">
          <img src={signature} className="authority-signature-modern" alt="Signature" />
          <div className="authority-label">Issue Authority</div>
        </div>
      </div>
    </div>
  );
};

export default CardFront;
