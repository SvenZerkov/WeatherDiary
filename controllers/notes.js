const express = require('express');
const Note = require('../models/Note');
const { validationResult } = require('express-validator');

// mongodb stuff here
/* const mongoose = require('mongoose');
const dbURI = process.env.dbURI;

mongoose.connect(dbURI); */



// here comes the controls like:
/*
const home = async (req, res) => {
    const weatherInfo = {};
    const UserNotesEmpty = {};

        res.render('index',
        {
            pagetitle: "WeatherDiary",
            desc: "At this website, you can view historical weather data for Helsinki and add your own personal notes regarding specific dates. Please note that the weather data from today and the past couple of days may be missing due to delays. We retrieve our weather information from the Open Meteo API. At the bottom of this page, you can enter your own comments. To begin, please select a date between January 1, 2000, and today. Once you have chosen your preferred date, click on the 'View' button.",
            weatherDetails: weatherInfo,
            UserNotes: UserNotesEmpty,
        });
    //})
});


const newHome = async (req, res) => {

    if (req.body.date)
    {
    console.log(req.body.date);
    const UserNotes = await Note.find({ date: req.body.date});
    const dateInput = await req.body.date;

    fetch('https://archive-api.open-meteo.com/v1/archive?latitude=60.17&longitude=24.94&start_date=' + dateInput + '&end_date=' + dateInput + '&daily=temperature_2m_mean,sunrise,sunset,precipitation_sum,windspeed_10m_max&timezone=Europe%2FMoscow&windspeed_unit=ms')
    .then ((response) => response.json())
    .then ((data) => {

        weatherInfo = {

            temperature : data.daily.temperature_2m_mean.toString() + " °C",
            sunrise : data.daily.sunrise.toString().replace("T"," "),
            sunset : data.daily.sunset.toString().replace("T"," "),
            precipitation : data.daily.precipitation_sum.toString() + " mm",
            windspeed : data.daily.windspeed_10m_max.toString() + " m/s",
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

const getNote = async (req, res, next) => {

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


const getAll =  async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(404).json({
            msg: "Not found"
        })
    }
});

*/
// get all notes
const getAll = async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(404).json({
            msg: "Not found"
        })
    }
};

// get one note
const getNote = async (req, res) => {
    try {

        const id = req.params.id;

        const note = await Note.findById(id);

        res.json(note);
    } catch (error) {
        res.status(404).json({
            msg: "Not found"
        })
    }
};


// delete note
const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const delNote = await Note.findByIdAndDelete(id);
        if (!delNote) {
            return res.status(404).json({ msg: `Note with id ${id} not found` });
        }
        console.log(delNote);
        res.json({
            msg: `Note-> ID: ${id} date: ${delNote.date}, temperature: ${delNote.temperature}, comment: '${delNote.comment}' deleted succesfully`
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// export
module.exports = {
    deleteNote,
    getAll,
    getNote
}

