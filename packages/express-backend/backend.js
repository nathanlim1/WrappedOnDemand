import express from "express";
import axios from "axios";
import crypto from "crypto";
import cors from "cors";
import querystring from "querystring";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import UserData from "./models/UserData.js";
import {
  getTopNArtists,
  getTopNTracks,
  getTopNAlbums,
  getUsersGeneralGenrePercentage,
} from "./utils/spotifyUtils.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Developer parameters
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const mongoURI = process.env.MONGODB_URI;
const maxItems = 100; // max items to load from Spotify API calls

// const appFeUrl = process.env.PROD_FE_URL;
const appFeUrl = process.env.DEV_URL;


mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

// Generate a random string for state
const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

const stateKey = "spotify_auth_state";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app
  .use(express.static(path.join(__dirname, "public")))
  .use(cors({ origin: appFeUrl, credentials: true }))
  .use(cookieParser());

// Login route
app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // scope for apps api calls
  const scope =
    "user-read-private user-read-email user-library-read user-top-read user-library-modify playlist-modify-public playlist-modify-private";

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

    // get user profile information
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userProfile = userResponse.data;
    const spotifyId = userProfile.id;

    // check if user data exists in the database
    let userData = await UserData.findOne({ spotifyId });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (userData && userData.last_updated > oneDayAgo) {
      // user data is up-to-date, redirect to frontend with tokens
      console.log("User data is up-to-date");
      console.log(
        "Redirecting to frontend with tokens",
        access_token,
        refresh_token
      );
      res.redirect(
        `${appFeUrl}/home/#${querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        })}`
      );
    } else {
      // user data is either not up to date or does not exist
      const allArtists = {
        short_term: await getTopNArtists(access_token, maxItems, "short_term"),
        medium_term: await getTopNArtists(
          access_token,
          maxItems,
          "medium_term"
        ),
        long_term: await getTopNArtists(access_token, maxItems, "long_term"),
      };

      const allTracks = {
        short_term: await getTopNTracks(access_token, maxItems, "short_term"),
        medium_term: await getTopNTracks(access_token, maxItems, "medium_term"),
        long_term: await getTopNTracks(access_token, maxItems, "long_term"),
      };

      const allAlbums = {
        short_term: await getTopNAlbums(
          access_token,
          maxItems,
          allTracks.short_term
        ),
        medium_term: await getTopNAlbums(
          access_token,
          maxItems,
          allTracks.medium_term
        ),
        long_term: await getTopNAlbums(
          access_token,
          maxItems,
          allTracks.long_term
        ),
      };

      const genreCounts = {
        short_term: getUsersGeneralGenrePercentage(allArtists.short_term),
        medium_term: getUsersGeneralGenrePercentage(allArtists.medium_term),
        long_term: getUsersGeneralGenrePercentage(allArtists.long_term),
      };

      // save or update user data
      if (userData) {
        // update existing user data
        userData.accessToken = access_token;
        userData.refreshToken = refresh_token;
        userData.username = userProfile.display_name;
        userData.profilePicture =
          userProfile.images && userProfile.images.length > 0
            ? userProfile.images[0].url
            : null;
        userData.allArtists = allArtists;
        userData.allTracks = allTracks;
        userData.allAlbums = allAlbums;
        userData.genreCounts = genreCounts;
        userData.last_updated = Date.now();
      } else {
        // Create new user data
        userData = new UserData({
          spotifyId,
          accessToken: access_token,
          refreshToken: refresh_token,
          username: userProfile.display_name,
          profilePicture:
            userProfile.images && userProfile.images.length > 0
              ? userProfile.images[0].url
              : null,
          allArtists,
          allTracks,
          allAlbums,
          genreCounts,
          last_updated: Date.now(),
        });
      }

      try {
        await userData.save();
        console.log("User data saved successfully!");
      } catch (err) {
        console.error("Error saving user data:", err);
      }

      console.log("User data has been updated in database");
      console.log(
        "Redirecting to frontend with tokens",
        access_token,
        refresh_token
      );

      // redirect to frontend with tokens
      res.redirect(
        `${appFeUrl}/home/#${querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        })}`
      );
    }
  } catch (error) {
    console.error(
      "Error during token exchange:",
      error.response?.data || error.message
    );
    res.redirect(
      appFeUrl +
        "/home/#${" +
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

app.get("/user_data", async (req, res) => {
  const spotifyId = req.query.spotifyId;
  console.log("Getting stats for Spotify ID:", spotifyId);

  if (!spotifyId) {
    return res.status(400).json({ error: "spotifyId is required" });
  }

  try {
    const userData = await UserData.findOne({ spotifyId });

    if (userData) {
      res.json({
        username: userData.username,
        profilePicture: userData.profilePicture,
        allArtists: userData.allArtists,
        allTracks: userData.allTracks,
        allAlbums: userData.allAlbums,
        genreCounts: userData.genreCounts,
      });
    } else {
      console.log("User data not found in database");
      res.status(404).json({ error: "User data not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running");
}); 

// Catch-all for unimplemented routes
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start server using default of 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server Configuration Diagnostics:`);
  console.log(`Listening on PORT: ${PORT}`);
  console.log(`Full Environment Details:`);
  console.log(JSON.stringify(process.env, null, 2));
});

// Global error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "CRITICAL: Unhandled Rejection at:",
    promise,
    "reason:",
    reason
  );
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("CRITICAL: Uncaught Exception:", error);
  process.exit(1);
});
