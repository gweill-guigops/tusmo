export const useProfile = () => {
  const username = ref(`Anon${generateID()}`);
  const clientID = ref(generateID());
  return {
    clientID,
    username,
  };
};
