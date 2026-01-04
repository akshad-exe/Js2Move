module Expressions {
  use std::signer;
  use std::vector;

  public entry fun math_ops(
    a: u64,
    b: u64
  ): u64 {
    return a + b * a - b;
  }
  

  public entry fun logical_ops(
    x: bool,
    y: bool
  ): bool {
    return x && y || false;
  }
  

  public entry fun comparison(
    n: u64
  ): bool {
    return n >= 10 && n <= 100;
  }
  

}
