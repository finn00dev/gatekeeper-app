/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import * as functions from "firebase-functions";
import {defineSecret} from "firebase-functions/params";
import {STATIC_ARTISTS} from "./static-artists";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const LASTFM_API_URL = "https://ws.audioscrobbler.com/2.0/";
const LASTFM_API_KEY_SECRET = defineSecret("LASTFM_API_KEY");

function getLastFmApiKey(): string | undefined {
  return process.env.LASTFM_API_KEY || LASTFM_API_KEY_SECRET.value();
}

export const getTodaysArtist = onCall({secrets: [LASTFM_API_KEY_SECRET]}, async (request) => {
  try {
    const timezone = request.data?.timezone;
    if (!timezone || typeof timezone !== "string") {
      throw new functions.https.HttpsError("invalid-argument", "timezone is required");
    }

    let dateString: string;
    try {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(new Date());

      const year = parts.find((p) => p.type === "year")?.value;
      const month = parts.find((p) => p.type === "month")?.value;
      const day = parts.find((p) => p.type === "day")?.value;

      if (!year || !month || !day) {
        throw new Error("Failed to derive date parts");
      }

      dateString = `${year}${month}${day}`;
    } catch (e) {
      throw new functions.https.HttpsError("invalid-argument", "Invalid timezone");
    }

    const index = Number(dateString) % STATIC_ARTISTS.length;
    const artistName = STATIC_ARTISTS[index];

    return {data: artistName};
  } catch (error) {
    logger.error("Error in getTodaysArtist:", error);
    throw new functions.https.HttpsError("internal", "Failed to get today's artist");
  }
});

export const checkGuess = onCall({secrets: [LASTFM_API_KEY_SECRET]}, async (request) => {
  const artistName = request.data.artistName;
  const songName = request.data.songName;

  if (!artistName || typeof artistName !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "artistName is required");
  }

  if (!songName || typeof songName !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "songName is required");
  }

  try {
    const apiKey = getLastFmApiKey();
    if (!apiKey) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Last.fm API key is not configured",
      );
    }

    const response = await axios.get(
      `${LASTFM_API_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json&limit=250`,
    );

    const tracks = response.data.toptracks?.track || [];
    const normalizedGuess = songName.trim();

    const isCorrect = tracks.some((track: any) => {
      const name = (track?.name ?? "").toString().trim();
      return name === normalizedGuess;
    });

    return {data: isCorrect};
  } catch (error) {
    logger.error("Error in checkGuess:", error);
    throw new functions.https.HttpsError("internal", "Failed to check guess");
  }
});

export const getSuggestions = onCall({secrets: [LASTFM_API_KEY_SECRET]}, async (request) => {
  const searchTerm = request.data.searchTerm;

  if (!searchTerm || typeof searchTerm !== "string") {
    throw new functions.https.HttpsError("invalid-argument", "searchTerm is required");
  }

  try {
    const apiKey = getLastFmApiKey();
    if (!apiKey) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Last.fm API key is not configured",
      );
    }

    const response = await axios.get(
      `${LASTFM_API_URL}?method=track.search&track=${encodeURIComponent(searchTerm)}&api_key=${apiKey}&format=json&limit=6`,
    );

    const songs = response.data.results?.trackmatches?.track || [];
    const songNames = songs.map((song: any) => song.name);

    const seen = new Set<string>();
    const dedupedSongNames = songNames.filter((name: unknown) => {
      if (typeof name !== "string") return false;
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    return {data: dedupedSongNames};
  } catch (error) {
    logger.error("Error in getSuggestions:", error);
    throw new functions.https.HttpsError("internal", "Failed to get suggestions");
  }
});
