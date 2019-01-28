const mongoose = require('mongoose');

const PointsSchema = mongoose.Schema({
    latitude:{
        type: String,
        required: true
    },
    longitude:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    route:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    },
});

const Points = module.exports = mongoose.model('Points', PointsSchema);