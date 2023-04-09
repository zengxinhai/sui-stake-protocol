# Sui Stake Protocol

A versatile protocol designed to simplify the process of creating staking pools for various projects. 
With this protocol, projects can easily create their own staking pools and offer staking services to their users.
By implementing Sui Stake Protocol, projects can benefit from an efficient, secure, and scalable staking infrastructure, while users can participate in staking and earn rewards with ease. Sui Stake Protocol empowers projects to enhance their user engagement and drive growth through staking services.

## Highlights
1. super easy to use Sui Stake Protocol, less than 10 lines of Move code
2. Out of the box SDK (typescript)

## Usage

### Set up the staking pools for your projects
1. Import the stake protocol module
2. The reward coin type, e.g. USDC
3. Create a stake sea and transfer the admin capability to the sender

```Rust
module test_stake::test_stake {
  use sui::tx_context::{Self, TxContext};
  use sui::transfer;
  // Import the stake protocol module
  use stake::stake_sea;
  // The reward coin type, e.g. USDC
  use test_coins::usdc::USDC;
  
  struct TEST_STAKE has drop {}
  
  fun init(wit: TEST_STAKE, ctx: &mut TxContext) {
    // Create a stake sea and transfer the admin capability to the sender
    let (stakeSea, adminCap) = stake_sea::new<TEST_STAKE, USDC>(wit, ctx);
    transfer::share_object(stakeSea);
    transfer::transfer(adminCap, tx_context::sender(ctx));
  }
}
```

### Use SDk to interact with the staking pools

For example:
```typescript
import { Protocol } from 'sui-staking-protocol-sdk'
import {  pkgId, protocolId, adminCapId } from './constants/objects'


const rewardType = `${pkgId}::usdc::USDC`;
const witType = `${pkgId}::test_stake::TEST_STAKE`;


export const stakeProtocol = new Protocol({
  pkgId,
  protocolId,
  adminCapId,
  seed,
  witType,
  rewardType,
})

// Topup reward pools
stakeProtocol.topupReward(usdcCoinId).then(console.log);

//... There're other actions such as stake, unstake, etc. Please refer to the docs
```

