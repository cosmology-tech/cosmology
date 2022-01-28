
import React, { Component } from 'react';
import axios from 'axios';

const PoolPairImage = ({ images, height }) => {

    const firstImg = images[0];
    const secondImg = images[1];
    return <div className='pool-pair-image' style={{ height: height || 22, width: height*3/2 }}>
        <img src={firstImg && firstImg.images && firstImg.images.png} style={{ height, left: 0 }} /> 
        <img src={secondImg && secondImg.images && secondImg.images.png} style={{ height, left: height /2 }} />
    </div>
}

export default PoolPairImage
