import { request } from 'undici';

import { signUpAndOrLogIn, cookiesHeader } from './utils';
import { getJack } from './fixtures';
import { UserMinimal } from '../entities/user';

const jack = getJack();

test('Jack signs up and logs in', async () => {
  const token = await signUpAndOrLogIn(jack);
  expect(typeof token).toBe('string');
  expect(token.length > 1).toBe(true);
  const meResp = await request(`${process.env.HOST}/auth/me`, {
    headers: {
      ...cookiesHeader(jack),
    },
  });
  const me = (await meResp.body.json()) as UserMinimal;
  expect(typeof me.email).toBe('string');
});
