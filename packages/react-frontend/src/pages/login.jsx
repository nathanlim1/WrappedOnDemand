import '../index.css';
import { Link } from 'react-router-dom';

// Basic Login page for when the website is first opened
// Every refresh requires a new login in for now
// Probably want to fix that in the future but not awful

function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1ED760] via-[#17c152] to-green-950">
      <div className="flex flex-col items-center text-black">
        <div className="flex items-center mb-4">
          <img 
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png" 
            alt="Spotify Logo" 
            className="w-10 h-10 mr-3" // Adjust width and height as needed
          />
          <h1 className="text-5xl font-bold">Spotify Stat Tracker</h1>
        </div>
        <p className="text-lg mb-8">Uncover your music journey: Top artists, favorite tracks, and much more.</p>
        <p className="text-sm mb-2">Link your Spotify account to begin.</p>

        <Link to="http://localhost:8000/login">
          <button
            className="bg-zinc-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:shadow-xl focus:outline-none hover:text-[#00FF7F]"
            style={{ border: 'none' }}
          >
            Link My Spotify
          </button>
        </Link>
      </div>
    </div>
  );
}


export default Login;
