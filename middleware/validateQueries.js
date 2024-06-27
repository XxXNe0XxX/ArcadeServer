const validateQueries = (req, res, next) => {
  const { date, period } = req.query;

  // Validate date
  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Date is required",
    });
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format",
    });
  }

  // Validate period
  const validPeriods = ["day", "week", "month", "year"];
  if (!period || !validPeriods.includes(period)) {
    return res.status(400).json({
      success: false,
      message: "Invalid period. Valid values are: day, week, month",
    });
  }

  next();
};

module.exports = validateQueries;
