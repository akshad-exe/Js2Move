address SingleResource {
module SingleResource {
    use std::signer;
    use std::vector;

    struct Balance has key, store {
        value: u64
    }

    public entry fun init(owner: &signer, amount: u64) {
        move_to(owner, Balance { value: amount });
    }
}
}
