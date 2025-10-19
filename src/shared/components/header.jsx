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
    <div className="flex justify-between items-center p-4 bg-green-500">
      <div className="flex gap-4 items-center">
        <Link to="/">Home</Link>
       {localStorage.token && <Link to="/vocal-news">VocalNews</Link>}
      </div>
      <div className="flex gap-4 items-center">
        {!localStorage.token && <Link to="/Register">Register</Link>}
        {!localStorage.token && <Link to="/Login">Login</Link>}
        {localStorage.token && (
          <Button
            onClick={handleLogout}
            className="bg-green-600 hover:bg-green-800  h-8  p-2 mt-0"
          >
            Log Out
          </Button>
        )}
      </div>
    </div>
  );
};
export default Header;
