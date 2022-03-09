import Head from 'next/head';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [apr, setAPR] = useState('90');
  const [period, setPeriod] = useState('1');

  function handleTest() {
    axios.get('/api/go');
  }

  return (
    <div className="backdrop">
      <Head>
        <title>Dexmos</title>
        <meta name="description" content="Dexmos | Osmosis Yield Automation" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          type="text/css"
          href="//fonts.googleapis.com/css?family=Comfortaa"
        />
      </Head>

      <main
        className={styles.main}
        style={{ justifyContent: 'flex-start', paddingTop: 0 }}
      >
        <div
          style={{
            width: '100%',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 16
          }}
        >
          <img
            src="/logo.svg"
            width={32}
            height={32}
            style={{ marginRight: 8 }}
          ></img>
          <h4 style={{ fontFamily: 'Comfortaa' }}>dexmos</h4>
        </div>
        {/* <button onClick={() => handleTest()}>click me</button> */}

        <img
          src="/automateosmosis.png"
          style={{ maxWidth: 350, marginTop: 60, opacity: 0.5 }}
        />

        <h2 className="main-text paragraph" style={{ marginTop: 60 }}>
          Automating DeFi in the Cosmos.
        </h2>
        <p className="detail-text paragraph">
          Automate your daily Osmosis rewards reinvestments with dexmos.finance
        </p>
        <button
          className="action-button"
          style={{ fontWeight: 300 }}
          onClick={() => (window.location.href = '/app')}
        >
          View Demo
        </button>

        {/* <div className='calculator-container'>
          <div className='horiz' style={{ width: 350, marginBottom: 8 }}>
            <p className='detail-text' style={{ marginRight: 'auto' }}>APR (%):</p>
            <input className='calculator-input' style={{ textAlign: 'right' }} type={'number'} value={apr} onChange={e => setAPR(e.currentTarget.value)}></input>
          </div>
          <div className='horiz' style={{ width: 350, marginBottom: 8 }}>
            <p className='detail-text' style={{ marginRight: 'auto' }}>Time held (months):</p>
            <input className='calculator-input' style={{ textAlign: 'right' }} type={'number'} value={period} onChange={e => setPeriod(e.currentTarget.value)}></input>
          </div>
        </div>

        <div className='horiz'>
          <div style={{ background: '#212838', borderRadius: 20, width: 350, marginRight: 8 }}>
            <h4 className='main-text'>Collecting rewards without reinvesting</h4>
            <p className='main-text'>Total Reward: {100 * (1 + Number(apr) / (Number(period) / 12)) ^ (Number(period) / 12 * 1)}</p>
          </div>

          <div style={{ position: 'relative' }}>
            <div className='defi-backdrop'></div>
            <div style={{ background: '#212838', borderRadius: 20, width: 350, marginLeft: 8 }} className='defi-img'>
              <h4 className='main-text'>Collecting rewards without reinvesting</h4>
              <p className='main-text'>Total Reward: {100 * (1 + Number(apr) / (Number(period) / 12)) ^ (Number(period) / 12 * 1)}</p>
            </div>
          </div> */}

        {/* </div> */}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
