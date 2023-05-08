const mongoose = require('mongoose');

const validateId = (value) => {
    console.log(value);
    if (!mongoose.Types.ObjectId.isValid(value)) {
        console.log('Error: Invalid ID. Not ObjectID.');
        throw new Error('Invalid ID. Not ObjectID.');
    }
    return true;
};

module.exports = {
    validateId
};