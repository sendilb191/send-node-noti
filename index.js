process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import admin from "firebase-admin";
import fs from "fs";
import { sendil_laptop_local_token } from "./contants";

// Load your service account key file
const serviceAccount = JSON.parse(
  fs.readFileSync("service-account.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const message = {
  token: sendil_laptop_local_token,
  notification: {
    title: "Good Morning 🌅",
    body: "Here's your daily update!",
  },
};

admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.error("Error sending message:", error);
  });
