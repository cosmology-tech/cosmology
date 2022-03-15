const siteUrl = 'https://cosmology.finance';
const siteAddress = new URL(siteUrl);
const canonical = siteAddress.href.slice(0, -1);
const title = 'Cosmology™';
const description = 'Auto-compounding your cosmos rewards';
const fbAppId = null;
module.exports = {
  title,
  canonical,
  description,
  openGraph: {
    type: 'website',
    url: siteUrl,
    title,
    description,
    site_name: title,
    images: [
      {
        url: canonical + '/og/image.jpg',
        width: 942,
        height: 466,
        alt: title
      }
    ]
  },
  twitter: {
    handle: '@cosmologyapp',
    site: '@cosmologyapp'
  },
  facebook: fbAppId
    ? {
        appId: fbAppId
      }
    : undefined
};
