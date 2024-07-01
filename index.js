const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const cors = require('cors'); // Import cors module
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

// Use CORS middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML file for submitting news
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to submit news
app.post('/submit-news', (req, res) => {
  const { childName, title, desc, newslink, imagelink } = req.body;

  if (!childName) {
    return res.status(400).send('Child name is required.');
  }

  const newNewsRef = newsRef.child(childName);
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
    console.error('Error adding news:', error.message);
    res.status(500).send('Error adding news: ' + error.message);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
