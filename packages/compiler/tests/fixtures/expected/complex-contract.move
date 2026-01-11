address TokenBank {
module TokenBank {
    use std::signer;
    use std::vector;

    struct Balance has key, store {
        amount: u64,
        locked: bool
    }

    struct Config has key, store {
        owner: address,
        fee: u64
    }

    public entry fun deposit(account: &signer, value: u64) {
        move_to(account, Balance { value: value });
    }

    public fun withdraw(account: &signer): u64 acquires Balance {
        return borrow_global<Balance>(account).value;
    }

    public fun calculate(x: u64, y: u64): u64 {
        return x + y * 10;
    }
}
}
