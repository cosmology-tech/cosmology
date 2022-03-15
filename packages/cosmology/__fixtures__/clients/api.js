import getPoolsFixture from '../lcd/osmosis/gamm/v1beta1/pools/data.json';
import getLockableDurationsFixture from '../lcd/osmosis/pool-incentives/v1beta1/lockable_durations/data.json'
import getGaugesFixture from '../lcd/osmosis/incentives/v1beta1/gauges/data.json';
import getActiveGaugesFixture from '../lcd/osmosis/incentives/v1beta1/active_gauges/data.json';
import getGaugeFixture from '../lcd/osmosis/incentives/v1beta1/gauge_by_id/600/data.json';
import getIncentivizedPoolsFixture from '../lcd/osmosis/pool-incentives/v1beta1/incentivized_pools/data.json';

export class OsmosisApiClient {

  async getPools() {
    return getPoolsFixture;
  }

  async getPool(poolId) {
    console.warn('NOT IMPLEMENTED IN TESTING');
  }

  async getAccountLockedLongerDuration(address) {
    console.warn('NOT IMPLEMENTED IN TESTING');
  }

  async getAccountLockedCoins(address) {
    console.warn('NOT IMPLEMENTED IN TESTING');
  }

  async getEpochProvision() {
    console.warn('NOT IMPLEMENTED IN TESTING');  
  }

  async getEpochs() {
    console.warn('NOT IMPLEMENTED IN TESTING');  
  }

  async getDistrInfo() {
    console.warn('NOT IMPLEMENTED IN TESTING');  
  }

  async getParams() {
    console.warn('NOT IMPLEMENTED IN TESTING');
  }

  async getLockableDurations() {
    return getLockableDurationsFixture;
  }

  async getGauges() {
    return getGaugesFixture;
  }

  async getActiveGauges() {
    return getActiveGaugesFixture;
  }

  async getGauge(gaugeId) {
    return getGaugeFixture;
  }

  async getIncentivizedPools() {
    return getIncentivizedPoolsFixture;
  }

}