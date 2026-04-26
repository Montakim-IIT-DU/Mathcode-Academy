import api from "./axios";

export const getSubmissions = async () => {
  const response = await api.get("/submissions/");
  return response.data;
};

export const getUserSubmissions = async (userId) => {
  const response = await api.get(`/submissions/user/${userId}`);
  return response.data;
};

export const createSubmission = async (payload) => {
  const response = await api.post("/submissions/", payload);
  return response.data;
};

export const getSubmissionById = async (id) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};
