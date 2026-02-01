const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="spinner"></div>
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
