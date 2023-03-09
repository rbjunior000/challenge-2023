import { useRouter } from "next/router";
import React, { useEffect, useState, ReactNode } from "react";

import isTokenExpired from "@/utils/isTokenExpired";
import useStorage from "@/hooks/useStorage";
import useAxios from "@/hooks/useAxios";

type User = {
  token: string;
  name?: string;
  id?: string;
};

type UserContextType = {
  user: User | null;
  signOut: () => void;
  signIn: (user: User) => void;
};

const UserContext = React.createContext<UserContextType>({
  user: null,
  signOut: () => {},
  signIn: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useStorage("user_token", "");
  const [user, setUser] = useState<User | null>(null);

  const [{ data: getData, loading: getLoading, error: getError }, fetch] =
    useAxios({
      url: "auth/me",
    });

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      setToken("");
    }
  }, []);

  const signOut = () => {
    setUser(null);
    setToken("");
    router.push("/auth");
  };

  const signIn = (user: User) => {
    setUser(user);
    setToken(user.token);
    router.push("/companys");
  };

  useEffect(() => {
    if (token) {
      fetch()
        .then((data: any) => setUser(data.data))
        .catch((err) => console.log("fetch me error", err));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, signOut, signIn }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);

export default AuthProvider;
