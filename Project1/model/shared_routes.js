const mongoose = require('mongoose');

const ShareRoutesSchema = mongoose.Schema({
    route:{
        type: String,
        required: true
    },
    owner:{
        type: String,
        required: true
    },
    viewers:{
        type: [String],
        require: false
    },
    date:{
        type: Date,
        default: Date.now,
        required: true
    }
});

const ShareRoutes = module.exports = mongoose.model('SharedRoutes', ShareRoutesSchema);