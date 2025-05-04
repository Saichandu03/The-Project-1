const studentData = require("../models/studentsSchema");
const VisitorData = require("../models/visitorSchema");
const moment = require("moment");

const getBranchWise = async (req, res) => {
  const data = req.body;

  const date = new Date(req.body.toDate);
  const istOffsetInMilliseconds = (5 * 60 + 30) * 60 * 1000;

  const wantedCollege = data.selectedOption;
  const fromDate = new Date(data.startDate);
  const toDate = new Date(
    new Date(`${data.endDate.slice(0, 10)}T23:59:59.999`).getTime() +
      istOffsetInMilliseconds
  );

  // console.log("This is the date for getBranchWise");
  // console.log(data);
  // console.log(fromDate, toDate);

  try {
    if (wantedCollege === "ALL") {
      const groupedData = await studentData.aggregate([
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
            _id: "$collegeCode",
            totalStudents: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json(groupedData);
    } else {
      // If a specific college is selected, group by branch and count documents
      const groupedData = await studentData.aggregate([
        {
          $match: {
            college: wantedCollege,
            date: {
              $gte: fromDate,
              $lte: toDate,
            },
            inTime: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$branch", // Group by branch
            totalStudents: { $sum: 1 }, // Count total students in each branch
          },
        },
      ]);
      return res.status(200).json(groupedData);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getBranchWiseWithFullName = async (req, res) => {
  const data = req.body;
  const wantedCollege = data.college;

  const date = new Date(req.body.toDate);
  const istOffsetInMilliseconds = (5 * 60 + 30) * 60 * 1000;

  const fromDate = new Date(new Date(`${data.datee.slice(0, 10)}T00:00:00.000`).getTime() +
  istOffsetInMilliseconds);
  const toDate = new Date(
    new Date(`${data.datee.slice(0, 10)}T23:59:59.999`).getTime() +
      istOffsetInMilliseconds
  );

  // console.log("This is for getBranchWiseWithFullName");
  // console.log(data);
  // console.log(fromDate, toDate);

  try {
    if (wantedCollege === "ALL") {
      const groupedData = await studentData.aggregate([
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
            _id: "$college",
            totalStudents: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json(groupedData);
    } else {
      const groupedData = await studentData.aggregate([
        {
          $match: {
            college: wantedCollege,
            date: {
              $gte: fromDate,
              $lte: toDate,
            },
            inTime: { $ne: null },
          },
        },
        {
          $group: {
            _id: "$branch",
            totalStudents: { $sum: 1 },
          },
        },
      ]);
      return res.status(200).json(groupedData);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getGender = async (req, res) => {
  const data = req.body;
  const wantedCollege = data.selectedOption;

  const date = new Date(req.body.toDate);
  const istOffsetInMilliseconds = (5 * 60 + 30) * 60 * 1000;

  const fromDate = new Date(data.startDate);
  const toDate = new Date(
    new Date(`${data.endDate.slice(0, 10)}T23:59:59.999`).getTime() +
      istOffsetInMilliseconds
  );

  // console.log("This is getGender");
  // console.log(data);
  // console.log(fromDate, toDate);
  try {
    if (wantedCollege === "ALL") {
      const groupedData = await studentData.aggregate([
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
            _id: null,
            Male: {
              $sum: {
                $cond: [{ $eq: [{ $toLower: "$gender" }, "male"] }, 1, 0],
              },
            },
            Female: {
              $sum: {
                $cond: [{ $eq: [{ $toLower: "$gender" }, "female"] }, 1, 0],
              },
            },
          },
        },
      ]);
      // console.log(groupedData)
      return res.status(200).json(groupedData);
    } else {
      const groupedData = await studentData.aggregate([
        {
          $match: {
            college: wantedCollege,
            date: {
              $gte: fromDate,
              $lte: toDate,
            },
            inTime: { $ne: null },
          },
        },
        {
          $group: {
            _id: null,
            Male: {
              $sum: {
                $cond: [{ $eq: [{ $toLower: "$gender" }, "male"] }, 1, 0],
              },
            },
            Female: {
              $sum: {
                $cond: [{ $eq: [{ $toLower: "$gender" }, "female"] }, 1, 0],
              },
            },
          },
        },
      ]);
      return res.status(200).json(groupedData);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

const getVisitiors7days = async (req, res) => {
  // Helper function to get past 7 days in 'yyyy-mm-dd' format
  const toDate = moment(new Date()).format("YYYY-MM-DD");
  const specificDate = moment(new Date(), "YYYY-MM-DD");
  const prevDate = specificDate.subtract(6, "days");
  const fromDate = moment(prevDate).format("YYYY-MM-DD");

  const startDate = new Date(fromDate);
  const endDate = new Date(new Date(toDate).setUTCHours(23, 59, 59, 999));

  // console.log("visitor 7days")



  // console.log(startDate, endDate);
  try {
    // Step 1: Aggregate visitor data from MongoDB
    const aggregatedData = await VisitorData.aggregate([
      {
        $match: {
          inDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        // Group by the date part of 'inDate' only
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$inDate" } },
          count: { $sum: 1 },
        },
      },
      {
        // Project to format the output as { inDate, count }
        $project: {
          _id: 0,
          inDate: "$_id",
          count: "$count",
        },
      },
      {
        $sort: { inDate: 1 }, // Sort by date in ascending order
      },
    ]);

    // Step 2: Create an array of dates for the past 7 days
    const past7DaysData = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = new Date(d).toISOString().split("T")[0];
      const dateData = aggregatedData.find((entry) => entry.inDate === dateStr);
      past7DaysData.push({
        inDate: dateStr.split("-").reverse().join("-"),
        count: dateData ? dateData.count : 0, // Set count to 0 if no data found
      });
    }

    // Fill in missing days with count 0
    // console.log(past7DaysData);
    res.status(201).json(past7DaysData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCollegenames = async (req, res) => {
  try {
    const uniqueCollegeNames = await studentData.aggregate([
      {
        $group: {
          _id: "$college",
        },
      },
      {
        $project: {
          _id: 0,
          collegeName: "$_id",
        },
      },
    ]);
    return res.status(200).json(uniqueCollegeNames);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  getBranchWise,
  getGender,
  getVisitiors7days,
  getCollegenames,
  getBranchWiseWithFullName,
};
