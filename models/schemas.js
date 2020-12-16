const mongoose = require("mongoose");
require('dotenv').config()
const database = require("./connection");
db_connect = database(process.env.MONGODB_URI)
const studentSchema = new mongoose.Schema({
  FirstName: String,
  LastName: String,
  Gender: String,
  SchoolId: String,
  School: String,
  Field: String,
  VehicleName: String,
  PlateNumber: String,
  LicenseNumber: String,
  DateRegistered: String,
});
const employeeSchema = new mongoose.Schema({
  "FirstName": "String",
  "LastName": "String",
  "Gender": "String",
  "SchoolId": "String",
  "Office": "String",
 "Job": "String",
  "VehicleName":" String",
  "PlateNumber": "String",
  "LicenseNumber": "String",
  "DateRegistered": "String",
});

const employeeRegistry = db_connect.model(
  "Employee",
  employeeSchema
  
);
const studentRegistry = db_connect.model(
  "Student",
  studentSchema
);

module.exports = {
  employeeRegistry,
  studentRegistry,
};
