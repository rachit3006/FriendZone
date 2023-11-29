import { Link } from 'react-router-dom'
import './register.scss'

export const Register = () => {
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Friend Zone.</h1>
          <p>
          Connect with friends and the world. Log in to your FriendZone account and share your moments effortlessly.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <input type="text" placeholder="Name" />
            <button>Register</button>
          </form>
        </div>
      </div>
    </div>
  )
}
