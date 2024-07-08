import 'cross-fetch/polyfill';
import { request } from 'undici';

const statusCode201 = 201;

// ============
// AUTH CLIENTS
// ============

const authTokens: { [a: string]: string } = {};

export const cookiesHeader = (wallet: { email: string; password: string }) => {
  if (!authTokens[wallet.email]) throw new Error('Missing auth token');
  return {
    Cookie: `session=${authTokens[wallet.email]}; `,
  };
};

export const signUpAndOrLogIn = async (wallet: {
  email: string;
  password: string;
}) => {
  if (authTokens[wallet.email]) return authTokens[wallet.email];
  const res1 = await request(
    `${process.env.HOST}/auth/signup?password=${wallet.password}&email=${wallet.email}`,
    {
      method: 'POST',
    }
  );
  if (res1.statusCode !== statusCode201) {
    console.log(await res1.body.text());
    throw new Error('Status code not 201');
  }
  (await res1.body.json()) as { message: string };

  const res2 = await request(
    `${process.env.HOST}/auth/login?password=${wallet.password}&email=${wallet.email}`,
    {
      method: 'POST',
    }
  );
  if (res2.statusCode !== statusCode201) {
    console.log(await res2.body.text());
    throw new Error('Status code not 201');
  }

  const json2 = (await res2.body.json()) as {
    token: string;
    success: boolean;
    errorMessage: string;
  };
  if (json2.errorMessage) throw new Error(json2.errorMessage);
  authTokens[wallet.email] = json2.token;
  return authTokens[wallet.email];
};
