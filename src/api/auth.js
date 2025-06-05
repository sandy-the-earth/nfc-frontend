import axios from 'axios';

export async function forgotPassword(email) {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
}

export async function resetPassword(token, newPassword) {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password`, { token, newPassword });
}