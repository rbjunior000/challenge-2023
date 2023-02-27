import useStorage from "@/hooks/useStorage";
import isTokenExpired from "@/utils/isTokenExpired";
import { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { useAuth } from "../AuthProvider/AuthProvider";

const Splash = ({ children, show }) => children;

const AuthGuard: React.FC<any> = ({
  children,
  tokenKey = "user_token",
  onDeniedAccess,
  loading,
  as: Layout,
  unauthorizedLayout: Error403,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [token] = useStorage(tokenKey, "");
  const unauthorized = useMemo(() => !loading && !user, [loading, user]);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      router.push("/auth");
    }
  });
  return (
    <Splash show={!loading}>
      {unauthorized ? (
        <Layout>
          <Error403 />
        </Layout>
      ) : (
        children
      )}
    </Splash>
  );
};

export default AuthGuard;
