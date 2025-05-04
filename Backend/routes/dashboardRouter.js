const express = require('express')
const Router = express.Router()

const {getBranchWise , getGender , getVisitiors7days , getCollegenames,getBranchWiseWithFullName} = require('../controllers/dashboardController');

Router.post('/get-branchwise',getBranchWise);
Router.post('/get-gender',getGender);
Router.get('/get-visitor-seven',getVisitiors7days);
Router.get('/get-clg-names',getCollegenames);
Router.post('/get-brachwise-fullname',getBranchWiseWithFullName);



module.exports = Router