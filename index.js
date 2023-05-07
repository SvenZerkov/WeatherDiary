// essential imports and requirements
const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();
const path = require("path");
const Note = require("./models/Note");
const { post } = require('./routes/notes.js');
const app = express();
const ObjectId = mongoose.Types.ObjectId;

// middlewares and configuration
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, "views/partials")
}));
app.use(express.static('public'));
app.use("", require("./routes/notes.js"));
app.use(express.json());
app.set('view engine', 'handlebars');


// DB connections

const dbURI = process.env.dbURI;

(async () => {
    try {
        await mongoose.connect(dbURI);
        console.log("Database connected");
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server up and running. Listening port ${PORT}`));
    } catch (error) {
        console.log(error); // change this later to log in file
    }
})();

// Frontpage

app.get('/', async (req, res) => {
    const weatherInfo = {};
    const UserNotesEmpty = {};

    res.render('index',
        {
            pagetitle: "WeatherDiary",
            desc: "At this website, you can view historical weather data for Helsinki and add your own personal notes regarding specific dates. Please note that the weather data from today and the past couple of days may be missing due to delays. We retrieve our weather information from the Open Meteo API. At the bottom of this page, you can enter your own comments. To begin, please select a date between January 1, 2000, and today. Once you have chosen your preferred date, click on the 'View' button.",
            weatherDetails: weatherInfo,
            UserNotes: UserNotesEmpty,
        });

});

// to upload frontpage again with date

app.post('/', body('date').notEmpty(), async (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
        console.log(req.body.date);
        const UserNotes = await Note.find({ date: req.body.date });
        const dateInput = await req.body.date;

        fetch('https://archive-api.open-meteo.com/v1/archive?latitude=60.17&longitude=24.94&start_date=' + dateInput + '&end_date=' + dateInput + '&daily=temperature_2m_mean,sunrise,sunset,precipitation_sum,windspeed_10m_max&timezone=Europe%2FMoscow&windspeed_unit=ms')
            .then((response) => response.json())
            .then((data) => {

                weatherInfo = {

                    temperature: data.daily.temperature_2m_mean.toString() + " °C",
                    sunrise: data.daily.sunrise.toString().replace("T", " "),
                    sunset: data.daily.sunset.toString().replace("T", " "),
                    precipitation: data.daily.precipitation_sum.toString() + " mm",
                    windspeed: data.daily.windspeed_10m_max.toString() + " m/s",
                };

                res.render('index',
                    {
                        pagetitle: "WeatherDiary",
                        desc: "At this website, you can view historical weather data for Helsinki and add your own personal notes regarding specific dates. Please note that the weather data from today and the past couple of days may be missing due to delays. We retrieve our weather information from the Open Meteo API. At the bottom of this page, you can enter your own comments. To begin, please select a date between January 1, 2000, and today. Once you have chosen your preferred date, click on the 'View' button.",
                        UserNotes: UserNotes.map(usernote => usernote.toJSON()),
                        weatherDetails: weatherInfo,
                        Date: showChosenDay(dateInput),
                    });

            });
    }
    else {
        const weatherInfo = {};
        const UserNotesEmpty = {};

        res.render('index',
            {
                pagetitle: "WeatherDiary",
                desc: "At this website, you can view historical weather data for Helsinki and add your own personal notes regarding specific dates. Please note that the weather data from today and the past couple of days may be missing due to delays. We retrieve our weather information from the Open Meteo API. At the bottom of this page, you can enter your own comments. To begin, please select a date between January 1, 2000, and today. Once you have chosen your preferred date, click on the 'View' button.",
                weatherDetails: weatherInfo,
                UserNotes: UserNotesEmpty,
            });
    }

});


// get all
// app.get("/api/notes/", async (req, res) => {
//     try {
//         const notes = await Note.find();
//         res.json(notes);
//     } catch (error) {
//         res.status(404).json({
//             msg: "Not found"
//         })
//     }
// }); 

// get one note

app.get("/api/notes/(:id)", async (req, res, next) => {

    try {

        const id = req.params.id;

        const note = await Note.findById(id);

        res.json(note);
    } catch (error) {
        res.status(404).json({
            msg: "Not found"
        })
    }
});

// DELETE note 

app.delete("/api/notes/(:id)", async (req, res) => {
    const id = req.params.id;


    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid ID. Not ObjectId' });
    }

    try {
        const delNote = await Note.findByIdAndDelete(id);
        if (delNote) {
            res.json({ msg: `Note-> ID: ${id} date: ${delNote.date}, temperature: ${delNote.temperature}, comment: '${delNote.comment}' deleted succesfully` })
        } else {
            res.status(404).json({ msg: `Note on id ${id} not found` })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// Search TOMI

app.get('/', (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
  
    client.connect((err) => {
      const db = client.db('Weather Diary');
      const collection = db.collection('UserNotes');
  
      collection.find({
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      }).toArray((err, notes) => {
        res.render('index', { notes });
      });
    });
  });

// CREATE note

app.post("/api/notes/", async (req, res) => {

    try {
        const formattedDate = useChosenDay(req.body.dateToAdd);
        const newNote = new Note({
            date: formattedDate,
            temperature: req.body.temperature,
            comment: req.body.comment
        });
        await newNote.save();
        res.redirect("/");
    }

    catch (error) {
        res.status(500).json({ msg: error.message });
    }
})

// PATCH note 

app.patch("/api/notes/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id);

    if (!req.body) {
        res.status(400).json(
            {
                msg: "Body is empty"
            }
        )
    } else {
        const noteToUpdate = {
            temperature: req.body.temperature,
            comment: req.body.comment
        };

        const updatedNote = await Note.findByIdAndUpdate(id, noteToUpdate, { new: true });

        if (updatedNote) {
            res.json(
                {
                    msg: "note updated",
                    updatedNote
                }
            );
        } else {
            return res.status(400).json({ msg: "no note on that id" });
        }
    }

});

// Error 

app.use(function (req, res, next) {
    res.status(404).render('404', { pagetitle: '404 Error' });
});

/* const btn = document.getElementById('btn');

btn.addEventListener('click', function handleClick() {
  const dateInput = document.getElementById('date');

  if (!dateInput.value) {
    alert("Pleace pick a date.");
    //break;
  } 

}); */

function showChosenDay(date) {

    let MyDate = date;
    //console.log(MyDate);

    // slicing the date, to show in right format
    let year = String(MyDate).slice(0, 4);
    //console.log(year);
    let month = String(MyDate).slice(5, 7);
    //console.log(month);
    let day = String(MyDate).slice(8, 10);
    //console.log(day);
    let formatDate = day + "." + month + "." + year;
    //console.log(formatDate);
    return formatDate;
}

function useChosenDay(date) {
    let MyDate = date;
    //console.log(MyDate);
    // slicing the date, to show in right format
    let year = String(MyDate).slice(6, 10);
    //console.log(year);
    let month = String(MyDate).slice(3, 5);
    //console.log(month);
    let day = String(MyDate).slice(0, 2);
    //console.log(day);
    let formatDate = year + "-" + month + "-" + day;
    //console.log(formatDate);
    return formatDate;
}



