import api from "../config/api";

export interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: null;
  role: string;
  createdAt: string;
  token: string | null;
  refreshToken: string | null;
  image: string | null;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data: UserData;
}

/**
 * Fetches the current user data from the API
 * @returns Promise with the user data
 */
const getCurrentUser = async (): Promise<UserData> => {
  try {
    // The API will automatically use the token from localStorage that's set in the api instance
    const response = await api.get<ApiResponse>("currentAccount");

    // Return just the user data portion of the response
    return response.data.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
};

export default getCurrentUser;
