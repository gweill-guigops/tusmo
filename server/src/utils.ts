import { customAlphabet } from 'nanoid';

export function generateID(): string {
  const nanoid = customAlphabet('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 6);
  return nanoid();
}
