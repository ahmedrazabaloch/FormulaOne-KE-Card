import logo from "../assets/logo.png";
import signature from "../assets/authority-signature.png";

const CardFront = ({ data, inspectionId = "", orientation = "portrait" }) => {
  return (
    <div className={`card-modern ${orientation === 'portrait' ? 'card-portrait' : ''}`}>
      {/* LOGO - Centered, no divider */}
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

      {/* FORM FIELDS - Table Layout */}
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

      {/* FOOTER - Two Column, Authority more centered */}
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
