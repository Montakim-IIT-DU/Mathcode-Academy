import { useEffect, useState } from "react";
import { getContestStatus } from "../utils/contestStatus";

function useContestStatus(contest) {
  const [status, setStatus] = useState(() =>
    contest
      ? getContestStatus(contest.start_time, contest.end_time, contest.status)
      : "Upcoming"
  );

  useEffect(() => {
    if (!contest) {
      return undefined;
    }

    const updateStatus = () => {
      setStatus(getContestStatus(contest.start_time, contest.end_time, contest.status));
    };

    updateStatus();
    const timer = setInterval(updateStatus, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  return status;
}

export default useContestStatus;
