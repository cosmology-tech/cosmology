import React, { Component, useState } from 'react';
import axios from 'axios';
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faSearch } from '@fortawesome/fontawesome-free-solid'
import ReactSlider from 'react-slider'
import { assets } from 'autosmosis';
import PoolAdder from '../src/components/PoolAdder';

const styles = {
    fontFamily: 'sans-serif',
    textAlign: 'center',
};

fontawesome.library.add(faTimes);

const defaultPools = [
    {
        icon: '/terra.png',
        displayName: 'UST',
        rewardAlloc: 100,
        isPair: false
    }
]

const App = (props) => {

    const [pools, setPools] = useState(defaultPools);
    const [showPoolAdder, setShowPoolAdder] = useState(true);

    function handleRewardAllocChange(pidx, newValue) {
        setPools(pools.map((p, i) => {
            if (i === pidx) p.rewardAlloc = newValue
            return p;
        }));
    }

    return <div>
        <div className='container maxwidth-xs' style={{ marginTop: 120, textAlign: 'center' }}>
            <div className='grid-container light-border column' style={{ borderRadius: 32, alignItems: 'stretch' }}>
                <div className='grid-item' style={{ textAlign: 'center' }}>
                    <h3 className='main-text paragraph'>Auto-Compounder Config</h3>
                </div>
                <div className='grid-item' style={{ textAlign: 'left' }}>
                    <p className='detail-text' style={{ paddingLeft: 8 }}>Pools</p>
                    <div className='pool-list'>
                        {pools.map((pool, i) => {
                            return <div key={pool.displayname + i} className='pool light-border'>
                                <div className='delete'><FontAwesomeIcon icon='times' /></div>
                                <img className='icon' src={pool.icon} />
                                <h4 className='main-text'>{pool.displayName}</h4>
                                <div style={{ flex: 1 }}>
                                    {/* <ReactSlider style={{ width: 200 }} disabled={true} min={0} max={100} value={pool.rewardAlloc} /> */}
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="example-thumb"
                                        trackClassName="example-track"
                                        value={pool.rewardAlloc}
                                        min={0}
                                        max={100}
                                        onChange={nv => handleRewardAllocChange(i, nv)}
                                    />
                                </div>
                                <input style={{ textAlign: 'right', marginRight: 0 }} className='percentage-input' type='number' value={pool.rewardAlloc} onChange={(e) => handleRewardAllocChange(i, e.currentTarget.value)}></input>
                                <p className='detail-text' style={{ marginLeft: 0 }}>%</p>
                            </div>
                        })}
                        {showPoolAdder ?
                            <PoolAdder />
                            :
                            <button onClick={() => setShowPoolAdder(true)} className='secondary-button' style={{ marginBottom: 8, alignSelf: 'center', fontSize: 14 }}><FontAwesomeIcon icon='plus' style={{ marginRight: 8 }} />Add Pool</button>
                        }
                    </div>
                </div>
                <div className='grid-item' style={{ display: 'flex', flex: 1 }}>
                    <button className='action-button' style={{ flex: 1, height: 60 }}>Preview swaps &amp; fees</button>
                </div>
            </div>
            <p className="detail-text" style={{ fontSize: 12 }}>Want this to run automatically every day? Use our <a href="#" style={{ color: "#0089FF" }}><b>NPM module</b></a></p>
        </div>
    </div>
}

export default App