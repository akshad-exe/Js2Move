module ControlFlow {
  use std::signer;
  use std::vector;

  public entry fun check(
    value: u64
  ): bool {
    if (value > 100) {
        return true;
      } else {
        return false;
      }
  }
  

  public entry fun loop_test(
    n: u64
  ) {
    while (n > 0) {
        n = n - 1;
      }
  }
  

}
