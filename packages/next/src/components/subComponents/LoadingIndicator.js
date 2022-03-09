import React, { Component, useState } from 'react';
import axios from 'axios';
import { getColor } from '../../utils/utils';



const LoadingIndicator = ({
    loadables: {
        balances = { result: [] },
        tokens = [],
        pairsSummary = { data: [] },
        poolsInfo = { pools: [] },
    },
    loadConfig = {
        loadBalances: false,
        loadTokens: false,
        loadPairsSummary: false,
        loadPoolsInfo: false,
    },
    loading = false,
}) => {

    const [startLoad, setStartLoad] = useState(new Date());
    const [loadableIndicatorsDef, setLoadableIndicatorsDef] = useState([
        {
            name: 'Balances',
            loadedDate: null
        },
        {
            name: 'Tokens',
            loadedDate: null
        },
        {
            name: 'Pairs Summary',
            loadedDate: null
        },
        {
            name: 'Pools',
            loadedDate: null
        },
    ])

    const loadableIndicatorsConfig = [
        {
            name: 'Balances',
            variable: balances.result,
            show: loadConfig.loadBalances
        },
        {
            name: 'Tokens',
            variable: tokens,
            show: loadConfig.loadTokens
        },
        {
            name: 'Pairs Summary',
            variable: pairsSummary.data,
            show: loadConfig.loadPairsSummary
        },
        {
            name: 'Pools',
            variable: poolsInfo.pools,
            show: loadConfig.loadPoolsInfo
        },
    ];

    function Loadable({ name, idx, variable, loading, loadingCondition = null }) {
        const isLoaded = loadingCondition ? loadingCondition() : (variable && variable.length !== 0);

        if (isLoaded && !loadableIndicatorsDef[idx].loadedDate) {
            setLoadableIndicatorsDef(loadableIndicatorsDef.map((c, i) => {
                if (i === idx) {
                    c.loadedDate = new Date();
                }
                return c;
            }))
        }

        let loadingTime;
        if (loadableIndicatorsDef[idx].loadedDate) {
            loadingTime = loadableIndicatorsDef[idx].loadedDate.getTime() - startLoad.getTime()
        }

        return <div className='horiz' key={name}>
            <div className='job-status-indicator' style={{
                backgroundColor: isLoaded ? getColor('success') :
                    loading ? getColor('running') :
                        getColor('failed')
            }} />
            <p className='detail-text'>{name}</p>
            <p className='detail-text' style={{ marginLeft: 16 }}>{variable ? variable.length : 0} items</p>
            <p className='detail-text' style={{ marginLeft: 16 }}>{loadingTime}ms</p>
        </div>
    }

    return <div style={{border: '1px solid #212838'}}>
        {loadableIndicatorsConfig.filter(c => c.show).map((c, i) => Loadable({ ...c, idx: i, loading: loading }))}
    </div>
}

export default LoadingIndicator