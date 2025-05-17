export const login = (username) => localStorage.setItem("user", username);
export const logout = () => localStorage.removeItem("user");
export const isLoggedIn = () => localStorage.getItem("user") !== null;
export const getUser = () => localStorage.getItem("user");
