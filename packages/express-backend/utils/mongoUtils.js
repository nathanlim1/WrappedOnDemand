import UserArtists from "../models/UserArtists.js";
import UserTracks from "../models/UserTracks.js";
import UserAlbums from "../models/UserAlbums.js";
import UserGenreCounts from "../models/UserGenreCounts.js";

export async function createOrUpdateUserArtists(userData, term, data) {
  console.log("Creating or updates user artists data");
  let userArtistsId = userData.allArtists[term];
  if (userArtistsId) {
    let userArtists = await UserArtists.findById(userArtistsId);
    if (userArtists) {
      userArtists.data = data;
      await userArtists.save();
    } else {
      const newUserArtists = new UserArtists({
        user: userData._id,
        term: term,
        data: data,
      });
      await newUserArtists.save();
      userData.allArtists[term] = newUserArtists._id;
    }
  } else {
    const newUserArtists = new UserArtists({
      user: userData._id,
      term: term,
      data: data,
    });
    await newUserArtists.save();
    userData.allArtists[term] = newUserArtists._id;
  }
}

export async function createOrUpdateUserTracks(userData, term, data) {
  console.log("Creating or updates user tracks data");
  let userTracksId = userData.allTracks[term];
  if (userTracksId) {
    let userTracks = await UserTracks.findById(userTracksId);
    if (userTracks) {
      userTracks.data = data;
      await userTracks.save();
    } else {
      const newUserTracks = new UserTracks({
        user: userData._id,
        term: term,
        data: data,
      });
      await newUserTracks.save();
      userData.allTracks[term] = newUserTracks._id;
    }
  } else {
    const newUserTracks = new UserTracks({
      user: userData._id,
      term: term,
      data: data,
    });
    await newUserTracks.save();
    userData.allTracks[term] = newUserTracks._id;
  }
}

export async function createOrUpdateUserAlbums(userData, term, data) {
  console.log("Creating or updates user albums data");
  let userAlbumsId = userData.allAlbums[term];
  if (userAlbumsId) {
    let userAlbums = await UserAlbums.findById(userAlbumsId);
    if (userAlbums) {
      userAlbums.data = data;
      await userAlbums.save();
    } else {
      const newUserAlbums = new UserAlbums({
        user: userData._id,
        term: term,
        data: data,
      });
      await newUserAlbums.save();
      userData.allAlbums[term] = newUserAlbums._id;
    }
  } else {
    const newUserAlbums = new UserAlbums({
      user: userData._id,
      term: term,
      data: data,
    });
    await newUserAlbums.save();
    userData.allAlbums[term] = newUserAlbums._id;
  }
}

export async function createOrUpdateUserGenreCounts(userData, term, data) {
  console.log("Creating or updates user genres data");
  let userGenreCountsId = userData.genreCounts[term];
  if (userGenreCountsId) {
    let userGenreCounts = await UserGenreCounts.findById(userGenreCountsId);
    if (userGenreCounts) {
      userGenreCounts.data = data;
      await userGenreCounts.save();
    } else {
      const newUserGenreCounts = new UserGenreCounts({
        user: userData._id,
        term: term,
        data: data,
      });
      await newUserGenreCounts.save();
      userData.genreCounts[term] = newUserGenreCounts._id;
    }
  } else {
    const newUserGenreCounts = new UserGenreCounts({
      user: userData._id,
      term: term,
      data: data,
    });
    await newUserGenreCounts.save();
    userData.genreCounts[term] = newUserGenreCounts._id;
  }
}
