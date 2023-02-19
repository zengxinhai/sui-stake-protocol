import { provider } from './common'
import { bcs } from '@mysten/sui.js'

type StakePool = {
  totalStaked: bigint,
  rewardRatePerSec: bigint,
  index: bigint,
  indexStaked: bigint,
  lastUpdated: bigint
}
bcs.registerStructType('StakePool', {
  totalStaked: 'u64',
  rewardRatePerSec: 'u64',
  index: 'u64',
  indexStaked: 'u64',
  lastUpdated: 'u64'
})

type TypeName = { name: string }
bcs.registerStructType('TypeName', {
  name: 'string'
})

type PoolData = { type: TypeName, data: StakePool }
bcs.registerStructType('PoolData', {
  type: 'TypeName',
  data: 'StakePool'
})

export type StakeData = {
  pools: PoolData[],
  rewardAmount: bigint,
  rewardType: TypeName
}
bcs.registerStructType('StakeData', {
  pools: 'vector<PoolData>',
  rewardAmount: 'u64',
  rewardType: 'TypeName',
})


function des(data: Uint8Array) {
  return bcs.de('StakeData', data)
}

export async function queryStakeData(pkgId: string, protocolId: string, rewardType: string, witType: string) {
  const sender = '7738ccc64bd64bb7b3524296db285042f7876281';
  const moveCall = {
    packageObjectId: pkgId,
    module: 'query',
    function: 'stake_data',
    typeArguments: [witType, rewardType],
    arguments: [protocolId]
  };
  const res = await provider.devInspectTransaction(sender, {
    kind: 'moveCall',
    data: moveCall
  })
  if ('Ok' in res.results) {
    const returnValues = res.results.Ok[0][1].returnValues;
    if (returnValues) {
      const returnData = returnValues[0][0];
      const d = Uint8Array.from(returnData);
      let decoded = des(d)
      return decoded as StakeData
    }
  }
  return null
}
