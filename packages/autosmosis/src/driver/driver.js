import { CoinGeckoToken, geckoPrice } from '../clients/coingecko'
import { Token } from '../model/Token'
import { DriverClient } from './driverclient'

/**
 * @param {*} allocationsAndWeights
 * @param {*} swaps
 * @returns true on success, else false
 * TODO return error message
 */
export function executeSwapsAndAllocate (allocationsAndWeights, swaps) {
  // 1. do the swaps
  swaps.array.forEach(swap => {
    DriverClient.swap(swap.inputCoin, swap.targetCoin, swap.amount)
  })

  // 2. deposit into the LP and bond
  allocationsAndWeights.array.forEach(allocation => {
    if (allocation.type === 'coin') {
      // do nothing
    }
    if (allocation.type === 'pool') {
      // DriverClient.joinPool(allocation.pool.id, totalBalance * allocation.weight * allocation.pool.balance)
      DriverClient.lockTokens(allocation.pool.id)
    }
  })
  return true
}

/**
 * getAllSwaps returns a list of swaps to achieve the desired allocations
 * sum of all weights must === 1
 * @param {*} allocationsAndWeights is a list of desired final pools/coins and their weights
 * @returns a list of swaps
 */
export function getAllSwaps (allocationsAndWeights) {
  var swaps = []

  // 1. get the wallet balances
  var walletBalances = DriverClient.getWalletBalances()

  // 2. determine all coins we'll allocate to
  var coinsForAllocation = getCoinsForAllocation(allocationsAndWeights)

  // 3. fetch all the needed prices
  var prices = getNeededPrices(coinsForAllocation, walletBalances)

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
      swaps.push({ inputCoin: coin, targetCoin: 'UST', amount: amount })
    } else {
      throw Error(coin)
    }
  }

  // 7. swap to needed coins
  for (const [coin, amount] of Object.entries(finalNeededCoinAmounts)) {
    if ('UST' !== coin) {
      swaps.push({ inputCoin: 'UST', targetCoin: coin, amount: amount })
    }
  }

  return swaps
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

function getNeededPrices (coinsForAllocation, walletBalances) {
  var neededPrices = coinsForAllocation

  for (const [coin, _] of Object.entries(walletBalances)) {
    neededPrices.push(coin)
  }

  return DriverClient.getPrices(neededPrices)
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
