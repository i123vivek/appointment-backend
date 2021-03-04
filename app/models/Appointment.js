const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const time = require('../libs/timeLib');

const Appointment = new Schema({
    appointmentId: {
        type: String,
        default: '',
        index: true,
        unique: true
    },
    id: {
        type: String,
        default: ''
    },
    startTime: {
        type: String,
        default: ''
    },
    endTime: {
        type: String,
        default: ''
    },
    bookedFlag: {
        type: Boolean,
        default: false
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    phoneNo: {
        type: Number,
        default: 0
    },
    createdOn: {
        type: Date,
        default: Date.now()
    },
    lastModified:{
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('Appointment', Appointment)