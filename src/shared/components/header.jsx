import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/Login");
  };
  
  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo/Brand and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand/Logo - Clickable to Home */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VN</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">VocalNews</span>
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              {localStorage.token && (
                <Link 
                  to="/vocal-news" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium hover:bg-gray-800/50 px-3 py-2 rounded-md"
                >
                  🎧 VocalNews
                </Link>
              )}
            </nav>
          </div>

          {/* Right side - Auth Actions */}
          <div className="flex items-center space-x-4">
            {!localStorage.token ? (
              <>
                <Link 
                  to="/Register" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium hover:bg-gray-800/50 px-4 py-2 rounded-md"
                >
                  Register
                </Link>
                <Link 
                  to="/Login" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-200 shadow-sm"
                >
                  Login
                </Link>
              </>
            ) : (
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
              >
                ✨ Log Out
              </Button>
            )}
          </div>

          {/* Mobile menu button - for future mobile nav implementation */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
