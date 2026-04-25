import api from "./axios";

export const getLeaderboard = async () => {
  const response = await api.get("/leaderboard");
  return response.data;
};

export const getContestLeaderboard = async (contestId) => {
  const response = await api.get(`/leaderboard/contest/${contestId}`);
  return response.data;
};