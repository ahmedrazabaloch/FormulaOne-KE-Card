const EmployeeForm = ({ onChange, errors = {}, values = {} }) => {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const formatMonthYear = (value) => {
    // value is YYYY-MM from <input type="month">
    if (!value) return "";
    const [y, m] = value.split("-").map(Number);
    const month = monthNames[(m || 1) - 1];
    return `${month}-${y}`;
  };

  const addOneYear = (value) => {
    if (!value) return "";
    const [y, m] = value.split("-").map(Number);
    const date = new Date(y, (m || 1) - 1, 1);
    date.setFullYear(date.getFullYear() + 1);
    const fy = date.getFullYear();
    const fm = date.getMonth() + 1; // 1-12
    const mm = fm.toString().padStart(2, "0");
    return formatMonthYear(`${fy}-${mm}`);
  };

  const handleChange = (e) => {
    onChange((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Auto-format CNIC as user types: 00000-0000000-0
  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    if (value.length > 13) {
      value = value.slice(0, 13); // Max 13 digits
    }
    
    // Format: 5 digits, dash, 7 digits, dash, 1 digit
    let formatted = '';
    if (value.length > 0) {
      formatted = value.slice(0, 5); // First 5 digits
    }
    if (value.length > 5) {
      formatted += '-' + value.slice(5, 12); // Add dash + next 7 digits
    }
    if (value.length > 12) {
      formatted += '-' + value.slice(12, 13); // Add dash + last digit
    }
    
    onChange((prev) => ({ ...prev, cnic: formatted }));
  };

  return (
    <div className="card-box">
      <h3>Employee Card (Front)</h3>
      <div className="field">
        <label>Employee Photo</label>
        <div className="file-input-row">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                onChange((prev) => ({ ...prev, photo: reader.result }));
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {values.photo && (
          <img src={values.photo} alt="Preview" className="thumb-preview" />
        )}
        </div>
      </div>

      <div className="grid">
        {[
          ["Serial No", "serialNo", "text"],
          ["Employee Code", "employeeCode", "text"],
          ["Employee Name", "employeeName", "text"],
          ["Designation", "designation", "text"],
          ["CNIC No", "cnic", "text"],
          ["Licence No", "licenceNo", "text"],
          ["Licence Category", "licenceCategory", "text"],
          ["Licence Validity", "licenceValidity", "month"],
          ["Date of Issue", "dateOfIssue", "month"],
          ["Valid Upto", "validUpto", "month"],
        ].map(([label, name, type]) => (
          <div className="field" key={name}>
            <label>{label}</label>
            {type !== 'month' ? (
              <input 
                type={type}
                name={name} 
                value={values[name] || ''}
                onChange={name === 'cnic' ? handleCNICChange : handleChange} 
                className={errors[name] ? 'input-error' : ''} 
                placeholder={name === 'cnic' ? '00000-0000000-0' : ''}
                maxLength={name === 'cnic' ? 15 : undefined}
              />
            ) : (
              <input
                type="month"
                name={name}
                value={(values[name] && /^[A-Za-z]{3}-\d{4}$/.test(values[name])) ?
                  // convert display MMM-YYYY back to YYYY-MM for input control
                  (() => {
                    const [mm, yy] = values[name].split('-');
                    const idx = monthNames.indexOf(mm) + 1;
                    const m2 = idx.toString().padStart(2, '0');
                    return `${yy}-${m2}`;
                  })() : (values[name] || '')}
                onChange={(e) => {
                  const raw = e.target.value; // YYYY-MM
                  const formatted = formatMonthYear(raw);
                  // auto set counterparts
                  if (e.target.name === 'dateOfIssue') {
                    const autoValid = addOneYear(raw);
                    onChange(prev => ({ ...prev, dateOfIssue: formatted, validUpto: autoValid }));
                  } else if (e.target.name === 'validUpto') {
                    onChange(prev => ({ ...prev, validUpto: formatted }));
                  } else if (e.target.name === 'licenceValidity') {
                    onChange(prev => ({ ...prev, licenceValidity: formatted }));
                  }
                }}
                className={errors[name] ? 'input-error' : ''}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeForm;
