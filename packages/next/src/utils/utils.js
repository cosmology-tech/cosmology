/**
 *
 * @returns {import("@keplr-wallet/types").Keplr}
 */
export const getKeplr = () => {
  if (typeof window === 'undefined') return null;
  else return window['keplr'];
};

/**
 *
 * @param {('queued'|'running'|'success'|'failed')} status
 * @returns
 */
export function getColor(status) {
  if (status === 'queued') return '#333';
  if (status === 'running') return 'yellow';
  if (status === 'success') return 'green';
  if (status === 'failed') return 'red';
}
