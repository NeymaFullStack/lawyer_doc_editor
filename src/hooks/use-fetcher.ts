import { useState, useEffect, useCallback } from "react";

type UseFetcherResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useFetcher = <T>(
  fetcherFn: () => Promise<T>, // Function to fetch data
  dependencies: any[] = [] // Dependencies to refetch on change
): UseFetcherResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Initialize with false
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcherFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetcherFn]);

  // Trigger fetchData on dependencies change
  useEffect(() => {
    fetchData();
  }, [...dependencies]); // Avoid directly including fetchData

  return { data, loading, error, refetch: fetchData };
};
