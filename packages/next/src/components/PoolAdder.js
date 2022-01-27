import React, { Component } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PoolAdder = (props) => {

    return <div className='pool-adder__root'>
        <div className='pool-adder__input-bar'>
            <input className='pool-adder__input'></input>
            <FontAwesomeIcon icon='search' className='pool-adder__icon' />
        </div>
        <div className='pool-adder__table__container'>
            <div className='pool-adder__table__toolbar'>
                handleRewardAllocChange
            </div>
        </div>
    </div>
}

export default PoolAdder