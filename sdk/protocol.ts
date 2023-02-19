import {Ed25519Keypair, getObjectFields, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
import {queryStakeData} from "./query";

type ConstructorParams = {
  seed: Uint8Array,
  pkgId: string,
  protocolId: string,
  adminCapId: string,
  rewardType: string,
  witType: string,
}
export class Protocol {
  private readonly pkgId: string;
  private readonly protocolId: string;
  private readonly adminCapId: string;
  private readonly rewardType: string;
  private readonly witType: string;
  private readonly signer: RawSigner;
  private readonly provider: JsonRpcProvider;
  constructor(params: ConstructorParams) {
    const { seed, pkgId, protocolId, adminCapId, rewardType, witType } = params;
    this.pkgId = pkgId;
    this.protocolId = protocolId;
    this.adminCapId = adminCapId;
    this.rewardType = rewardType;
    this.witType = witType;
    const keypair = Ed25519Keypair.fromSeed(seed);
    this.provider = new JsonRpcProvider();
    this.signer = new RawSigner(keypair, this.provider);
  }
  
  async createPool(stakeCoinType: string, rewardsPerSec: number) {
    const now = Math.floor(Date.now() / 1000);
    return this.signer.executeMoveCall({
      packageObjectId: this.pkgId,
      module: 'stake_sea',
      function: 'create_pool',
      typeArguments: [this.witType, this.rewardType, stakeCoinType],
      arguments: [this.adminCapId, this.protocolId, rewardsPerSec.toFixed(0), now.toString()],
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
  
  async stake(stakeCoinType: string, amount: number) {
    if (!stakeCoinType.startsWith('0x')) stakeCoinType = `0x${stakeCoinType}`;
    const now = Math.floor(Date.now() / 1000);
    const coinIds = await this.selectCoins(stakeCoinType, amount);
    
    const checkData = await this.getUserStakeData(stakeCoinType);
    if (!checkData) {
      return this.signer.executeMoveCall({
        packageObjectId: this.pkgId,
        module: 'stake_sea',
        function: 'stake_',
        typeArguments: [this.witType, this.rewardType, stakeCoinType],
        arguments: [this.protocolId, coinIds, amount.toString(), now.toString()],
        gasBudget: 1000000,
      })
    } else {
      const checkId = checkData.objectId;
      return this.signer.executeMoveCall({
        packageObjectId: this.pkgId,
        module: 'stake_sea',
        function: 'stake_more',
        typeArguments: [this.witType, this.rewardType, stakeCoinType],
        arguments: [this.protocolId, coinIds, amount.toString(), checkId, now.toString()],
        gasBudget: 1000000,
      })
    }
  }
  
  async unstake(stakeCoinType: string, amount: number) {
    if (!stakeCoinType.startsWith('0x')) stakeCoinType = `0x${stakeCoinType}`;
    const checkData = await this.getUserStakeData(stakeCoinType);
    if (!checkData) return null;
    const checkId = checkData.objectId;
    const now = Math.floor(Date.now() / 1000);
    return this.signer.executeMoveCall({
      packageObjectId: this.pkgId,
      module: 'stake_sea',
      function: 'unstake_',
      typeArguments: [this.witType, this.rewardType, stakeCoinType],
      arguments: [this.protocolId, checkId, amount.toString(), now.toString()],
      gasBudget: 1000000,
    })
  }
  
  async getStakeData() {
    return queryStakeData(this.pkgId, this.protocolId, this.rewardType, this.witType)
  }
  
  async getUserStakeData(stakeCoinType: string) {
    if (!stakeCoinType.startsWith('0x')) stakeCoinType = `0x${stakeCoinType}`;
    const addr = await this.signer.getAddress();
    const objects = await this.provider.getObjectsOwnedByAddress(addr);
    const checkType = `${this.pkgId}::check::StakeCheck<${this.witType}, ${this.rewardType}, ${stakeCoinType}>`
    const checks = objects.filter(obj => obj.type === checkType)
    if (checks.length === 0) return null
    const checkId = checks[0].objectId;
    const checkObj = await this.provider.getObject(checkId);
    const checkObjFields = getObjectFields(checkObj);
    // @ts-ignore
    return { staked: checkObjFields.staked, objectId: checkId }
  }
  
  async selectCoins(type: string, amount: number): Promise<string[]> {
    const addr = await this.signer.getAddress();
    const res = await this.provider.selectCoinSetWithCombinedBalanceGreaterThanOrEqual(
      addr,
      BigInt(amount),
      type
    );
    // @ts-ignore
    const objectIds = res.map(item => item.details?.reference?.objectId)
    return objectIds
  }
  
  async getBalances() {
    const provider = new JsonRpcProvider();
    const addr = await this.signer.getAddress();
    const balances = await provider.getAllBalances(addr);
    return balances
      .map(item => ({ type: item.coinType, balance: item.totalBalance }))
      .sort((a,b) => a.type > b.type ? 1 : -1)
  }
}
