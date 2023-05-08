const express = require('express');
const Note = require('../models/Note');
const { validationResult } = require('express-validator');


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

const updateNote = async (req, res) => {
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
};

// export
module.exports = {
    deleteNote,
    getAll,
    getNote,
    updateNote
}

