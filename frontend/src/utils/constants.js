const APP_NAME = "Mathcode Academy";

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user"
};

export const VERDICTS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  WRONG_ANSWER: "Wrong Answer",
  TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
  RUNTIME_ERROR: "Runtime Error",
  COMPILATION_ERROR: "Compilation Error"
};

export const CONTEST_STATUS = {
  UPCOMING: "Upcoming",
  RUNNING: "Running",
  FINISHED: "Finished"
};

export const DIFFICULTY_LEVELS = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard"
};

export const SUPPORTED_LANGUAGES = [
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" }
];

export const STORAGE_KEYS = {
  TOKEN: "access_token",
  USER: "user"
};

export default APP_NAME;
