import "./leftBar.scss";
import Friends from '@mui/icons-material/PeopleOutlined';
import Groups from '@mui/icons-material/GroupsOutlined';
import Watch from '@mui/icons-material/MovieOutlined';
import Memories from '@mui/icons-material/WatchLaterOutlined';
import Messages from '@mui/icons-material/ForumOutlined';
import Profile from '@mui/icons-material/AccountCircleOutlined';
import LogoutOut from '@mui/icons-material/LogoutOutlined';
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="item">
            <Profile />
            <Link
              to={`/profile/${currentUser.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Profile</span>
            </Link>
          </div>
          <div className="item">
            <LogoutOut />
            <Link
              onClick={handleLogout}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;