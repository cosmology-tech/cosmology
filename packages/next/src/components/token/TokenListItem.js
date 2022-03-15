import React, { Component, useState } from 'react';
import { getCoinFromDenom } from 'cosmology';

const TokenListItem = ({
  token: {
    denom = '',
    liquidity = 0,
    liquidity_24h_change = 0,
    name = '',
    price = 0,
    price_24h_change = -0,
    symbol = '',
    value = '',
    volume_24h = 0,
    volume_24h_change = 0
  },
  dropDownConfig = null
}) => {
  const coin = getCoinFromDenom(denom);

  // "logo_URIs": {
  //     "png": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.png",
  //     "svg": "https://raw.githubusercontent.com/osmosis-labs/assetlists/main/images/osmo.svg"
  // },

  const { png: pngSrc } = coin?.logo_URIs || {};

  return (
    <div
      className={
        dropDownConfig ? 'token-list-item clickable' : 'token-list-item'
      }
      onMouseDown={
        dropDownConfig
          ? (e) =>
              dropDownConfig.onMouseDown({
                ...e,
                preventDefault: e.preventDefault,
                currentTarget: { value }
              })
          : null
      } //super hack to enable this element to be a div
      style={{ listStyle: 'none', listStyleType: 'none' }}
    >
      <img src={pngSrc} />
      <div>
        <h4 className="main-text">{name}</h4>
        <p className="detail-text">{symbol}</p>
      </div>
      {/* {dropDownConfig &&
            <button type="button" className='secondary-button' {...dropDownConfig} style={{ marginLeft: 'auto', fontSize: 12 }}>
                choose
            </button>
        } */}
    </div>
  );
};

export default TokenListItem;
