import useStorage from "@/hooks/useStorage";
import isTokenExpired from "@/utils/isTokenExpired";
import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useMemo } from "react";
import { useAuth } from "../AuthProvider/AuthProvider";

interface AuthGuardProps {
  tokenKey?: string;
  loading?: boolean;
  as?: React.ComponentType<any>;
  unauthorizedLayout?: React.ComponentType<any>;
  children: ReactNode;
}

const Splash: React.FC<{ show: boolean; children: ReactNode }> = ({
  children,
  show,
}) => {
  return show ? <>{children}</> : <div>loading</div>;
};

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  tokenKey = "user_token",
  loading = false,
  as: Layout = ({ children }) => <>{children}</>,
  unauthorizedLayout: Error403 = ({ children }) => <>{children}</>,
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [token] = useStorage(tokenKey, "");
  const unauthorized = useMemo(() => !loading && !user, [loading, user]);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      router.push("/auth");
    }
  }, [router, token]);

  return (
    <Splash show={!!user}>
      {unauthorized ? (
        <Layout>
          <Error403 />
        </Layout>
      ) : (
        <>{children}</>
      )}
    </Splash>
  );
};

export default AuthGuard;
