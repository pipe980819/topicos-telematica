const mongoose = require('mongoose');

const RoutesSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    },
});

const RoutesSchema = module.exports = mongoose.model('Routes', RoutesSchema);