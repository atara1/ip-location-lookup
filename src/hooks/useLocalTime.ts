import { useEffect, useState } from "react";

export function useLocalTime(timezone?: string) {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    if (!timezone) return;

    const interval = setInterval(() => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date())
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [timezone]);

  return time;
}
