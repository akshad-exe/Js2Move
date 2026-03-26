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
    value: u64
  }

  public fun mint(amount: u64): Coin {
    return Coin { value: amount };
  }

  public fun transfer(coin: Coin, recipient: address) {
    // Transfer logic here
  }
}`,

  nft: `module nft {
  resource NFT {
    id: u64,
    owner: address
  }

  public fun create(id: u64, owner: address): NFT {
    return NFT { id, owner };
  }
}`,
};