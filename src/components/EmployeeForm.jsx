const EmployeeForm = ({ onChange, errors = {}, values = {} }) => {
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
          ["Licence Validity", "licenceValidity", "text"],
          ["Date of Issue", "dateOfIssue", "date"],
          ["Valid Upto", "validUpto", "date"],
        ].map(([label, name, type]) => (
          <div className="field" key={name}>
            <label>{label}</label>
            <input 
              type={type}
              name={name} 
              value={values[name] || ''}
              onChange={name === 'cnic' ? handleCNICChange : handleChange} 
              className={errors[name] ? 'input-error' : ''} 
              placeholder={name === 'cnic' ? '00000-0000000-0' : type === 'date' ? 'yyyy-mm-dd' : ''}
              maxLength={name === 'cnic' ? 15 : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeForm;
