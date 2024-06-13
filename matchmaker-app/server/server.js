require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const multer = require('multer');
// const upload = multer({ storage: storage });

const PORT = process.env.PORT || 4000;

const attendeeController = require('./controllers/attendeeController');

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.json()); //body-parser
app.use(express.urlencoded({ extended: true }));
app.use(
  multer({
    storage: multer.memoryStorage(),
  }).any()
);
// app.use(
//   multer({
//     storage: multer.memoryStorage(),
//   }).any()
// );
//cookie-parser?

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);
mongoose.connection.once('open', () => {
  console.log('Database connected');
});
mongoose.connection.on('error', (err) => {
  console.error('connection error:', err);
});

app.get(
  '/getAllAttendees/:date',
  attendeeController.getAttendeesFromEvent,
  attendeeController.sortTeams,
  (req, res) => {
    //send back an object with keys: list, team1, team2
    const teamList = res.locals.teamList;
    console.log(`here is what we're sending back: `, teamList);
    res.status(200).json(teamList);
  }
);

app.put('/addVotes', attendeeController.addVotesForAttendee, (req, res) => {
  console.log('CSV processed...');
  const attendeeList = res.locals.attendeeList;
  res.status(200).send('added: ' + attendeeList);
});

app.post('/addList', attendeeController.addListFromCSV, (req, res) => {
  console.log('CSV processed...');
  const attendeeList = res.locals.attendeeList;
  res.status(200).send('added: ' + attendeeList);
});

// app.post('/addAttendee', attendeeController.addAttendee, (req, res) => {
//   console.log('back from DB');
//   const newAttendee = res.locals.newAttendee;
//   res.status(200).json(newAttendee);
// });

// app.delete('/deleteDB', attendeeController.eraseDB, (req, res) => {
//   console.log('back from DB');
//   res.status(200).send('all gone!');
// });

app.get(
  '/getMatches/:date',
  attendeeController.getAttendeesFromEvent,
  attendeeController.retrieveMatches,
  (req, res) => {
    console.log('matches processed...', res.locals.matches);
    //  const attendeeList = res.locals.attendeeList;
    res.status(200).send(res.locals.matches);
  }
);

//Serving Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//Wildcard 404
app.use('*', (req, res) => {
  res.status(404).send("Uh, looks like you're outta bounds...");
});

//Global Error Handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).send(errorObj.message);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

// module.exports = app;
