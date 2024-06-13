const path = require('path');
const { Readable } = require('stream');
const csv = require('csv-parser');
const fs = require('fs');
const Attendee = require('../../src/models/attendeeModel');

// console.log(process.env.MONGO_URI);
/**
 * firstName: 'Grace',
    lastName: 'Deal',
    email: 'graceedeal@gmail.com',
    phoneNumber: '9372320243',
    eventName: 'Matchmaker May',
    ticketType: 'Woman (Straight)'
    votes: [],
    matches: [],
  */

const attendeeController = {
  addAttendee: async (req, res, next) => {
    try {
      console.log(req.body);
      const newAttendee = await Attendee.create({
        ...req.body,
      });
      console.log('Success, new build saved:');
      console.log(newAttendee);
      res.locals.newAttendee = newAttendee;
      return next();
    } catch (err) {
      return next({
        log: 'Unable to create a new attendee in Mongo; addAttendee()',
        status: 400,
        message: { err: 'Unable to save attendee in Database' },
      });
    }
  },

  addListFromCSV: async (req, res, next) => {
    try {
      if (req.files[0].mimetype !== 'text/csv') return next();
      // return res.status(400).send('Invalid file type. Please upload a CSV file.');

      // const myCSV = req.files[0].buffer.toString(); //if I wanted the CSV as a string
      const attendees = [];
      const sanitizedAttendees = [];
      const myCSV = req.files[0].buffer;
      const stream = Readable.from(myCSV);
      // const stream = require('stream');
      // const bufferStream = new stream.PassThrough();
      // bufferStream.end(req.file.buffer);

      // fs.createReadStream(myCSV) //cant use because it requires a separate file to pull from (fs = file storage)
      stream
        .pipe(csv())
        .on('data', (data) => attendees.push(data))
        .on('end', async () => {
          for (let attendee of attendees) {
            const { firstName, lastName, email, phoneNumber, ticketType } =
              attendee;

            const sanitizedInfo = {
              name: `${firstName} ${lastName}`,
              email: email,
              number: phoneNumber,
              party: ticketType === 'Men' ? 'Team1' : 'Team2',
              date: req.body.date,
              votes: [],
              matches: [],
            };

            sanitizedAttendees.push(sanitizedInfo);
          }
          console.log('sani: ', sanitizedAttendees);
          const attendeeList = await Attendee.insertMany(sanitizedAttendees);
          console.log('Success, Attendee List added:');
          console.log(attendeeList);
          res.locals.attendeeList = attendeeList;
          return next();
        });
    } catch (err) {
      return next({
        log: 'Unable to create a new attendee in Mongo; addAttendee()',
        status: 400,
        message: { err: 'Unable to save attendee in Database' },
      });
    }
  },

  getAttendeesFromEvent: async (req, res, next) => {
    const attendeeList = await Attendee.find({ date: req.params.date });
    console.log('Success, Attendee List retrieved:');
    // console.log(attendeeList);
    res.locals.attendeeList = attendeeList;
    // console.log(res.locals.attendeeList);
    return next();
  },

  sortTeams: async (req, res, next) => {
    const teamList = { team1: [], team2: [] };
    for (let attendee of res.locals.attendeeList) {
      attendee.party === 'Team1'
        ? teamList.team1.push(attendee)
        : teamList.team2.push(attendee);
    }
    console.log('Teams Sorted');
    res.locals.teamList = {
      attendeeList: res.locals.attendeeList,
      ...teamList,
    };
    return next();
  },

  addVotesForAttendee: async (req, res, next) => {
    console.log(req.body);
    const updated = await Attendee.findOneAndUpdate(
      { name: req.body.person, date: req.body.date },
      { votes: req.body.votes },
      { returnDocument: 'after' }
    );
    console.log('Success, votes updated: ', updated);
    return next();
  },

  retrieveMatches: async (req, res, next) => {
    console.log('lets retrieve:');

    const matches = {};
    const voteCache = {};
    //pull all attendees from a given date (already done in ^getAttendees)
    //create object that pairs an attendee's name to their user info and create empter match list for each
    for (let attendee of res.locals.attendeeList) {
      voteCache[attendee.name] = attendee.votes;
      matches[attendee.name] = [];
    }

    for (let userName in voteCache) {
      //userName = 'Grace Deal'
      //first look at their matches and see if they're in there.. if so skip
      for (let voteName of voteCache[userName]) {
        //voteName = 'Christopher' of ['Christopher', 'Jeffrey C'
        // else O(1) at the attendee they voted for and see if they're in there
        console.log(`${userName} likes ${voteName}`);
        if (voteCache[voteName].includes(userName)) {
          console.log(`[[ITS A MATCH]] ${voteName} likes ${userName} back!`);
          matches[userName]
            ? matches[userName].push(voteName)
            : (matches[userName] = [voteName]);
        }
      }
    }

    res.locals.matches = matches;
    return next();
    // then return the master list and the updates matches to check against
    //if they are then add to that person to both peoples matches and add to the master match list (maybe later)
    //this is not really very efficient because each person will have to look at up to 4 names and then each of those names has 4 votes :/ so up to 16 lookups for each person but thats fine 46*16
  },

  // draftMatchMessages: async (req, res, next) => {
  //   //retrieve attendees
  //   const cache = {};
  //   const messages = [];

  //   for (const attendee of res.locals.attendeeList) {
  //     cache[attendee.name] = attendee;
  //   }

  //   for (const attendee in res.locals.matches) {
  //     let name = attendee.slice(0, attendee.name.indexOf(' '));

  //
  //   }
  // },
  // fontend will stop this unless match button has been pressed
  // it will retrieve the list again (or just an individual), traverse and draft a message with their name as the key and the formatted message as their value

  eraseDB: async (req, res, next) => {
    await Attendee.deleteMany({});
    console.log('All gone!');
    return next();
  },
};

module.exports = attendeeController;
