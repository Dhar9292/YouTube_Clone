import { createContext, useContext, useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce"; // Fixed import
import { fetchData } from "../utils/rapidapi";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState("New");

  // Fixed debounce usage
  const debouncedSetValue = useCallback(
    debounce((newValue) => {
      setValue(newValue);
    }, 500),
    []
  );

  useEffect(() => {
    fetchAlldata(value);
  }, [value]);

  useEffect(() => {
    return () => debouncedSetValue.cancel();
  }, [debouncedSetValue]);

  const fetchAlldata = (query) => {
    setLoading(true);
    fetchData(`search/?q=${query}`).then(({ contents }) => {
      setData(contents);
      setLoading(false);
    });
  };

  return (
    <AuthContext.Provider value={{ loading, data, value, setValue: debouncedSetValue }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);