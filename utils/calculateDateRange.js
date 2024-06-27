const calculateDateRange = (date, period) => {
  let startDate, endDate;

  switch (period) {
    case "day":
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      startDate = new Date(date);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "month":
      startDate = new Date(date);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "year":
      startDate = new Date(date);
      startDate.setMonth(0, 1); // Set to January 1
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setMonth(11, 31); // Set to December 31
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error("Invalid period specified");
  }

  return { startDate, endDate };
};

module.exports = { calculateDateRange };
