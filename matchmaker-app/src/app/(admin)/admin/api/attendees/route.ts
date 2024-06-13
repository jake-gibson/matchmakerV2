const path = require('path');
const { Readable } = require('stream');
const csv = require('csv-parser');
const fs = require('fs');
const Attendee = require('../../src/models/attendeeModel');

type Name = string;
// type Party = 'Team1' | 'Team2';
//type Date = [string, number];

//move to a separate types file:
interface CSV_Attendee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  ticketType: string;
}

interface Attendee {
  name: Name;
  email: string;
  number: string;
  party: 'Team1' | 'Team2';
  date: string; //maybe later we make this into a tuple type [Month, Year]
  votes: Array<Name>;
  matches: Array<Name>;
}

/***
 *  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
 */

export async function GET(req: Request) {
  const attendeeList = await Attendee.find({ date: req.params.date });
  console.log('Success, Attendee List retrieved:');
  console.log(attendeeList);
  return Response.json(attendeeList);
}


export async function POST(req: Request) {
  const formData = req.formData();

  /***
   * const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

   */

  if (file.mimetype !== 'text/csv') return;
  const attendees: Array<CSV_Attendee> = [];
  const sanitizedAttendees: Array<Attendee> = [];
  const myCSV = file.buffer;
  const stream = Readable.from(myCSV);

  stream
    .pipe(csv())
    .on('data', (data: CSV_Attendee) => attendees.push(data))
    .on('end', async () => {
      for (let attendee of attendees) {
        const { firstName, lastName, email, phoneNumber, ticketType }: CSV_Attendee = attendee;

        const sanitizedInfo: Attendee = {
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
      return Response.json(attendeeList)
}
}

