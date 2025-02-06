export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9]{3,15}$/;
  return regex.test(username);
};
export const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
  return regex.test(password);
};
