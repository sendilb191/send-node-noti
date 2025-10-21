process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import admin from "firebase-admin";
import fs from "fs";
import { deviceTokens } from "./constants.js"; // array of tokens

const isProduction = process.env.NODE_ENV === "production";

let serviceAccount;

if (isProduction) {
  // Use secret from GitHub Actions
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  console.log("Using service account from GitHub Secrets");
} else {
  // Use local file for development
  serviceAccount = JSON.parse(
    fs.readFileSync("./service-account.json", "utf8")
  );
  console.log("Using local service-account.json");
}

// Load your service account key file
// const serviceAccount = JSON.parse(
//   fs.readFileSync("service-account.json", "utf8")
// );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const message = {
  notification: {
    title: "Good Morning 🌅",
    body: "Here's your daily update!",
  },
  tokens: deviceTokens, // array of tokens
};

admin
  .messaging()
  .sendEachForMulticast(message)
  .then((response) => {
    console.log(`✅ Sent to ${response.successCount} devices`);
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(
            `❌ Failed to send to ${deviceTokens[idx]}:`,
            resp.error
          );
        }
      });
    }
  })
  .catch((error) => {
    console.error("🔥 Error sending notifications:", error);
  });
