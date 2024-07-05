const { format } = require("date-fns");

const formatTimestamps = (data) => {
  return data.map((item) => ({
    ...item,
    createdAt: format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss"),
    updatedAt: format(new Date(item.updatedAt), "yyyy-MM-dd HH:mm:ss"),
  }));
};

module.exports = formatTimestamps;
