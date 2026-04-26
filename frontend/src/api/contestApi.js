import api from "./axios";

export const getContests = async () => {
  const response = await api.get("/contests/");
  return response.data;
};

export const getContestById = async (id) => {
  const response = await api.get(`/contests/${id}`);
  return response.data;
};

export const createContest = async (payload) => {
  const response = await api.post("/contests/", payload);
  return response.data;
};

export const joinContest = async (id, userId) => {
  const response = await api.post(`/contests/${id}/join`, {
    user_id: userId
  });
  return response.data;
};
