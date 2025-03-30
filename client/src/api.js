const API_URL = "http://localhost:5000"; // Your backend URL

export const registerUser = async (userData, isIncharge) => {
  const endpoint = isIncharge ? 'incharge-register' : 'register';
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }
  return data;
};

export const loginUser = async (userData, isIncharge) => {
  const endpoint = isIncharge ? 'incharge-login' : 'login';
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }
  return data;
};