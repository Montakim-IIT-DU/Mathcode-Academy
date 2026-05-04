import api from "./axios";

export const getUser = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getUserStats = async (userId) => {
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

export const getUserPerformance = async (userId) => {
  const response = await api.get(`/users/${userId}/performance`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUser = async (userId, payload) => {
  const response = await api.put(`/users/${userId}`, payload);
  return response.data;
};
