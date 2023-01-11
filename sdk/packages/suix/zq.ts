import { signer } from "./common";

let zqPkgId = '0x57dc8bceae4503bb6f75b2ab4eabcae8a4df5515';
let zqTreasuryId = '0xc86e9fb542997187d3468536060806d60a457375';

export const claimZq = async (amount: number) => {
  return signer.executeMoveCall({
    packageObjectId: zqPkgId,
    module: 'zq',
    function: 'claim_',
    typeArguments: [],
    arguments: [zqTreasuryId, amount],
    gasBudget: 1000000,
  })
}