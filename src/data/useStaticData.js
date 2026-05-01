import { useEffect, useState } from "react";

export function useStaticData(jsonPath) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(jsonPath)
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
        console.error(`Failed to load data from ${jsonPath}:`, err);
        setError(err.message);
        setLoading(false);
      });
  }, [jsonPath]);

  return { data, loading, error };
}
