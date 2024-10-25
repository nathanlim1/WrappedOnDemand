import '../App.css'
import { Link } from 'react-router-dom';

// Basic Login page for when the website is first opened
// Every refresh requires a new login in for now
// Probably want to fix that in the future but not awful
function Login() {
  return (
    <>
      <h2>Welcome to the Spotify Stat Tracker</h2>
      <p>Log into your spotify account to begin</p>
      
      <Link to="http://localhost:8000/login">
        <button>Login to Spotify</button>
      </Link>
    </>
  )
}

export default Login