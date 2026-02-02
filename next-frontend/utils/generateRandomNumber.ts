export const generateRandomNumber = (): number => {
  const newNumber = Math.floor(Math.random() * 10) + 1; // TODO: Adjust range if needed
  return newNumber;
};
