export * from './meta';
export * from './aminos';
export * from './utils';

import { messages as msgs } from './messages';
import { native } from './native';

export const messages = {
  ...msgs,
  ...native
};
