const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
const BLOCKS_IN_A_YEAR = SECONDS_PER_YEAR / 14;
const aprToApy = (interest, frequency = BLOCKS_IN_A_YEAR) =>
  ((1 + interest / 100 / frequency) ** frequency - 1) * 100;

const convertAprToApyObj = (obj) => {
  return {
    ...obj,
    apy_1d: aprToApy(obj.apr_1d),
    apy_7d: aprToApy(obj.apr_7d),
    apy_14d: aprToApy(obj.apr_14d)
  };
};

const pickApr =
  ({ lockup }) =>
  (el) => {
    const { apr_1d, apr_7d, apr_14d, apy_1d, apy_7d, apy_14d, ...rest } = el;
    if (lockup == '14') {
      return {
        ...rest,
        apr_14d,
        apy_14d
      };
    }
    if (lockup == '1') {
      return {
        ...rest,
        apr_1d,
        apy_1d
      };
    }
    if (lockup == '7') {
      return {
        ...rest,
        apr_7d,
        apy_7d
      };
    }
  };

export const getPoolAprs = async ({
  api,
  validator,
  poolIds,
  liquidityLimit = 100_000,
  lockup = '14'
}) => {
  // convert to string
  poolIds = poolIds.map((item) => item + '');

  const filterProps = pickApr({ lockup });

  const {
    lockable_durations: [d1, d7, d14]
  } = await api.getLockableDurations();
  const { incentivized_pools } = await api.getIncentivizedPools();
  // const gauges = await api.getActiveGauges();

  let ldur;
  switch (lockup) {
    case '1':
      ldur = d1;
      break;
    case '7':
      ldur = d7;
      break;
    case '14':
      ldur = d14;
      break;
    default:
      ldur = d14;
  }

  const incentives = incentivized_pools.filter(
    ({ pool_id, lockable_duration }) =>
      poolIds.includes(pool_id) && lockable_duration === ldur
  );

  const send = [];

  for (let p = 0; p < poolIds.length; p++) {
    const gaugeInfo = incentives.find(({ pool_id }) => pool_id == poolIds[p]);
    let gauge;
    if (gaugeInfo) {
      gauge = await api.getGauge(gaugeInfo.gauge_id);
    }

    const [{ apr_list }] = await validator.getPoolApr(poolIds[p]);

    const osmoIncentives = apr_list
      .filter((i) => new Date(i.start_date) <= new Date() && i.symbol == 'OSMO')
      .map(convertAprToApyObj)
      .map(filterProps);

    const externalIncentives = apr_list
      .filter((i) => new Date(i.start_date) <= new Date() && i.symbol != 'OSMO')
      .map(convertAprToApyObj)
      .map(filterProps);

    const futureIncentives = apr_list
      .filter((i) => new Date(i.start_date) > new Date())
      .map(convertAprToApyObj)
      .map(filterProps);

    const totalIncentives = filterProps(
      convertAprToApyObj(
        apr_list
          .filter((i) => new Date(i.start_date) <= new Date())
          .reduce(
            (m, incentive) => {
              m.apr_1d += incentive.apr_1d;
              m.apr_7d += incentive.apr_7d;
              m.apr_14d += incentive.apr_14d;
              return m;
            },
            {
              apr_1d: 0,
              apr_7d: 0,
              apr_14d: 0
            }
          )
      )
    );

    send.push({
      poolId: poolIds[p],
      osmoIncentives,
      externalIncentives,
      futureIncentives,
      totalIncentives,
      gauge: gauge.gauge
    });
  }
  return send;
};
