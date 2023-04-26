const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();
const path = require("path");
const Note = require("./models/Note");
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

app.get('/', async (req, res) => {
    const UserNotes = await Note.find();

    res.render('index',
        {
            pagetitle: "WeatherDiary",
            desc: "Welcome to the weather diary!",
            UserNotes: UserNotes.map(usernote => usernote.toJSON())
        });
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
app.get("/api/notes/(:id)", async (req, res) => {

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
        const delNote = await Note.findById(id);
        // const delNote = await Note.findByIdAndDelete(id);
        if (delNote) {
            // console.log(delNote);
            res.json({ msg: `Note-> date: ${delNote.date}, temperature: ${delNote.temperature}, comment: '${delNote.comment}' deleted succesfully` })
        } else {
            res.status(404).json({ msg: `Note on id ${id} not found` })
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});



// CREATE Rosa

app.get("views/partials/index", (req, res) => {
    res.render("/index");
});
app.post("/api/notes/", async (req, res) => {

try {
    const newNote = new Note (req.body);
    await newNote.save();
    res.redirect("/");
}

catch (error) {
    res.status(500).json({ msg: error.message });
}

});







