const siteUrl = 'https://cosmology.finance';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);

module.exports = {
  company: {
    nick: 'Cosmology',
    name: 'Cosmology',
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
    hello: 'hello@cosmology.finance',
    support: 'support@cosmology.finance',
    abuse: 'abuse@cosmology.finance',
    privacy: 'privacy@cosmology.finance',
    legal: 'legal@cosmology.finance',
    copyright: 'copyright@cosmology.finance',
    arbitrationOptOut: 'arbitration-opt-out@cosmology.finance'
  }
};
