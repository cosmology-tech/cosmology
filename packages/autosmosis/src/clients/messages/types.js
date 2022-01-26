/**
 * @typedef {{
 * poolId:string;
 * tokenOutDenom:string;
 * }} Route
 *
 * @typedef {{
 * amount:string;
 * denom:string;
 * }} Coin
 *
 * @typedef {{
 * sender: string;
 * routes: Route[];
 * tokenIn: Coin;
 * tokenOutMinAmount: string;
 * }} SwapMessage
 *
 * @typedef {{
 * sender: string;
 * poolId: string;
 * shareOutAmount: string;
 * tokenInMaxs: Coin[]
 * }} JoinPoolMessage

* @typedef {{
 * sender: string;
 * poolId: string;
 * tokenIn: Coin
 * shareOutMinAmount: string;
 * }} JoinSwapPoolMessage
 *
 * @typedef {{
 * owner: string;
 * duration: string;
 * coins: Coin[];
 * }} LockMessage
 *
 * @typedef {{
 * type: string;
 * value: SwapMessage|LockMessage|JoinPoolMessage|JoinSwapPoolMessage
 * }} MsgDelegate
 */
