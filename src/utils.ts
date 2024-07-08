export const sec = 1000;
const sPerMin = 60;
export const min = sPerMin * sec;
const minPerHour = 60;
export const hour = minPerHour * min;
const hoursPerDay = 24;
export const day = hour * hoursPerDay;

export const weiEth = '1000000000000000000';
const PRIVATE_KEY_LENGTH = 64;

/*
  Use this only in a test environment, this private
  key is not secure at all
*/
const chars = '0123456789abcdef';
export const mintPrivateKeyInsecure = () => {
  if (process.env.NODE_ENV !== 'test') {
    console.warn(
      'Be careful, mintPrivateKeyInsecure should be used only for test'
    );
  }
  let pk = '';
  for (let i = 0; i < PRIVATE_KEY_LENGTH; i += 1) {
    const r = Math.floor(Math.random() * chars.length);
    pk += chars.slice(r, r + 1);
  }
  return pk;
};

const chars2 = '0123456789AZERTYUIOPQSDFGHJKLMWXCVBN';
export const getRandomCode = (length: number) => {
  let rand = '';
  for (let i = 0; i < length; i += 1) {
    const r = Math.floor(Math.random() * chars2.length);
    rand += chars2.slice(r, r + 1);
  }
  return rand;
};
