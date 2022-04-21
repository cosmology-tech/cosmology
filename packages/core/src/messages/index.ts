export * from './gas';
export * from './utils';

import { messages as msgs } from './messages';
import { native } from './native';

export const messages = {
  ...msgs,
  ...native
};

import * as telescope from '@osmonauts/osmosis';

export {
  telescope
}