import { AxiosRequestConfig } from "axios";
import useAxios, { Options } from "axios-hooks";

const useHook = (
  url: string | AxiosRequestConfig<any>,
  props: Options | undefined = {}
) =>
  useAxios(url, {
    manual: true,
    ...props,
  });

export default useHook;
