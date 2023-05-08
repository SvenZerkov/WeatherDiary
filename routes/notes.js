const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validateId } = require('../middleware/validators');
const { deleteNote, updateNote } = require('../controllers/notes');


const noteController = require("../controllers/notes.js");


// get all notes
router.get("/api/notes", noteController.getAll);

// get one note
router.get("/api/notes/(:id)", noteController.getNote);

// delete note by id
router.delete('/api/notes/:id', [
    check('id')
    .trim()
    .notEmpty()
    .withMessage("Id cannot be empty")
    .custom(validateId)
], noteController.deleteNote);

router.patch('/api/notes/:id', [
    check('id')
    .trim()
    .notEmpty()
    .withMessage("Id cannot be empty")
    .custom(validateId),
    check('temperature')
    .trim()
    .notEmpty()
    .withMessage("Temperature must be set")
    .isNumeric()
    .withMessage("Temperature must be numeric value"),
    check('comment')
    .optional()
    .trim()

    
],noteController.updateNote);

module.exports = router;