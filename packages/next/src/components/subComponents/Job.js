import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @typedef {('queued'|'running'|'success'|'failed')} Status
 */

const Jobs = ({ driver, job }) => {
  /** @type {[Status, (Status)=>void]} */
  const [status, setStatus] = useState('queued');

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = driver.getStatus(job.txnId);
      setStatus(newStatus);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  /**
   *
   * @param {Status} status
   */
  function getColor(status) {
    if (status === 'queued') return '#333';
    if (status === 'running') return 'yellow';
    if (status === 'success') return 'green';
    if (status === 'failed') return 'red';
  }

  return (
    <div className="job-container">
      <div
        className="job-status-indicator"
        style={{ backgroundColor: getColor(status) }}
      />
      <p className="detail-text">
        {job.type === 'swap'
          ? 'Swap ' + job.job.inputCoin + ' for ' + job.job.targetCoin
          : job.type === 'joinPool'
          ? 'Deposit into pool #' + job.job.poolId
          : job.type === 'lockTokens'
          ? 'Lock LP for pool #' + job.job.poolId
          : 'UNKNOWN JOB TYPE - this is not expected'}
      </p>
      <p
        className="main-text"
        style={{
          fontSize: 12,
          opacity: 0.5,
          textTransform: 'uppercase',
          marginLeft: 'auto'
        }}
      >
        {job.type}
      </p>
    </div>
  );
};

export default Jobs;
