const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-app-2e06d.firebaseio.com"
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/check-user', async (req, res) => {
  const { uid, email, phone } = req.body;
  
  if (email) {
    const q = await db.collection('users').where('email', '==', email).get();
    if (!q.empty) return res.status(400).json({ message: 'User exists, please login.' });
  }
  if (phone) {
    const q = await db.collection('users').where('phone', '==', phone).get();
    if (!q.empty) return res.status(400).json({ message: 'User exists, please login.' });
  }

  await db.collection('users').doc(uid).set({
    email: email || null,
    phone: phone || null,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  res.json({ message: 'User created.' });
});

app.listen(4000, () => console.log('Backend listening on port 4000'));
