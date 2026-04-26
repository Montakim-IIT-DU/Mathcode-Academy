import api from "./axios";

export const getProblems = async () => {
  const response = await api.get("/problems/");
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

export const createProblem = async (payload) => {
  const response = await api.post("/problems/", payload);
  return response.data;
};

export const updateProblem = async (id, payload) => {
  const response = await api.put(`/problems/${id}`, payload);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};
