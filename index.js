const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
require('dotenv').config();
const path = require("path");
const Note = require("./models/Note");
const app = express();




app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    partialsDir: path.join(__dirname, "views/partials")
}));
app.use(express.static('public'));
app.use("", require("./routes/notes.js"));

app.set('view engine', 'handlebars');

//Tietokantaan yhdistäminen

const dbURI = 'mongodb+srv://Team12:WeatherDiary2023@weatherdiary.fssyihy.mongodb.net/UserNotes?retryWrites=true&w=majority';
    /* Rosan tekemä yhdistys
    mongoose.connect(dbURI)
    .then(result => console.log("success")); */

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

// DELETE santeri
/* app.delete("/api/notes/:id", async (req, res) => {
    const id = Number(req.params.id);

    const noteIndex = .findIndex(product => product.id === id);
    if (noteIndex !== -1) {
        products.splice(noteIndex, 1);
        // res the rest of the documents back
        res.json(products);
    } else {
        res.status(404).json({
            msg: "Product not found"
        })
    }
}); */





