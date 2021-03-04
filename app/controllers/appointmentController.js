const express = require('express')
const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('../libs/timeLib');
const response = require('../libs/responseLib')
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');

/* Models */
const AppointmentModel = mongoose.model('Appointment');

let bookAppointment = (req, res) => {
    let bookAppointmentFunction = () => {
        return new Promise((resolve, reject) => {
            // console.log(req.body)
            if (check.isEmpty(req.body.id) || check.isEmpty(req.body.startTime) || check.isEmpty(req.body.endTime) || check.isEmpty(req.body.firstName) || check.isEmpty(req.body.lastName) || check.isEmpty(req.body.phoneNo)) {

                // console.log("403, forbidden request");
                let apiResponse = response.generate(true, 'required parameters are missing', 403, null)
                reject(apiResponse)
            } else {

                var today = Date.now()
                let appointmentId = shortid.generate()

                let newAppointment = new AppointmentModel({

                    appointmentId: appointmentId,
                    id: req.body.id,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    bookedFlag: true,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNo: req.body.phoneNo,
                    created: today,
                    lastModified: today
                }) // end new appointment model


                newAppointment.save((err, result) => {
                    if (err) {
                        // console.log('Error Occured.')
                        logger.error(`Error Occured : ${err}`, 'Database', 10)
                        let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                        reject(apiResponse)
                    } else {
                        // console.log('Success in booking Appointment')
                        resolve(result)
                    }
                }) // end new appointment save
            }
        }) // end new appointment promise
    } // end booking appointment function

    // making promise call.
    bookAppointmentFunction()
        .then((result) => {
            let apiResponse = response.generate(false, 'Appointment booked successfully', 200, result)
            res.send(apiResponse)
        })
        .catch((error) => {
            // console.log(error)
            res.send(error)
        })
}

let updateAppointmentBooked = (req, res) => {
    if (check.isEmpty(req.params.appointmentId)) {

        // console.log('appointmentId should be passed')
        let apiResponse = response.generate(true, 'appointmentId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        // console.log(options);
        AppointmentModel.update({ 'appointmentId': req.params.appointmentId }, options, { multi: true }).exec((err, result) => {

            if (err) {

                // console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                // console.log('Appointment Not Found.')
                let apiResponse = response.generate(true, 'Appointment Not Found', 404, null)
                res.send(apiResponse)
            } else {
                // console.log('Appointment Updated Successfully')
                let apiResponse = response.generate(false, 'Appointment Updated Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}

// function for getting all appointment booked.

let getAllAppointmentBooked = (req, res) => {
    AppointmentModel.find()
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            if (err) {
                // console.log(err)
                logger.error(err.message, ' appointmentController: getAllAppointmentBooked', 10)
                let apiResponse = response.generate(true, 'Failed To Find Appointment booked Details', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {
                logger.info('No Appointment Booked Found', 'appointmentController: getAllAppointmentBooked')
                let apiResponse = response.generate(true, 'No Appointment Booked Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All Appointment Booked Details Found', 200, result)
                res.send(apiResponse)
            }
        })

}

// function to get appointment booked detail by id.

let getAppointmentBookedDetailById = (req, res) => {
    if (check.isEmpty(req.params.appointmentId)) {

        // console.log('appointmentId should be passed')
        let apiResponse = response.generate(true, 'appointmentId is missing', 403, null)
        res.send(apiResponse)
    } else {

        AppointmentModel.findOne({ 'appointmentId': req.params.appointmentId }, (err, result) => {

            if (err) {

                // console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                // console.log('Appointment Not Found.')
                let apiResponse = response.generate(true, 'Appointment Not Found', 404, null)
                res.send(apiResponse)
            } else {
                logger.info("Appointment Detail found successfully", "appointmentController:getAppointmentBookedDetailById", 5)
                let apiResponse = response.generate(false, 'Appointment Detail Found Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }
}


module.exports = {
    bookAppointment: bookAppointment,
    updateAppointmentBooked: updateAppointmentBooked,
    getAllAppointmentBooked: getAllAppointmentBooked,
    getAppointmentBookedDetailById: getAppointmentBookedDetailById
}