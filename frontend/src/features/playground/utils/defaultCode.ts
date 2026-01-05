export const DEFAULT_MOVEJS_CODE = `module counter {
  resource Counter {
    value: u64
  }

  public fun create(): Counter {
    return Counter { value: 0 };
  }

  public fun increment(counter: &mut Counter) {
    counter.value = counter.value + 1;
  }

  public fun getValue(counter: &Counter): u64 {
    return counter.value;
  }
}`;

export const EXAMPLES = {
  counter: DEFAULT_MOVEJS_CODE,
  
  token: `module token {
  resource Coin {
    value: u64,
    owner: address
  }

  public fun mint(owner: address, amount: u64): Coin {
    return Coin { 
      value: amount,
      owner: owner
    };
  }

  public fun burn(coin: Coin) {
    // Token burned
  }

  public fun transfer(coin: Coin, recipient: address): Coin {
    return Coin {
      value: coin.value,
      owner: recipient
    };
  }
}`,

  nft: `module nft {
  resource NFT {
    id: u64,
    owner: address,
    metadata: string
  }

  public fun create(id: u64, owner: address, metadata: string): NFT {
    return NFT { 
      id: id,
      owner: owner,
      metadata: metadata
    };
  }

  public fun transfer(nft: NFT, new_owner: address): NFT {
    return NFT {
      id: nft.id,
      owner: new_owner,
      metadata: nft.metadata
    };
  }
}`,

  vault: `module vault {
  resource Vault {
    owner: address,
    balance: u64,
    is_locked: bool
  }

  public fun create_vault(owner: address): Vault {
    return Vault {
      owner: owner,
      balance: 0,
      is_locked: false
    };
  }

  public fun deposit(vault: &mut Vault, amount: u64) {
    if (vault.is_locked) {
      abort 1;
    }
    vault.balance = vault.balance + amount;
  }

  public fun withdraw(vault: &mut Vault, amount: u64): u64 {
    if (vault.balance < amount) {
      abort 2;
    }
    vault.balance = vault.balance - amount;
    return amount;
  }
}`,

  marketplace: `module marketplace {
  resource Listing {
    seller: address,
    item_id: u64,
    price: u64,
    active: bool
  }

  public fun list_item(seller: address, item_id: u64, price: u64): Listing {
    return Listing {
      seller: seller,
      item_id: item_id,
      price: price,
      active: true
    };
  }

  public fun cancel_listing(listing: &mut Listing) {
    listing.active = false;
  }
}`,

  staking: `module staking {
  resource Stake {
    staker: address,
    amount: u64,
    duration: u64,
    reward_rate: u64
  }

  public fun stake(staker: address, amount: u64, duration: u64): Stake {
    return Stake {
      staker: staker,
      amount: amount,
      duration: duration,
      reward_rate: 10
    };
  }

  public fun calculate_reward(stake: &Stake): u64 {
    return (stake.amount * stake.reward_rate) / 100;
  }
}`
};