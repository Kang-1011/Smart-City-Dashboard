/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions/v2");
const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
// const logger = require("firebase-functions/logger");

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

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

/**
 * Scheduled function to generate new sensor data at regular intervals.
 *   A ScheduleBuilder object, which can be used to define the schedule.
 */
exports.scheduledSensorGenerator = onSchedule("*/1 * * * *", async () => {
  // List of zones
  const zones = ["Downtown", "Suburbs", "Industrial"];

  // Minimum and maximum values for each sensor type
  const MIN_MAX = {
    temperature: {min: 15, max: 35},
    aqi: {min: 10, max: 350},
    traffic: {min: 0, max: 200},
  };

  /**
   * Get the latest sensor reading for a given zone.
   * @param {string} zone The zone to retrieve sensor data for.
   * @returns {Promise<{[key: string]: number}>} An object containing the
   *   latest sensor reading, with keys for temperature, aqi, and traffic.
   */
  const getLatestForZone = async (zone) => {
    const snapshot = await db
        .collection("sensors")
        .where("zone", "==", zone)
        .orderBy("timestamp", "desc")
        .limit(1)
        .get();

    if (snapshot.empty) {
      // If no existing data, return safe default values
      return {
        temperature: 25,
        aqi: 100,
        traffic: 50,
      };
    }

    return snapshot.docs[0].data();
  };

  /**
   * Generate a new value by adding a small delta to the previous value.
   * @param {number} value The previous value.
   * @param {number} min The minimum value for this type of sensor.
   * @param {number} max The maximum value for this type of sensor.
   * @param {number} range The range within which the delta is generated.
   * @returns {number} The new value.
   */
  const fluctuate = (value, min, max, range) => {
    const delta = (Math.random() * range * 2 - range);
    const newValue = Math.round((value + delta) * 10) / 10;
    return Math.max(min, Math.min(max, newValue));
  };

  // Generate new sensor data for each zone
  for (const zone of zones) {
    const latest = await getLatestForZone(zone);

    const newReading = {
      zone,
      temperature: fluctuate(latest.temperature, MIN_MAX.temperature.min,
          MIN_MAX.temperature.max, 0.25),
      aqi: Math.round(fluctuate(latest.aqi, MIN_MAX.aqi.min, MIN_MAX.aqi.max,
          2.5)),
      traffic: Math.round(fluctuate(latest.traffic, MIN_MAX.traffic.min,
          MIN_MAX.traffic.max, 20)),
      timestamp: new Date(),
    };

    // Add the new sensor data to the database
    await db.collection("sensors").add(newReading);
    console.log(`Added sensor data for ${zone}:`, newReading);
  }

  return null;
});

const cors = require("cors")({origin: true});

// Get latest {limit} sensor readings by zone
/**
 * Get the latest {limit} sensor readings for a given zone.
 * @param {string} zone The zone to retrieve sensor data for.
 * @param {number} limit The number of sensor readings to retrieve. Defaults to 1.
 * @return {Promise<[]>} An array of sensor readings, with each reading containing
 *   the zone, temperature, aqi, traffic, and timestamp.
 */
exports.getLatestSensorReadings = onRequest(async (req, res) => {
  cors(req, res, async () => {
    const zone = req.query.zone;
    const limit = parseInt(req.query.limit) || 1;

    if (!zone) {
      // 400 Bad Request
      res.status(400).send({message: "Missing 'zone' parameter"});
      return;
    }

    try {
      const snapshot = await db
          .collection("sensors")
          .where("zone", "==", zone)
          .orderBy("timestamp", "desc")
          .limit(limit)
          .get();

      if (snapshot.empty) {
        // 404 Not Found
        res.status(404).send({
          message: "No data found",
        });
        return;
      }

      const data = snapshot.docs.map((doc) => doc.data());
      // 200 OK
      res.status(200).send(data);
    } catch (err) {
      // 500 Internal Server Error
      res.status(500).send({
        error: err.message,
      });
    }
  });
});
