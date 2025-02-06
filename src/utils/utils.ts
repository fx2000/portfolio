/**
 * Get the base URL of the API
 * @returns The base URL of the API
 */
const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("API_URL is not defined");
  }
  return apiUrl;
};

export { getApiBaseUrl };
