import axios, { AxiosRequestConfig, ResponseType } from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { toast } from "sonner";

// Define types
type MethodType = "POST" | "GET" | "PUT" | "DELETE";
type axiosParams = {
  method?: MethodType;
  urlPath: string;
  data?: any;
  params?: any;
  token?: string;
  responseType?: ResponseType;
  isServer?: boolean;
};
export type axiosReturnType = {
  status: string;
  message: string;
  payload: any;
};

export default async function axiosFunction({
  urlPath = "",
  method = "GET",
  data = {},
  params = {},
  token = undefined,
  responseType = undefined,
  isServer = false,
}: axiosParams): Promise<axiosReturnType> {
  const url = process.env.NEXT_PUBLIC_SERVER_URL + urlPath;

  // Check cookies for token and secret key
  const cookieToken = getCookie("lalascar-token")?.toString() || null;

  // Use provided token or fallback to cookie token
  const authToken = token || cookieToken;

  // Configure the request
  const config: AxiosRequestConfig = {
    method: method,
    url: url,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : ""
    },
    data: data,
  };

  if (responseType) {
    config["responseType"] = responseType;
  }

  if (method === "GET") {
    config["params"] = params;
  }

  try {
    const result: any = await axios(config);

    if (result.status === 401) {
      toast.error("Your session has expired. Please login again.");
      deleteCookie("lalascar-token");
    }

    return result.data;
  } catch (err: any) {
  
    if(isServer === false) {
      return {
        payload: [],
        message: err.message,
        status: "500",
      };
    }

    throw err;
  }
}