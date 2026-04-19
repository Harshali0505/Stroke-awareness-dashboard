import { useEffect, useState } from "react";
import { BASE_URL } from "../config";

export function useStaticData(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}${endpoint}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        console.error(`Failed to load data from ${endpoint}:`, err);
        setError(err.message || 'Connection Refused');
        setLoading(false);
        setData(null);
      });
  }, [endpoint]);

  return { data, loading, error };
}
