import { Link } from 'react-router-dom'
import './login.scss'
import { AuthContext } from '../../context/authContext'
import { useContext } from 'react'

export const Login = () => {
  const {login} = useContext(AuthContext)

  const handleLogin = () => {
    login();
  }

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Friend Zone.</h1>
          <p>
          Connect with friends and the world. Log in to your FriendZone account and share your moments effortlessly.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
          <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
