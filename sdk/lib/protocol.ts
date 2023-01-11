import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";

export class Protocol {
  private witType: string;
  private signer: RawSigner;
  constructor(
    seed: Uint8Array,
    private pkgId: string,
    private protocolId: string,
    private adminCapId: string,
    private rewardType: string,
    witName: string,
  ) {
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
