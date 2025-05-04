const studentData = require("../models/studentsSchema");
const axios = require("axios");
const cron = require("node-cron");
process.env.TZ = "Asia/Kolkata";


const StudentWeeklyMessageSender = async (req, res) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 6);
  fromDate.setUTCHours(0, 0, 0, 0)
  toDate.setUTCHours(23, 59, 59, 999)
  // console.log("This is From and Two Date ", fromDate, toDate);
  
    const Filtered_Data = await studentData.aggregate([
      {
        $match: {
          date: {
            $gte: fromDate,
            $lte: toDate,
          },
          studentRoll: req.body.roll,
          inTime: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$studentRoll",
          studentName: { $last: "$studentName" },
          fatherMobile: { $last: "$fatherMobile" },
          dates: { $push: "$date" },
        },
      },
    ]);

  let studentRecord;
  if (Filtered_Data.length !== 0) {
    const dates = Filtered_Data[0].dates
      .sort((a, b) => b - a)
      .map((date) => {
        const d = new Date(date);
        d.setUTCHours(0, 0, 0, 0);
        return d.toISOString();
      });
  
    // let maxConsecutiveDays = 0;
    let currentStreak = 1;
    let currentStreakDates = [dates[0]];
    // let MaxStreakDates = [];
    const today = new Date().toISOString().split("T")[0];
  
    for (let i = 0; i < dates.length - 1; i++) {
      const currentDay = new Date(dates[i]).getDay();
      const nextDay = new Date(dates[i + 1]).getDay();
  
      const diff =
        (new Date(dates[i]) - new Date(dates[i + 1])) / (1000 * 60 * 60 * 24);
  
      if (
        diff === 1 || 
        (diff === 2 && currentDay === 1 && nextDay === 6) 
      ) {
        currentStreak++;
        currentStreakDates.push(dates[i + 1]);
      } else {
        // if (currentStreak > maxConsecutiveDays) {
        //   maxConsecutiveDays = currentStreak;
        //   MaxStreakDates = [...currentStreakDates];
        // }
        // currentStreak = 1;
        // currentStreakDates = [dates[i + 1]];
        break;
      }
    }

    // if (currentStreak > maxConsecutiveDays) {
    //   maxConsecutiveDays = currentStreak;
    //   MaxStreakDates = [...currentStreakDates];
    // }
  
    const studentRecord = {
      ...Filtered_Data[0],
      weekCount: currentStreak,
      consecutiveDates: currentStreakDates,
    };
  
    // console.log("This is the StudentRecord ", studentRecord);
  
    if (studentRecord.weekCount >= 3) {
      axios
        .get( /* Weekly Message API */)
        .then((result) => {
          console.log(`Successfully sent the week SMS to ${studentRecord._id}`);
        })
        .catch((error) => {
          console.log("error" + error);
          return res.status(504).json({ Error: error });
        });
  
      return res
        .status(200)
        .json(`Successfully sent the week SMS to ${studentRecord._id}.`);
    } else {
      console.log(
        `Student's weekly record does not meet the criteria for sending SMS to ${studentRecord._id}`
      );
      return res
        .status(200)
        .json(
          `Student's ( ${studentRecord._id} ) weekly record does not meet the criteria for sending SMS.`
        );
    }
  }
  
  else{
    console.log("No data found from late 6 days");
    return res
        .status(200)
        .json(
          `Student's ( ${studentRecord._id} ) doesn't have records in past 6 days`
        );
  }
};


const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const studentInformMessage = async (fromDate, toDate) => {
  const day = toDate.getUTCDate();
  // console.log(fromDate + "  " + toDate + " " + day);
  fromDate.setHours(0, 0, 0, 0);
  toDate.setHours(23, 59, 59, 999);
  const data = await studentData.aggregate([
    {
      $match: {
        date: {
          $gte: fromDate,
          $lte: toDate,
        },
        inTime: { $ne: null },
      },
    },
    {
      $group: {
        _id: "$studentRoll",
        Count: { $sum: 1 },
        Name: { $first: "$studentName" },
        fatherMobile: { $last: "$fatherMobile" },
      },
    },
  ]);

  for (const student of data) {
    try {
      await axios.get(/* Message Api */);
      console.log(
        `Dear Parent, ${student.Name} has came to college late for ${student.Count} times in this last ${day} Days. Please advice your ward to attend the college before 9:30 AM.`
      );
    } catch (err) {
      console.log(
        `Error Occured for Student Name : ${student.Name} , Father Mobile Number : ${student.fatherMobile}`
      );
      console.log(err);
    }

    await delay(5000);
  }

  // Helper function to create a delay
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

const sendDailyMessage = async () => {
  // console.log("Enter to Daily messages");
  const today = new Date();
  const fromTime = new Date(today.setUTCHours(0, 0, 0, 0));
  const toTime = new Date(today.setUTCHours(23, 59, 59, 999));

  // console.log(fromTime, toTime);
  const overallTodayData = await studentData.aggregate([
    {
      $match: {
        date: {
          $gte: fromTime,
          $lte: toTime,
        },
        inTime: { $ne: null },
      },
    },
    {
      $project: {
        _id: 0,
        studentRoll: 1,
        studentName: 1,
        fatherMobile: 1,
        inTime: 1,
      },
    },
  ]);

  // console.log("Data Getting successfully ", overallTodayData.length);

  if (overallTodayData.length != 0) {
    for (const student of overallTodayData) {
      const data = {
        roll: student.studentRoll,
      };
      try {
        await axios
          .post(
            /*API */
            data
          )
          .then((result) => {
            console.log(result.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.error(
          `Error while sending Daily Messages to ${student.studentRoll} : `,
          err.message
        );
      }

      await delay(5000);
    }
  } else {
    console.log("No Data Found");
  }
};



cron.schedule("30 11 * * *", () => {
  console.log("Sending daily messages from the cron job...");
  sendDailyMessage();
});

// cron for monthly info Messages
cron.schedule("30 11 15,28,30,31 * *", () => {
  console.log("Message Scheduled job starting...");
  // const currentDate = new Date("2024-10-15");
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 1)
  );
  const day = currentDate.getUTCDate();
  const month = currentDate.getUTCMonth() + 1;

  const monthsWith31Days = [1, 3, 5, 7, 8, 10, 12];

  if (month === 2) {
    if (day === 28) {
      console.log("This is for Feb month end(28th) msg");
      studentInformMessage(firstDayOfMonth, currentDate);
    }
  } else if (day === 15) {
    console.log("This is for Every month mid(15th) msg");
    studentInformMessage(firstDayOfMonth, currentDate);
  } else if (day === 30 && !monthsWith31Days.includes(month)) {
    console.log("This is for months with 30 days end(30th) msg");
    studentInformMessage(firstDayOfMonth, currentDate);
  } else if (day === 31) {
    console.log("This is for months with 31 days end(31st) msg");
    studentInformMessage(firstDayOfMonth, currentDate);
  }
  console.log("Message Scheduled job executed successfully.");
});

module.exports = { StudentWeeklyMessageSender };
