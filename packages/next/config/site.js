const siteUrl = 'https://dexmos.finance';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);

module.exports = {
  company: {
    nick: 'Dexmos',
    name: 'Dexmos',
    addr: ['San Francisco, CA'],
    legalCounty: 'San Francisco',
    legalState: 'California'
  },
  site: {
    siteUrl,
    www: `www.${siteAddress.host}`,
    host: siteAddress.host
  },
  emails: {
    hello: 'hello@dexmos.finance',
    support: 'support@dexmos.finance',
    abuse: 'abuse@dexmos.finance',
    privacy: 'privacy@dexmos.finance',
    legal: 'legal@dexmos.finance',
    copyright: 'copyright@dexmos.finance',
    arbitrationOptOut: 'arbitration-opt-out@dexmos.finance'
  }
};
