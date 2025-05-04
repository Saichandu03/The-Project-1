const express = require('express')
const Router = express.Router();

const { StudentWeeklyMessageSender } = require('../controllers/messageController');

// Router.post('/Student-Monthly-Message-Sender', StudentMonthlyMessageSender)
Router.post('/Student-Weekly-Message-Sender', StudentWeeklyMessageSender)
// Router.get('/WeeklyReport' , WeeklyReport)

module.exports = Router;