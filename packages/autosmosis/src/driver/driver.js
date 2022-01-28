import { Token } from '../model/Token'
import { DriverClient } from './driverclient'
import asyncPool from 'tiny-async-pool'
import axios from 'axios'

export class Driver {
  constructor () {
    this.txnStatus = {}
  }

  getStatus (txnId) {
    return this.txnStatus[txnId]
  }

  /**
   * @param {*} jobs
   * @returns true on success, else false
   * TODO return error message
   */
  async executejobs (jobs) {
    let shouldExit = false

    const promises = asyncPool(1, jobs, async job => {
      if (shouldExit) {
        console.log('skipping txn')
        this.txnStatus[job.txnId]
        //optionally set internal transaction status to skipped
        return
      }

      // each job execution is a promise
      return new Promise(async resolve => {
        var txnHash = null
        if (job.type === 'swap') {
          txnHash = DriverClient.swap(
            job.job.inputCoin,
            job.job.targetCoin,
            job.job.amount
          )
        } else if (job.type === 'joinPool') {
          txnHash = DriverClient.joinPool(job.job.id, job.job.amount)
        } else if (job.type === 'swap') {
          txnHash = DriverClient.lockTokens(job.job.id)
        }

        setInterval(async () => {
          const status = await DriverClient.pollStatus(txnHash)

          if (status === 'failed') {
            shouldExit = true
            this.txnStatus[job.txnId] = 'failed'
            resolve()
          } else if (status === 'success') {
            this.txnStatus[job.txnId] = 'success'
            resolve()
          } else {
            // wait for next poll
          }
        }, 800) // poll for status every 800 ms
      })
    })

    return promises
  }

  /**
   * getAllJobs returns a list of jobs to achieve the desired allocations
   * sum of all weights must === 1
   * @param {*} allocationsAndWeights is a list of desired final pools/coins and their weights
   * @returns a list of jobs
   */
  async getAllJobs (allocationsAndWeights) {
    var jobs = []

    // 1. get the wallet balances
    var walletBalances = DriverClient.getWalletBalances()

    // 2. determine all coins we'll allocate to
    var coinsForAllocation = getCoinsForAllocation(allocationsAndWeights)

    // 3. fetch all the needed prices
    var prices = await getNeededPrices(coinsForAllocation, walletBalances)

    // 4. calculate my wallet's total balance
    var totalBalance = 0
    for (const [coin, amount] of Object.entries(walletBalances)) {
      totalBalance += prices[coin] * amount
    }

    // 5. calculate final amounts of needed coins
    var finalNeededCoinAmounts = getFinalNeededCoinAmounts(
      allocationsAndWeights,
      totalBalance
    )

    // 6. swap everything for UST
    for (const [coin, amount] of Object.entries(walletBalances)) {
      if ('UST' !== coin) {
        const txnId = Math.floor(Math.random() * 100000000) // random txn id (for internal use)
        this.txnStatus[txnId] = 'queued'
        jobs.push({
          type: 'swap',
          txnId,
          job: {
            inputCoin: coin,
            targetCoin: 'UST',
            amount: amount
          }
        })
      } else {
        throw Error(coin)
      }
    }

    // 7. swap to needed coins
    for (const [coin, amount] of Object.entries(finalNeededCoinAmounts)) {
      if ('UST' !== coin) {
        const txnId = Math.floor(Math.random() * 100000000) // random txn id (for internal use)
        this.txnStatus[txnId] = 'queued'
        jobs.push({
          type: 'swap',
          txnId,
          job: {
            inputCoin: 'UST',
            targetCoin: coin,
            amount: amount
          }
        })
      }
    }

    // 8. join all pools
    allocationsAndWeights.forEach(allocation => {
      if (allocation.type === 'pool') {
        const txnId = Math.floor(Math.random() * 100000000) // random txn id (for internal use)
        this.txnStatus[txnId] = 'queued'
        jobs.push(allocation, {
          type: 'joinPool',
          txnId,
          job: {
            poolId: allocation.pool.id,
            amount: totalBalance * allocation.weight * allocation.pool.balance
          }
        })
      }
    })

    // 9. lock tokens
    allocationsAndWeights.forEach(allocation => {
      if (allocation.type === 'pool') {
        const txnId = Math.floor(Math.random() * 100000000) // random txn id (for internal use)
        this.txnStatus[txnId] = 'queued'
        jobs.push(allocation, {
          type: 'lockTokens',
          txnId,
          job: {
            poolId: allocation.pool.id
          }
        })
      }
    })

    return jobs
  }
}

function getCoinsForAllocation (allocationsAndWeights) {
  var coinsForAllocation = []
  allocationsAndWeights.forEach(allocation => {
    if (allocation.type === 'coin') {
      if (!(allocation.coin in coinsForAllocation)) {
        coinsForAllocation.push(allocation.coin)
      }
    }
    if (allocation.type === 'pool') {
      if (!(allocation.pool.coin1 in coinsForAllocation)) {
        coinsForAllocation.push(allocation.pool.coin1)
      }
      if (!(allocation.pool.coin2 in coinsForAllocation)) {
        coinsForAllocation.push(allocation.pool.coin2)
      }
    }
  })
  return coinsForAllocation
}

async function getNeededPrices (coinsForAllocation, walletBalances) {
  var neededPrices = coinsForAllocation

  for (const [coin, _] of Object.entries(walletBalances)) {
    neededPrices.push(coin)
  }

  return await DriverClient.getPrices(neededPrices)
}

function getFinalNeededCoinAmounts (allocationsAndWeights, totalBalance) {
  var finalNeededCoinAmounts = {}
  allocationsAndWeights.forEach(allocation => {
    if (allocation.type === 'pool') {
      // coin1 in the pool
      var amountForAllocation =
        Math.floor(
          totalBalance * allocation.weight * allocation.pool.balance * 100
        ) / 100
      if (finalNeededCoinAmounts[allocation.coin1]) {
        finalNeededCoinAmounts[allocation.pool.coin1] += amountForAllocation
      } else {
        finalNeededCoinAmounts[allocation.pool.coin1] = amountForAllocation
      }

      // coin2 in the pool
      amountForAllocation =
        Math.floor(
          totalBalance * allocation.weight * 1 - allocation.pool.balance * 100
        ) / 100
      if (finalNeededCoinAmounts[allocation.coin2]) {
        finalNeededCoinAmounts[allocation.pool.coin2] += amountForAllocation
      } else {
        finalNeededCoinAmounts[allocation.pool.coin2] = amountForAllocation
      }
    }

    if (allocation.type === 'coin') {
      if (finalNeededCoinAmounts[allocation.coin]) {
        finalNeededCoinAmounts[allocation.coin] +=
          totalBalance * allocation.weight
      } else {
        finalNeededCoinAmounts[allocation.coin] =
          totalBalance * allocation.weight
      }
    }
  })
  return finalNeededCoinAmounts
}
