import moment from "moment";
import "moment-timezone";
moment.tz.setDefault("Asia/Ho_Chi_Minh");

export const getCurrentDateTime = () => {
  return moment().format("MMMM Do YYYY, h:mm:ss a");
};
export const getDifTime = (dateStart: string) => {
  return moment(dateStart, "MMMM Do YYYY, h:mm:ss a").fromNow();
};

export const getCurrentDateTimeVietnam = () => {
  return moment().tz("Asia/Ho_Chi_Minh").format("MMMM Do YYYY, h:mm:ss a");
};
