import "./leftBar.scss";
import Friends from '@mui/icons-material/PeopleOutlined';
import Groups from '@mui/icons-material/GroupsOutlined';
import Watch from '@mui/icons-material/MovieOutlined';
import Memories from '@mui/icons-material/WatchLaterOutlined';
import Messages from '@mui/icons-material/ForumOutlined';

export const LeftBar = () => {

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="item">
            <Messages />
            <span>Messages</span>
          </div>
          <div className="item">
            <Friends />
            <span>Friends</span>
          </div>
          <div className="item">
            <Groups />
            <span>Groups</span>
          </div>
          <div className="item">
            <Watch />
            <span>Watch</span>
          </div>
          <div className="item">
            <Memories />
            <span>Memories</span>
          </div>
        </div>
      </div>
    </div>
  );
};