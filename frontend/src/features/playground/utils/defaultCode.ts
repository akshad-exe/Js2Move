export const DEFAULT_MOVEJS_CODE = `// 01-hello-world.movejs
// The simplest possible MoveJS contract

/**
 * Helloworld Contract
 * 
 * This contract demonstrates the basic structure of a MoveJS contract.
 * It contains a simple resource and an initialization function.
 */
contract Helloworld {
  // Define a resource to store a greeting message (single-field 'value' is used by codegen)
  resource Greeting { value: string };

  /**
   * Initialize the contract
   * @param owner - The address that will own the greeting
   * @param message - The initial greeting message
   */
  init(owner: address, message: string) {
    // Store the greeting for the owner (shorthand assignment)
    Greeting[owner] = message;
  }

  /**
   * Get a greeting for an address
   * @param addr - The address to get the greeting for
   * @returns The greeting message
   */
  getGreeting(addr: address): string {
    return Greeting[addr];
  }
}`;

export const EXAMPLES = {
  counter: `// 01-hello-world.movejs
// The simplest possible MoveJS contract

/**
 * Helloworld Contract
 * 
 * This contract demonstrates the basic structure of a MoveJS contract.
 * It contains a simple resource and an initialization function.
 */
contract Helloworld {
  // Define a resource to store a greeting message (single-field 'value' is used by codegen)
  resource Greeting { value: string };

  /**
   * Initialize the contract
   * @param owner - The address that will own the greeting
   * @param message - The initial greeting message
   */
  init(owner: address, message: string) {
    // Store the greeting for the owner (shorthand assignment)
    Greeting[owner] = message;
  }

  /**
   * Get a greeting for an address
   * @param addr - The address to get the greeting for
   * @returns The greeting message
   */
  getGreeting(addr: address): string {
    return Greeting[addr];
  }
}`,
  
  token: `// 02-simple-token.movejs
// A basic fungible token implementation

/**
 * SimpleToken Contract
 *
 * This contract implements a basic fungible token with:
 * - Balance tracking per address
 * - Simple storage and retrieval
 */
contract SimpleToken {
  // Resource to track token balances for each address
  resource Balance { value: u64 };

  // Resource to store total supply
  resource TotalSupply { value: u64 };

  /**
   * Initialize the token with initial supply
   * @param owner - The address that will receive the initial supply
   * @param initialSupply - The initial token supply
   */
  init(owner: address, initialSupply: u64) {
    // Set initial balance for owner
    Balance[owner] = initialSupply;

    // Store total supply
    TotalSupply[owner] = initialSupply;
  }

  /**
   * Set balance for an address (simplified transfer)
   * @param addr - The address to set balance for
   * @param amount - The amount to set
   */
  set_balance(addr: address, amount: u64) {
    Balance[addr] = amount;
  }

  /**
   * Get balance for an address
   * @param addr - The address to query
   * @returns The token balance
   */
  get_balance(addr: address): u64 {
    return Balance[addr];
  }

  /**
   * Get total supply
   * @param owner - The contract owner
   * @returns The total token supply
   */
  get_total_supply(owner: address): u64 {
    return TotalSupply[owner];
  }
}`,

  nft: `// 03-nft.movejs
// A non-fungible token (NFT) implementation

/**
 * NFT Contract
 *
 * This contract implements a basic NFT with:
 * - Ownership tracking per token ID
 * - Metadata URI storage
 */
contract NFT {
  // Resource to track NFT ownership (tokenId -> owner address)
  resource Owner { value: address };

  // Resource to track token metadata (tokenId -> metadata URI)
  resource TokenURI { value: string };

  /**
   * Initialize the NFT contract
   * @param creator - The contract creator address
   */
  init(creator: address) {
    // Initialize first token for creator
    Owner[creator] = creator;
    TokenURI[creator] = "nft://token/1";
  }

  /**
   * Set owner of an NFT
   * @param tokenId - The token ID (using address as ID for simplicity)
   * @param owner - The new owner address
   */
  set_owner(tokenId: address, owner: address) {
    Owner[tokenId] = owner;
  }

  /**
   * Get owner of an NFT
   * @param tokenId - The token ID to query
   * @returns The owner address
   */
  get_owner(tokenId: address): address {
    return Owner[tokenId];
  }

  /**
   * Set token URI
   * @param tokenId - The token ID
   * @param uri - The metadata URI
   */
  set_token_uri(tokenId: address, uri: string) {
    TokenURI[tokenId] = uri;
  }

  /**
   * Get token URI
   * @param tokenId - The token ID to query
   * @returns The metadata URI
   */
  get_token_uri(tokenId: address): string {
    return TokenURI[tokenId];
  }
}`,

  vault: `// 04-defi-vault.movejs
// A DeFi vault for staking and earning yield

/**
 * DeFiVault Contract
 *
 * This contract implements a basic staking vault with:
 * - Token deposits and withdrawals
 * - Balance tracking
 */
contract DeFiVault {
  // Resource to track user stakes
  resource Stakes { value: u64 };

  // Resource to track total value locked (TVL)
  resource TotalLocked { value: u64 };

  /**
   * Initialize the vault
   * @param admin - The vault administrator
   */
  init(admin: address) {
    TotalLocked[admin] = 0;
  }

  /**
   * Deposit tokens into the vault
   * @param user - The user depositing
   * @param amount - The amount to deposit
   */
  deposit(user: address, amount: u64) {
    // Add to user's stake
    Stakes[user] = amount;
    // Update TVL
    TotalLocked[user] = amount;
  }

  /**
   * Withdraw tokens from the vault
   * @param user - The user withdrawing
   * @param amount - The amount to withdraw
   */
  withdraw(user: address, amount: u64) {
    // Set user's stake to zero (simplified)
    Stakes[user] = 0;
    // Update TVL
    TotalLocked[user] = 0;
  }

  /**
   * Get user's stake balance
   * @param user - The user address
   * @returns The stake balance
   */
  get_balance(user: address): u64 {
    return Stakes[user];
  }

  /**
   * Get total value locked in the vault
   * @param admin - The vault admin
   * @returns The TVL
   */
  get_tvl(admin: address): u64 {
    return TotalLocked[admin];
  }
}`,

  marketplace: `// 05-voting-contract.movejs
// A simple voting system smart contract

/**
 * VotingContract - Simple Voting System
 *
 * This contract demonstrates a basic voting system where:
 * - Voters can be registered
 * - Voters can cast votes
 * - Vote status is tracked per voter
 */
contract VotingContract {
  // Resource to track if an address is registered to vote
  resource IsRegistered { value: bool };

  // Resource to track if an address has voted
  resource HasVoted { value: bool };

  // Resource to track the vote choice (simplified to yes/no)
  resource VoteChoice { value: bool };

  /**
   * Initialize the voting contract
   * @param owner - The contract owner
   */
  init(owner: address) {
    // Mark owner as registered
    IsRegistered[owner] = true;
    // Owner hasn't voted yet
    HasVoted[owner] = false;
  }

  /**
   * Register a voter
   * @param registrar - The address registering the voter
   * @param voter - The address to register
   */
  register_voter(registrar: address, voter: address) {
    // Register the voter
    IsRegistered[voter] = true;
    // Voter hasn't voted yet
    HasVoted[voter] = false;
  }

  /**
   * Cast a vote
   * @param voter - The voter casting the vote
   * @param choice - The vote choice (true for yes, false for no)
   */
  cast_vote(voter: address, choice: bool) {
    // Mark as voted
    HasVoted[voter] = true;
    // Record the vote choice
    VoteChoice[voter] = choice;
  }

  /**
   * Check if voter is registered
   * @param voter - The voter to check
   * @returns True if registered
   */
  is_registered(voter: address): bool {
    return IsRegistered[voter];
  }

  /**
   * Check if voter has voted
   * @param voter - The voter to check
   * @returns True if has voted
   */
  has_voted(voter: address): bool {
    return HasVoted[voter];
  }

  /**
   * Get vote choice
   * @param voter - The voter to check
   * @returns The vote choice
   */
  get_vote_choice(voter: address): bool {
    return VoteChoice[voter];
  }
}`,

  staking: `// 04-defi-vault.movejs (Alternative staking example)
// A DeFi vault for staking and earning yield

/**
 * StakingVault Contract
 *
 * This contract implements a staking vault with:
 * - Token staking and unstaking
 * - Reward calculation
 */
contract StakingVault {
  // Resource to track user stakes
  resource Stakes { value: u64 };

  // Resource to track staking duration
  resource StakeDuration { value: u64 };

  // Resource to track reward rate
  resource RewardRate { value: u64 };

  /**
   * Initialize the staking vault
   * @param admin - The vault administrator
   */
  init(admin: address) {
    RewardRate[admin] = 10; // 10% reward rate
  }

  /**
   * Stake tokens
   * @param user - The user staking
   * @param amount - The amount to stake
   * @param duration - The staking duration in blocks
   */
  stake(user: address, amount: u64, duration: u64) {
    Stakes[user] = amount;
    StakeDuration[user] = duration;
  }

  /**
   * Unstake tokens
   * @param user - The user unstaking
   * @param amount - The amount to unstake
   */
  unstake(user: address, amount: u64) {
    Stakes[user] = Stakes[user] - amount;
  }

  /**
   * Calculate staking rewards
   * @param user - The user to calculate rewards for
   * @returns The calculated reward amount
   */
  calculate_reward(user: address): u64 {
    let stake = Stakes[user];
    let rate = RewardRate[user] || 10;
    return (stake * rate) / 100;
  }

  /**
   * Get user's stake balance
   * @param user - The user address
   * @returns The stake balance
   */
  get_stake_balance(user: address): u64 {
    return Stakes[user];
  }
}`
};