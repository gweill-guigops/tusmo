import { useStorage } from '@vueuse/core';

export const useProfile = () => {
  const clientID = useStorage('clientID', generateID());
  const username = useStorage('username', `Anon${generateID()}`);

  return {
    clientID,
    username,
  };
};
