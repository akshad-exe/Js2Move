module SimpleMath {
  use std::signer;
  use std::vector;

  public entry fun add(
    a: u64,
    b: u64
  ): u64 {
    return a + b;
  }
  

  public entry fun multiply(
    x: u64,
    y: u64
  ): u64 {
    return x * y;
  }
  

}
