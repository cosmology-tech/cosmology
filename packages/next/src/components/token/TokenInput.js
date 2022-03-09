import SelectSearch from 'react-select-search';
import React, { Component, useState, useEffect } from 'react';
import TokenListItem from './TokenListItem';

const TokenInput = ({ tokens, value, onChange }) => {

    // need outer to pass in cortectly
    // useEffect(() => {
    //     setOptions(tokens ? tokens.map(t => ({ ...t, value: t.symbol })) : [])
    // }, [tokens]);

    const options = tokens ? tokens.map(t => ({ ...t, value: t.denom })) : [];

    function filterOptions(opts) {
        return (value) => opts.filter(opts => {
            const test = opts.symbol.toLowerCase();
            return test.includes(value);
        }); // top 3 only
    }

    function customRenderOption(value, option, snapshot, other, other2, other3) {
        // console.log(value, option, snapshot, other);
        return <TokenListItem token={option} dropDownConfig={value} />
    }

    console.log({options});

    return <div>
        <SelectSearch
            search
            filterOptions={filterOptions}
            renderOption={customRenderOption}
            options={options}
            value={value}
            onChange={onChange}
            placeholder="Start typing..." />
        {/* <SelectSearch search filterOptions={(v) => options} options={options} value="sv" placeholder="Choose your language" /> */}
    </div>
}

export default TokenInput