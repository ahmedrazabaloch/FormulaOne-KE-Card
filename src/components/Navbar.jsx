import { useState } from "react";
import logo from "../assets/Icon.png";
import { Plus, ChevronDown, LogOut, ArrowLeft } from "lucide-react";

const Navbar = ({ onNavigateToCreate, onNavigateToDashboard, onLogout, user, title, subtitle, showBack, showCreate }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="navbar">
      <div className="navbar-left">
        {showBack && onNavigateToDashboard && (
          <button
            className="navbar-back-btn"
            onClick={onNavigateToDashboard}
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
        )}
        <div className="navbar-brand" onClick={() => !showBack && window.location.reload()} style={{ cursor: showBack ? "default" : "pointer" }}>
          <img src={logo} alt="Logo" className="navbar-logo" />
          <div className="navbar-text">
            <h1>{title || "Office Duty Cards"}</h1>
            <p>{subtitle || "Management System"}</p>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {showCreate && onNavigateToCreate && (
          <button className="navbar-create-btn" onClick={onNavigateToCreate}>
            <Plus size={18} strokeWidth={2.5} />
            Create New Card
          </button>
        )}

        {user && (
          <div className="navbar-user-wrapper">
            <button
              className="navbar-user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="navbar-avatar">
                {user.email?.[0]?.toUpperCase() || "A"}
              </div>
              <ChevronDown className={`navbar-chevron ${showUserMenu ? "open" : ""}`} size={16} />
            </button>

            {showUserMenu && (
              <>
                <div className="navbar-menu-backdrop" onClick={() => setShowUserMenu(false)} />
                <div className="navbar-dropdown">
                  <div className="navbar-user-info">
                    <div className="navbar-user-email">{user.email}</div>
                    <div className="navbar-user-role">Administrator</div>
                  </div>
                  <div className="navbar-divider"></div>
                  <button className="navbar-dropdown-item" onClick={onLogout}>
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
