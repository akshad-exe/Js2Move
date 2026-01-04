import React from "react";
import {
  BlogSection,
  BlogCode,
  BlogList,
  BlogStep,
  BlogCallout,
  BlogSubSection,
} from "./BlogUI";
import { Terminal, BookOpen, Rocket } from "lucide-react";

export function SmartContractTutorialPost() {
  return (
    <>
      <BlogSection title="Prerequisites" icon={BookOpen} color="blue">
        <p>Before we start building, make sure you have:</p>
        <BlogList
          color="blue"
          items={[
            "Node.js 18+ installed",
            "Basic JavaScript/TypeScript knowledge",
            "A code editor (VS Code recommended)",
            "Some familiarity with blockchain concepts (optional)",
          ]}
        />
      </BlogSection>

      <BlogStep
        number={1}
        title="Setting Up Your Development Environment"
        color="indigo"
      >
        <p>First, let's install the MoveJS CLI globally:</p>
        <BlogCode language="bash" code="npm install -g @js2move/cli" />

        <p>Verify the installation:</p>
        <BlogCode language="bash" code="movejs --version" />

        <p>Now create a new MoveJS project:</p>
        <BlogCode
          language="bash"
          code={`movejs init my-first-contract
cd my-first-contract`}
        />

        <p>This creates a project structure like:</p>
        <BlogCode
          language="text"
          code={`my-first-contract/
├── movejs.config.json
├── src/
│   └── main.movejs
└── tests/
    └── main.test.js`}
        />
      </BlogStep>

      <BlogStep
        number={2}
        title="Understanding the Project Structure"
        color="indigo"
      >
        <p>Let's examine the generated files:</p>
        <BlogList
          color="indigo"
          items={[
            "movejs.config.json - Configuration file specifying target network and compiler options",
            "src/main.movejs - Your main contract file",
            "tests/main.test.js - Unit tests for your contract",
          ]}
        />
      </BlogStep>

      <BlogStep number={3} title="Writing Your First Contract" color="indigo">
        <p>
          Open <code>src/main.movejs</code> and replace the default content with
          our voting contract:
        </p>
        <BlogCode
          language="javascript"
          title="main.movejs"
          code={`// Voting Contract - A simple democratic voting system
contract VotingContract {
  // Resource representing a voter's right to vote
  resource VotingRight {
    has_voted: bool
  }

  // Resource representing a proposal
  resource Proposal {
    description: string,
    vote_count: u64
  }

  // Storage for all proposals
  let proposals: table<address, Proposal> = {};

  // Initialize the contract
  init() {
    // Contract initializer - runs once during deployment
    console.log("Voting contract deployed!");
  }

  // Create a new proposal
  create_proposal(proposal_id: address, description: string) {
    // Only contract owner can create proposals (simplified)
    assert(signer() == @contract_owner, "Only owner can create proposals");

    // Create new proposal
    let new_proposal = {
      description: description,
      vote_count: 0
    };

    // Store in global proposals table
    proposals[proposal_id] = move new_proposal;
  }

  // Register a voter (give them voting rights)
  register_voter(voter: address) {
    // Only owner can register voters
    assert(signer() == @contract_owner, "Only owner can register voters");

    // Give voter their voting right
    VotingRight[voter] = { has_voted: false };
  }

  // Cast a vote
  vote(proposal_id: address) {
    let voter_addr = signer();

    // Check if voter is registered
    assert(exists(VotingRight[voter_addr]), "Voter not registered");

    // Check if voter hasn't voted yet
    let voting_right = borrow_global_mut<VotingRight>(voter_addr);
    assert(!voting_right.has_voted, "Already voted");

    // Check if proposal exists
    assert(exists(proposals[proposal_id]), "Proposal does not exist");

    // Cast the vote
    let proposal = borrow_global_mut<Proposal>(proposal_id);
    proposal.vote_count += 1;

    // Mark voter as having voted
    voting_right.has_voted = true;
  }

  // Get proposal details
  get_proposal(proposal_id: address): Proposal {
    assert(exists(proposals[proposal_id]), "Proposal does not exist");
    return *borrow_global<Proposal>(proposal_id);
  }

  // Check if an address has voting rights
  has_voting_right(addr: address): bool {
    return exists(VotingRight[addr]);
  }

  // Check if an address has already voted
  has_voted(addr: address): bool {
    if (!exists(VotingRight[addr])) {
      return false;
    }
    let voting_right = borrow_global<VotingRight>(addr);
    return voting_right.has_voted;
  }
}`}
        />
      </BlogStep>

      <BlogStep number={4} title="Understanding the Code" color="indigo">
        <p>Let's break down the key concepts in this contract:</p>

        <BlogSubSection title="Resources" color="indigo">
          <p>
            In Move, <strong>resources</strong> are special types that cannot be
            copied or implicitly destroyed. They represent assets that must be
            explicitly managed:
          </p>
          <BlogList
            color="indigo"
            items={[
              "VotingRight - Represents a voter's right to vote (can only be used once)",
              "Proposal - Represents a voting proposal with its current vote count",
            ]}
          />
        </BlogSubSection>

        <BlogSubSection title="Storage" color="indigo">
          <p>
            MoveJS provides global storage through{" "}
            <strong>resource tables</strong>:
          </p>
          <BlogList
            color="indigo"
            items={[
              "VotingRight[address] - Stores voting rights per address",
              "proposals[address] - Stores proposals by their IDs",
            ]}
          />
        </BlogSubSection>

        <BlogSubSection title="Move Semantics" color="indigo">
          <p>
            The <code>move</code> keyword explicitly transfers ownership:
          </p>
          <BlogCode
            language="javascript"
            code="// This MOVES the resource, not copies it
proposals[proposal_id] = move new_proposal;"
          />
        </BlogSubSection>
      </BlogStep>

      <BlogStep number={5} title="Compiling Your Contract" color="indigo">
        <p>Compile your MoveJS contract to Move bytecode:</p>
        <BlogCode language="bash" code="movejs compile" />

        <p>This generates:</p>
        <BlogList
          color="indigo"
          items={[
            "build/ - Compiled Move modules",
            "build/sources/ - Generated .move files",
          ]}
        />
      </BlogStep>

      <BlogStep number={6} title="Writing Tests" color="indigo">
        <p>
          Let's add some tests to ensure our contract works correctly. Open{" "}
          <code>tests/main.test.js</code>:
        </p>
        <BlogCode
          language="javascript"
          title="main.test.js"
          code={`const { AptosClient } = require("aptos");
const { compileAndDeploy } = require("@js2move/test-utils");

describe("VotingContract", () => {
  let client;
  let deployer;
  let voter1;
  let voter2;

  beforeAll(async () => {
    client = new AptosClient("https://fullnode.testnet.aptoslabs.com");
    [deployer, voter1, voter2] = await compileAndDeploy("./src/main.movejs");
  });

  test("should create a proposal", async () => {
    const proposalId = "0x1";
    const description = "Should we build a community center?";

    await deployer.contract.create_proposal(proposalId, description);

    const proposal = await deployer.contract.get_proposal(proposalId);
    expect(proposal.description).toBe(description);
    expect(proposal.vote_count).toBe(0);
  });

  test("should register voters", async () => {
    await deployer.contract.register_voter(voter1.address);
    await deployer.contract.register_voter(voter2.address);

    expect(await deployer.contract.has_voting_right(voter1.address)).toBe(true);
    expect(await deployer.contract.has_voting_right(voter2.address)).toBe(true);
  });

  test("should allow voting", async () => {
    const proposalId = "0x1";

    // Voter1 votes
    await voter1.contract.vote(proposalId);

    let proposal = await deployer.contract.get_proposal(proposalId);
    expect(proposal.vote_count).toBe(1);
    expect(await deployer.contract.has_voted(voter1.address)).toBe(true);

    // Voter2 votes
    await voter2.contract.vote(proposalId);

    proposal = await deployer.contract.get_proposal(proposalId);
    expect(proposal.vote_count).toBe(2);
  });

  test("should prevent double voting", async () => {
    const proposalId = "0x1";

    // Try to vote again - should fail
    await expect(voter1.contract.vote(proposalId)).rejects.toThrow();
  });
});`}
        />
      </BlogStep>

      <BlogStep number={7} title="Running Tests" color="indigo">
        <p>Run your tests to make sure everything works:</p>
        <BlogCode language="bash" code="npm test" />
        <BlogCallout type="success">
          You should see all tests passing! 🎉
        </BlogCallout>
      </BlogStep>

      <BlogStep number={8} title="Deploying to Testnet" color="indigo">
        <p>Once your contract is tested, deploy it to the Aptos testnet:</p>
        <BlogCode language="bash" code="movejs deploy --network testnet" />

        <p>This will:</p>
        <BlogList
          color="indigo"
          items={[
            "Compile your contract to Move bytecode",
            "Publish it to the Aptos testnet",
            "Return the contract address",
          ]}
        />
      </BlogStep>

      <BlogStep
        number={9}
        title="Interacting with Your Contract"
        color="indigo"
      >
        <p>You can now interact with your deployed contract through:</p>
        <BlogList
          color="indigo"
          items={[
            'MoveJS CLI: movejs call create_proposal "0x2" "New proposal"',
            "Aptos Explorer: View transactions and contract state",
            "Frontend Integration: Connect your dApp to the contract",
          ]}
        />
      </BlogStep>

      <BlogSection title="What's Next?" icon={Rocket} color="emerald">
        <p>
          Congratulations! You've just built and deployed your first Move smart
          contract using MoveJS. Here are some next steps:
        </p>
        <BlogList
          color="emerald"
          items={[
            "Explore more complex contract patterns",
            "Add access control and permissions",
            "Integrate with a React frontend",
            "Learn about Move's module system",
          ]}
        />
        <p className="mt-8 text-gray-300">
          The beauty of MoveJS is that you can focus on your application logic
          while the compiler handles the complex Move semantics. Happy coding!
          🚀
        </p>
      </BlogSection>
    </>
  );
}
