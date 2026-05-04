import api from "./axios";

export const getTestcases = async () => {
  const response = await api.get("/testcases/");
  return response.data;
};

export const getTestcasesByProblem = async (problemId) => {
  const response = await api.get(`/testcases/problem/${problemId}`);
  return response.data;
};

export const getSampleTestcasesByProblem = async (problemId) => {
  const response = await api.get(`/testcases/problem/${problemId}/samples`);
  return response.data;
};

export const getTestcaseById = async (id) => {
  const response = await api.get(`/testcases/${id}`);
  return response.data;
};

export const createTestcase = async (payload) => {
  const response = await api.post("/testcases/", payload);
  return response.data;
};

export const updateTestcase = async (id, payload) => {
  const response = await api.put(`/testcases/${id}`, payload);
  return response.data;
};

export const deleteTestcase = async (id) => {
  const response = await api.delete(`/testcases/${id}`);
  return response.data;
};
