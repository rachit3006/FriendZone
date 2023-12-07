import './navbar.scss'
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';

const Navbar = () => {

  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: ""
  });

  const handleChange = (e) => {
    setInputs((prev) => ({ [e.target.name]: e.target.value }));
  };

  const { isLoading, error, data , refetch} = useQuery({queryKey:["username"], queryFn:() =>
      makeRequest.post("/auth/search/",{"name": inputs.name}).then((res) => {
        return res.data;
      }),
      enabled: false
  });

  const search = () => {
    if(!error){
      navigate("/profile/"+data["id"]);
    }
  }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>FriendZone</span>
        </Link>
        <Link to="/" style={{ textDecoration: "none" }}>
          <HomeOutlinedIcon />
        </Link>
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} /> : <DarkModeOutlinedIcon onClick={toggle}/>}
        <div className="search">
        <button onClick={() => {refetch();search();}}><SearchOutlinedIcon /></button>
          <input type="text" name="name" placeholder="Search ..." onChange={handleChange}/>
        </div>
      </div>
      <div className="right">
        {/* <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon /> */}
        <div className="user">
          <img
            src = {currentUser.profilePic}
            alt=""
          />
          <span>{currentUser.name}</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar;