export * from './meta';
export * from './aminos';
export * from './utils';

import { messages as msgs } from './messages';
import { native } from './messages';

export const messages = {
  ...msgs,
  ...native
};
