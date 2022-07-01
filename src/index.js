/// importing the dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;
const { Event } = require('../models/event');
const { User } = require('../models/user');
const { v4: uuidv4} = require('uuid');

mongoose.connect("mongodb+srv://tomandkyaw:ilovecoding@cluster0.hdgaw0u.mongodb.net/events?retryWrites=true&w=majority")


// defining the Express app
const app = express();

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// express reads top from bottom
// need to protect the crud operations

app.post('/auth', async (req,res) => {
  const user = await User.findOne ({userName: req.body.userName});
  if(!user) {
    return res.sendStatus(401);
  }

  if(req.body.password !== user.password) {
    return res.sendStatus(403);
  }

  user.token = uuidv4();
  await user.save();
  res.send({token: user.token});
})



app.use( async (req,res,next) => {
  const authHeader = req.headers['authorization'];
  const user = await User.findOne({token: authHeader});
  if(user){
    next();
  } else {
    res.sendStatus(403);
  }

})


// defining CRUD operations
app.get('/', async (req, res) => {
  res.send(await Event.find());
});

//filter by event name
// app.sort('/:eventLocation', async (req, res) => {
//   await Event.filter({ eventLocation: ObjectId(req.params.eventName, req.params.eventLocation, req.params.eventDetails, req.params.price) })
//   res.send({ message: 'Events Filtered by Location.' });
// });


// exports.sort = function (req, res, next) {
//   const bookitem = booklist.filter((book) => book.type == req.params.type)
//   if(!bookitem) {
//       return(next(createError(404, "no books of that type")))
//   }
//   res.send(bookitem)
// }

// create new event
app.post('/', async (req, res) => {
  const newEvent = req.body;
  const event = new Event(newEvent);
  await event.save();
  res.send({ message: 'New Event inserted.' });
});


// deletes an event
app.delete('/:id', async (req, res) => {
  await Event.deleteOne({ _id: ObjectId(req.params.id) })
  res.send({ message: 'Event removed.' });
});


// update an event
app.put('/:id', async (req, res) => {
  await Event.findOneAndUpdate({ _id: ObjectId(req.params.id)}, req.body )
  res.send({ message: 'Event updated.' });
});


// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log("Database connected!")
});
