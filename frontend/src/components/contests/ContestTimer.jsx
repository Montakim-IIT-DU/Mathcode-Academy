import { useEffect, useState } from "react";

function getTimeLeft(targetTime) {
  if (!targetTime) {
    return "00d 00h 00m 00s";
  }

  const difference = new Date(targetTime).getTime() - new Date().getTime();

  if (difference <= 0) {
    return "00d 00h 00m 00s";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function ContestTimer({ targetTime, label }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: "16px",
        background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
        color: "#4f46e5",
        fontWeight: "800",
        textAlign: "center"
      }}
    >
      {label && (
        <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
          {label}
        </div>
      )}
      {timeLeft}
    </div>
  );
}

export default ContestTimer;
