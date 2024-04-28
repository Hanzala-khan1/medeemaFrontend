// const BASE_URL = "https://medemaa-2c866c7d1e6e.herokuapp.com/";
const BASE_URL = "http://localhost:5000";

const ENDPOINTS = {
  GET_CATEGORIES: "/user/getCategories",
  SIGNUP: "/user/register",
  USERBYTYPE: "/user/getUserByType",
  LOGIN: "/user/login",
  LOGOUT: "/user/logout",
  USERBYID: "/user/singleuser",
  GET_ALL_REHAB: "/user/getAllRehabLists",
  GET_SINGLE_REHAB: "/user/getARehab",
  ADD_FAVOURITE: "/user/addRemoveFav",
  GET_ALL_FAV: "/user/getAllFav",
  ADD_ORDER: "/user/addBooking",
  GET_ALL_ORDERS: "/user/getAllBookings",
  


  ADD_MESSAGES: "/message/addmessage",
  GET_MESSAGES: "/message/getmessages",
  ADD_EMERGENCY: "/message/addEmergency",


  
  ADD_CHAT: "/message/addchat",
  GET_CHATS: "/message/getChatRoom",
  DELETE_CHAT: "/message/deleteChatRoom",
};
export { BASE_URL, ENDPOINTS };
