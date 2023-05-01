const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();
const path = require("path");
const Note = require("./models/Note");
const { post } = require('./routes/notes.js');
const app = express();
const ObjectId = mongoose.Types.ObjectId;

app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, "views/partials")
}));
app.use(express.static('public'));
app.use("", require("./routes/notes.js"));

app.set('view engine', 'handlebars');

//Tietokantaan yhdistäminen

const dbURI = 'mongodb+srv://Team12:WeatherDiary2023@weatherdiary.fssyihy.mongodb.net/UserNotes?retryWrites=true&w=majority';

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

//Open API haku ja etusivu


app.get('/', async (req, res) => {
    const UserNotes = await Note.find();

    fetch('https://archive-api.open-meteo.com/v1/archive?latitude=60.17&longitude=24.94&start_date=2011-01-01&end_date=2011-01-01&daily=temperature_2m_mean,sunrise,sunset,precipitation_sum,windspeed_10m_max&timezone=Europe%2FMoscow&windspeed_unit=ms')
    .then ((response) => response.json())
    .then ((data) => {

        const weatherInfo = {

            temperature : data.daily.temperature_2m_mean.toString(),
            sunrise : data.daily.sunrise.toString(),
            sunset : data.daily.sunset.toString(),
            precipitation : data.daily.precipitation_sum.toString(),
            windspeed : data.daily.windspeed_10m_max.toString(),
            };
    
        res.render('index',
        {
            pagetitle: "WeatherDiary",
            desc: "At this website, you can view historical weather data for Helsinki and add your own personal notes regarding specific dates. Please note that the weather data from today and the past couple of days may be missing due to delays. We retrieve our weather information from the Open Meteo API. At the bottom of this page, you can enter your own comments. To begin, please select a date between January 1, 2000, and today. Once you have chosen your preferred date, click on the 'View' button.",
            UserNotes: UserNotes.map(usernote => usernote.toJSON()),
            weatherDetails: weatherInfo,
        });
    })
});

// get all
app.get("/api/notes/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(404).json({
            msg: "Not found"
        })
    }
}); 

// get one
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

// DELETE santeri 

app.delete("/api/notes/(:id)", async (req, res) => {
    const id = req.params.id;


    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid ID. Not ObjectId' });
    }

    try {

        // test findById to check logs
        // const delNote = await Note.findById(id);
        const delNote = await Note.findByIdAndDelete(id);
        if (delNote) {
            // console.log(delNote);
            res.json({ msg: `Note-> ID: ${id} date: ${delNote.date}, temperature: ${delNote.temperature}, comment: '${delNote.comment}' deleted succesfully` })
        } else {
            res.status(404).json({ msg: `Note on id ${id} not found` })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});



// CREATE Rosa

app.post("/api/notes/", async (req, res) => {

    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.redirect("/");
    }

    catch (error) {
        res.status(500).json({ msg: error.message });
    }

});


// Error TOMI

app.use(function (req, res, next) {
    res.status(404).render('404', { pagetitle: '404 Error' });
});

// PATCH Santeri 
app.patch('/api/notes/:id', async(req, res, next) => {
    try {
      const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!note) {
        return res.status(404).send();
      }
      res.send(note);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  


