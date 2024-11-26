const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Developer parameters
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Generate a random string for state
const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

const stateKey = "spotify_auth_state";

const app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

// Login route
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // Define the scope
  const scope =
    "user-read-private user-read-email user-library-read user-top-read user-library-modify";

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  console.log("Redirecting to Spotify with the following parameters:");
  console.log(queryParams);

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

// Callback route
app.get("/callback", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
    return;
  }

  res.clearCookie(stateKey);

  const authOptions = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    data: querystring.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
  };

  try {
    console.log("Received code:", code);
    console.log("Received state:", state);

    const response = await axios(authOptions);
    const { access_token, refresh_token } = response.data;

    // Use the access token to access the Spotify Web API
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log(userResponse.data);

    // Pass the token to the browser
    const redirectParams = querystring.stringify({
      access_token: access_token,
      refresh_token: refresh_token,
    });

    res.redirect(`http://localhost:5173/home/#${redirectParams}`);
  } catch (error) {
    console.error(
      "Error during token exchange:",
      error.response?.data || error.message
    );
    res.redirect(
      "http://localhost:5173/home/#" +
        querystring.stringify({
          error: "invalid_token",
        })
    );
  }
});

// Refresh token route
app.get("/refresh_token", async (req, res) => {
  const refresh_token = req.query.refresh_token;

  const authOptions = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }),
  };

  try {
    const response = await axios(authOptions);
    const { access_token, refresh_token: new_refresh_token } = response.data;

    res.send({
      access_token: access_token,
      refresh_token: new_refresh_token || refresh_token, // Spotify may not return a new refresh token
    });
  } catch (error) {
    console.error(
      "Error refreshing token:",
      error.response?.data || error.message
    );
    res.status(400).send({ error: "Failed to refresh token" });
  }
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
