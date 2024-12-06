# How to Setup your Environment to Contribute

### Steps
1. Clone the repository
2. Install npm if necessary
3. Run 'npm install all' to install all the necessary packages
4. Run npm start in the root to start the backend and frontend


You will also need to create a .env file referencing correct credentials from Spotify and MongoDB.

We do not provide real credentials on this page. Please ask a current developer for accurate credentials or provide your own if you would like to contribute.

Example .env file:

```
SPOTIFY_CLIENT_ID=1234abcd1234abcd
SPOTIFY_CLIENT_SECRET=1234abcd1234abcd
SPOTIFY_REDIRECT_URI=http://localhost:8000/callback
MONGODB_URI=mongodb+srv://notreal.net/appName=notreal
DEV_URL=http://localhost:5173
PROD_FE_URL=https://notreal.net
```

This .env file must be placed in the express-backend directory of the project.
(packages/express-backend/.env)
