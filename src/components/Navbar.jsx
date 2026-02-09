import { useState } from "react";
import logo from "../assets/Icon.png";
import { Plus, ChevronDown, LogOut, ArrowLeft } from "lucide-react";

const Navbar = ({ onNavigateToCreate, onNavigateToDashboard, onLogout, user, title, subtitle, showBack, showCreate }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {showBack && onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div
              className={`flex items-center gap-3 ${!showBack ? 'cursor-pointer' : ''}`}
              onClick={() => !showBack && window.location.reload()}
            >
              <img src={logo} alt="Logo" className="h-9 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">
                  {title || "Office Duty Cards"}
                </h1>
                <p className="text-xs text-gray-500">
                  {subtitle || "Management System"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {showCreate && onNavigateToCreate && (
              <button
                onClick={onNavigateToCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
              >
                <Plus size={18} strokeWidth={2.5} />
                <span className="hidden sm:inline">Create New Card</span>
              </button>
            )}

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                    {user.email?.[0]?.toUpperCase() || "A"}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
                  />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-slide-down">
                      <div className="p-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                      </div>
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      >
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
      </div>
    </nav>
  );
};

export default Navbar;
