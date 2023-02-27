import decode, { JwtPayload } from "jwt-decode";

/**
 * Verify expires date of token
 * @param boolean
 */
const isTokenExpired = (token: string) => {
  try {
    const decoded: JwtPayload = decode(token || "");
    return token ? (decoded.exp as JwtPayload) < Date.now() / 1000 : true;
  } catch (error) {
    return null;
  }
};

export default isTokenExpired;
