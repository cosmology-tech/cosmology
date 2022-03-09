import '../styles/globals.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
