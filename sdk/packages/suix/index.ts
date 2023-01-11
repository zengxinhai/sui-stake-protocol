import { createPool, topupReward, stake } from './stake'
import { claimZq } from './zq'

const zqCoinId = '0x7c9e1d5ddb4269a054f1d81402eb11d5b9875f56';

(async () => {
  const res = await stake('0x2::sui::SUI', zqCoinId);
  console.log(res);
})()

