import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import isTokenExpired from "@/utils/isTokenExpired";
import useStorage from "@/hooks/useStorage";
import useAxios from "@/hooks/useAxios";

const UserContext: any = React.createContext({ user: null });

const AuthProvider: React.FC<any> = ({ children }) => {
  const router = useRouter();
  //   const dispatch = useAppDispatch();
  const [token, setToken] = useStorage("user_token", "");
  const [user, setUser] = useState(null);

  const [{ data: getData, loading: getLoading, error: getError }, fetch] =
    useAxios({
      url: "auth/me",
    });

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      setToken("");
      //   dispatch(userSignOut());
    }
  }, []);

  const signOut = () => {
    setUser(null);
    setToken("");
    router.push("/auth");
  };

  const signIn = (user) => {
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
