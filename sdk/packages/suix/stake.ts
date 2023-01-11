import { signer } from "./common";

let stakeSeaPkgId = '0x11e82068c1c10332da8daaff0c290d34a64a4f0e';
let stakeAdminCapId = '0x72260c32d5a4a22fddaf857267962d9b28a150c0';
let stakeSeaId = '0x5c600ec5ac997fdca7d2293dbff853dc39a2c938';

let myStakePkgId = '0x57dc8bceae4503bb6f75b2ab4eabcae8a4df5515';
let witType = `${myStakePkgId}::my_stake::MY_STAKE`;
let rewardType = `${myStakePkgId}::zq::ZQ`;

export const createPool = async (stakeCoinType: string, rewardsPerSec: number) => {
  const now = Math.floor(Date.now() / 1000);
  return signer.executeMoveCall({
    packageObjectId: stakeSeaPkgId,
    module: 'stake_sea',
    function: 'create_pool',
    typeArguments: [witType, rewardType, stakeCoinType],
    arguments: [stakeAdminCapId, stakeSeaId, rewardsPerSec, now],
    gasBudget: 1000000,
  })
}

export const topupReward = async (rewardId: string) => {
  const now = Math.floor(Date.now() / 1000);
  return signer.executeMoveCall({
    packageObjectId: stakeSeaPkgId,
    module: 'stake_sea',
    function: 'topup_rewards',
    typeArguments: [witType, rewardType],
    arguments: [stakeSeaId, rewardId],
    gasBudget: 1000000,
  })
}

export const stake = async (stakeCoinType: string, coinId: string) => {
  const now = Math.floor(Date.now() / 1000);
  return signer.executeMoveCall({
    packageObjectId: stakeSeaPkgId,
    module: 'stake_sea',
    function: 'stake_',
    typeArguments: [witType, rewardType, stakeCoinType],
    arguments: [stakeSeaId, coinId, now],
    gasBudget: 1000000,
  })
}
