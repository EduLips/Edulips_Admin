// app.js

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { firebaseConfig } = require('./constants');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: `https://edushort-cce1c-default-rtdb.firebaseio.com/`
});

const db = admin.database();
const newsRef = db.ref('News');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file for submitting news
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint to submit news
app.post('/submit-news', (req, res) => {
  const { childName, title, desc, newslink, imagelink } = req.body;

  if (!childName) {
    return res.status(400).send('Child name is required.');
  }

  const newNewsRef = newsRef.child(childName); // Use the custom child name here
  newNewsRef.set({
    title: title,
    desc: desc,
    newslink: newslink,
    imagelink: imagelink
  })
  .then(() => {
    res.send('News added successfully!');
  })
  .catch((error) => {
    res.status(500).send('Error adding news: ' + error.message);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
