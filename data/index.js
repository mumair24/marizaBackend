var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://mariza-a3fbd.appspot.com",
});

module.exports = admin;