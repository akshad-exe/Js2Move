address Minimal {
module Minimal {
    use std::signer;
    use std::vector;

    struct Data has key, store {
        value: u64
    }
}
}
