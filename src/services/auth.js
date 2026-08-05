import { apiRequest } from './api';

export async function loginUser(username, password) {
  return apiRequest('/auth/login.php', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export async function logoutUser() {
  return apiRequest('/auth/logout.php');
}

export async function getCurrentUser() {
  return apiRequest('/auth/me.php');
}
