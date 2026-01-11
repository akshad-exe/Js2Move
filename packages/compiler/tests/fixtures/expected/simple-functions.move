address SimpleMath {
module SimpleMath {
    use std::signer;
    use std::vector;

    public fun add(a: u64, b: u64): u64 {
        return a + b;
    }

    public fun multiply(x: u64, y: u64): u64 {
        return x * y;
    }
}
}
