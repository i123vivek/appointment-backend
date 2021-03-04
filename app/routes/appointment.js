const express = require('express');
const router = express.Router();
const appConfig = require("../../config/appConfig");
const appointmentController = require('./../controllers/appointmentController')

module.exports.setRouter = (app) => {
    let baseUrl = `${appConfig.apiVersion}/appointment`;

    app.post(`${baseUrl}/book`, appointmentController.bookAppointment);

    app.put(`${baseUrl}/:appointmentId/update`, appointmentController.updateAppointmentBooked);

    app.get(`${baseUrl}/booked/all`, appointmentController.getAllAppointmentBooked);

    app.get(`${baseUrl}/view/:appointmentId`, appointmentController.getAppointmentBookedDetailById);
}