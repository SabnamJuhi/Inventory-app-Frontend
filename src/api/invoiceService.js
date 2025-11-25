import api from "./http";

export const createInvoice = async (payload) => {
  return api.post("/invoices", payload);
};

export const getInvoice = async (id) => {
  return api.get(`/invoices/${id}`);
};

export const updateInvoice = async (id, payload) => {
  return api.put(`/invoices/${id}`, payload);
};

export const deleteInvoice = async (id) => {
  return api.delete(`/invoices/${id}`);
};

export const deleteInvoiceItem = async (itemId) => {
  return api.delete(`/invoices/item/${itemId}`);
};
