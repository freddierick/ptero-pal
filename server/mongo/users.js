const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    signUpIP: {type: String},
    created: {type: Number, required: true},
    panelCreds: {type: Object},
    discordCreds: {type: Object},
    allocation: {type: Object},
    plans: {type: Array},
    vanityURL: {type: String},
    hostingName: {type: String},

});

module.exports = mongoose.model('users', productSchema);
