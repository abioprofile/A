import { AxiosResponse } from "axios";
import { apiInstance } from "./api";

export const getFetch = async <T = any>(
  url: string, 
  headers: Record<string, string> = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await apiInstance.get(url, { headers });
  return response.data;
};

export const postFetch = async <T = any>(
  url: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await apiInstance.post(url, body, {
    headers,
  });
  return response.data;
};


export const putFetch = async <T = any>(url: string, body: any): Promise<T> => {
  const response: AxiosResponse<T> = await apiInstance.put(url, body);
  return response.data;
};

export const patchFetch = async <T = any>(
  url: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await apiInstance.patch(url, body, {
    headers,
  });
  return response.data;
};


export const deleteFetch = async <T = any>(
  url: string,
  headers: Record<string, string> = {}
): Promise<T> => {
  const response: AxiosResponse<T> = await apiInstance.delete(url, { headers });
  return response.data;
};

export const uploadProfilePicture = async (formData: FormData): Promise<any> => {
  const response: AxiosResponse<any> = await apiInstance.patch(
    '/user/profile/image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};