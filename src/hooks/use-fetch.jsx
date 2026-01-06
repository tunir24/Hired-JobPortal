import { useSession } from "@clerk/clerk-react";
import { useState } from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { session, isLoaded } = useSession();

  const fn = async (...args) => {
    if (!isLoaded || !session) {
      throw new Error("Clerk session not ready");
    }

    setLoading(true);
    setError(null);

    try {
      const token = await session.getToken({
        template: "supabase",
      });

      if (!token) {
        throw new Error("Failed to get Supabase token");
      }

      const response = await cb(token, options, ...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
