import React, { Component, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PoolPairImage from './subComponents/PoolPairImage';

const tableDef = {
  id: {
    displayName: '#',
    basis: '10%',
    valueFormat: (value) => value,
    hidden: false
  },
  poolAssetsPretty: {
    displayName: 'POOLS',
    basis: '50%',
    valueFormat: (value, row) => {
      return (
        <>
          <PoolPairImage images={row.images} height={30} />
          <p style={{ marginLeft: 8 }}>
            {value[0].symbol + '/' + value[1].symbol}
          </p>
        </>
      );
    },
    hidden: false
  },
  liquidity: {
    displayName: 'LIQUIDITY',
    basis: '25%',
    valueFormat: (value) => value,
    hidden: false
  }
};

const data = [
  {
    poolNum: '611',
    pools: ['ATOM', 'OSMO'],
    liquidity: '$108908452'
  }
];

const PoolAdder = ({ data, addPool, setShowPoolAdder }) => {
  const [searchStr, setSearchStr] = useState('');
  const [showAll, setShowAll] = useState(false);

  const cols = Object.keys(tableDef);

  function handleAdd(pool) {
    pool.isSingle = false;
    pool.rewardAlloc = 100;

    addPool(pool);
  }

  data = searchStr
    ? data.filter((d) => {
        const inOrder = (
          d.poolAssetsPretty[0].symbol +
          '/' +
          d.poolAssetsPretty[1].symbol
        ).toLowerCase();
        const reversed = (
          d.poolAssetsPretty[1].symbol +
          '/' +
          d.poolAssetsPretty[0].symbol
        ).toLowerCase();
        return (
          inOrder.includes(searchStr.toLowerCase()) ||
          reversed.includes(searchStr.toLowerCase()) ||
          d.id === searchStr
        );
      })
    : data;
  data = showAll ? data : data.slice(0, 3);

  const rows = React.useMemo(() => {
    return data.map((row, i) => {
      return (
        <div
          className="pool-adder__table__row"
          key={'' + row.id + i + row.nickname}
          style={{ overflow: 'scroll' }}
        >
          {cols.map((cKey) => {
            const colDef = tableDef[cKey];
            const colValue = row[cKey];
            const colDisplayValue = colDef.valueFormat
              ? colDef.valueFormat(colValue, row)
              : colValue;

            return (
              <div
                className="pool-adder__table__item"
                key={colDef.displayName}
                style={{ flexBasis: colDef.basis, maxWidth: colDef.basis }}
              >
                {typeof colDisplayValue === 'string' ? (
                  <p>{colDisplayValue}</p>
                ) : (
                  colDisplayValue
                )}
              </div>
            );
          })}
          <button
            className="secondary-button pool-adder__table-row__addbtn"
            style={{ color: '#0089FF' }}
            onClick={() => handleAdd(row)}
          >
            Add Pool
          </button>
        </div>
      );
    });
  }, [data, showAll]);

  return (
    <div className="pool-adder__root">
      <div
        className="pool-adder__input-bar"
        style={{ marginBottom: 8, width: '100%' }}
      >
        <input
          className="pool-adder__input"
          placeholder="Start typing..."
          value={searchStr}
          onChange={(e) => setSearchStr(e.currentTarget.value)}
        ></input>
        <FontAwesomeIcon icon="search" className="pool-adder__icon" />
        <button
          className="secondary-button-darker"
          onClick={() => setShowPoolAdder(false)}
          style={{
            marginLeft: 'auto',
            float: 'right',
            height: 28,
            padding: `4px 24px`
          }}
        >
          Done
        </button>
      </div>
      <div className="pool-adder__table__container">
        <div className="pool-adder__table__toolbar">
          {cols.map((cKey) => {
            const colDef = tableDef[cKey];
            return (
              <div
                className="pool-adder__table__item"
                key={colDef.displayName}
                style={{ flexBasis: colDef.basis }}
              >
                <p>{colDef.displayName}</p>
              </div>
            );
          })}
        </div>
        <div className="pool-adder__table__body">
          {rows}
          {!showAll && (
            <button
              className="secondary-button"
              style={{
                height: 38,
                color: '#0089FF',
                width: '100%',
                borderRadius: 0
              }}
              onClick={() => setShowAll(true)}
            >
              Show All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolAdder;
