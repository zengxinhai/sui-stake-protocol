import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";

type ConstructorParams = {
  seed: Uint8Array,
  pkgId: string,
  protocolId: string,
  adminCapId: string,
  rewardType: string,
  witName: string,
}
export class Protocol {
  private readonly pkgId: string;
  private readonly protocolId: string;
  private readonly adminCapId: string;
  private readonly rewardType: string;
  private readonly witType: string;
  private readonly signer: RawSigner;
  constructor(params: ConstructorParams) {
    const { seed, pkgId, protocolId, adminCapId, rewardType, witName } = params;
    this.pkgId = pkgId;
    this.protocolId = protocolId;
    this.adminCapId = adminCapId;
    this.rewardType = rewardType;
    this.witType = `${pkgId}/${witName.toLowerCase()}/${witName.toUpperCase()}`;
    const keypair = Ed25519Keypair.fromSeed(seed);
    const provider = new JsonRpcProvider();
    this.signer = new RawSigner(keypair, provider);
  }
  
  async createPool(stakeCoinType: string, rewardsPerSec: number) {
    const now = Math.floor(Date.now() / 1000);
    return this.signer.executeMoveCall({
      packageObjectId: this.pkgId,
      module: 'stake_sea',
      function: 'create_pool',
      typeArguments: [this.witType, this.rewardType, stakeCoinType],
      arguments: [this.adminCapId, this.protocolId, rewardsPerSec, now],
      gasBudget: 1000000,
    })
  }
  
  async topupReward(rewardId: string) {
    return this.signer.executeMoveCall({
      packageObjectId: this.pkgId,
      module: 'stake_sea',
      function: 'topup_rewards',
      typeArguments: [this.witType, this.rewardType],
      arguments: [this.protocolId, rewardId],
      gasBudget: 1000000,
    })
  }
  
  async stake(stakeCoinType: string, coinId: string) {
    const now = Math.floor(Date.now() / 1000);
    return this.signer.executeMoveCall({
      packageObjectId: this.pkgId,
      module: 'stake_sea',
      function: 'stake_',
      typeArguments: [this.witType, this.rewardType, stakeCoinType],
      arguments: [this.protocolId, coinId, now],
      gasBudget: 1000000,
    })
  }
}
