import { HTTP_CLIENT } from "./config";
import { ENDPOINTS } from "./endpoints";

export const getCategories = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_CATEGORIES);
};

export const userSignup = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.SIGNUP, params);
};
 export const getUserByType=(params)=>{
  return HTTP_CLIENT.post(ENDPOINTS.USERBYTYPE, params);
 }

export const userLogin = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.LOGIN, params);
};
export const getUserById = (id) => {
  if (id){
  return HTTP_CLIENT.get(`${ENDPOINTS.USERBYID}?id=${id}`);
  }
};
export const getARehab = (id) => {
  if (id){
  return HTTP_CLIENT.get(`${ENDPOINTS.GETREHAB}?id=${id}`);
  }
};

export const userLogout = () => {
  return HTTP_CLIENT.post(ENDPOINTS.LOGOUT);
};

export const getAllRehab = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GET_ALL_REHAB);
};

export const getSingleRehab = (id) => {
  return HTTP_CLIENT.get(`${ENDPOINTS.GET_SINGLE_REHAB}?id=${id}`);
};

export const AddRemoveFavourite = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.ADD_FAVOURITE, params);
};

export const getAllFav = (id) => {
  return HTTP_CLIENT.get(`${ENDPOINTS.GET_ALL_FAV}?userId=${id}`);
};
export const addOrder = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.ADD_ORDER, params);
};
export const addmessages = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.ADD_MESSAGES, params);
};
export const getmessages = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.GET_MESSAGES, params);
};
export const allchats = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.GET_CHATS, params);
};

export const getAllOrders = (id) => {
  return HTTP_CLIENT.get(`${ENDPOINTS.GET_ALL_ORDERS}?userId=${id}`);
};

export const getEmergency = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.GET_MESSAGES, params);
};
export const addEmergency = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.ADD_EMERGENCY, params);
};



export const addchat = (id) => {
  return HTTP_CLIENT.post(`${ENDPOINTS.ADD_CHAT}?userId=${id}`);
};

export const getchats = () => {
  return HTTP_CLIENT.post(ENDPOINTS.GET_CHATS);
};
export const deletechats = (params) => {
  return HTTP_CLIENT.post(ENDPOINTS.DELETE_CHAT, params);
};

