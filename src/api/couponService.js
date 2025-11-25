import api from "./http";

export const getCoupon = async (code) => {
  return api.get(`/coupons/${code}`);
};

export const getAllCoupons = async () => {
  return api.get(`/coupons`);
};

export const createCoupon = async (data) => {
  return api.post(`/coupons/create`, data);
};
