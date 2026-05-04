export function getContestStatus(startTime, endTime, fallbackStatus = "Upcoming") {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const now = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return fallbackStatus;
  }

  if (now < start) {
    return "Upcoming";
  }

  if (now <= end) {
    return "Running";
  }

  return "Finished";
}

export function getContestStatusBadgeClass(status) {
  if (status === "Running") {
    return "badge badge-success";
  }

  if (status === "Upcoming") {
    return "badge badge-warning";
  }

  return "badge badge-danger";
}

export function getContestStatusStyle(status) {
  if (status === "Running") {
    return { background: "#dcfce7", color: "#15803d" };
  }

  if (status === "Finished") {
    return { background: "#fee2e2", color: "#dc2626" };
  }

  return { background: "#fef3c7", color: "#d97706" };
}

export function getContestCountdownTarget(contest) {
  if (!contest) {
    return null;
  }

  const status = getContestStatus(contest.start_time, contest.end_time, contest.status);

  if (status === "Upcoming") {
    return contest.start_time;
  }

  return contest.end_time;
}

export function getContestCountdownLabel(status) {
  if (status === "Upcoming") {
    return "Starts in";
  }

  if (status === "Running") {
    return "Ends in";
  }

  return "Finished";
}
