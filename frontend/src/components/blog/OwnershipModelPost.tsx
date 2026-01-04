import {
  BlogSection,
  BlogCode,
  BlogList,
  BlogCallout,
  BlogSubSection,
} from "./BlogUI";
import { Shield, Lock, Zap, AlertTriangle, Layers, Globe } from "lucide-react";

export function OwnershipModelPost() {
  return (
    <>
      <BlogSection
        title="The Problem with Traditional Smart Contracts"
        icon={AlertTriangle}
        color="rose"
      >
        <p>
          Traditional smart contract platforms like Ethereum have been plagued
          by security vulnerabilities. The most famous of these is the DAO hack
          in 2016, which exploited a reentrancy vulnerability and resulted in
          the loss of $50 million worth of Ether.
        </p>

        <p>
          These vulnerabilities stem from fundamental design flaws in languages
          like Solidity:
        </p>

        <BlogList
          color="rose"
          items={[
            "Reentrancy: A contract can be called while it's already executing",
            "Double spending: Assets can be spent multiple times",
            "Lost assets: Tokens can be accidentally destroyed or locked",
            "Integer overflows: Mathematical operations can wrap around unexpectedly",
          ]}
        />

        <p className="mt-4">
          Move was designed from the ground up to prevent these issues through
          its unique resource ownership model.
        </p>
      </BlogSection>

      <BlogSection
        title="What Are Resources in Move?"
        icon={Layers}
        color="blue"
      >
        <p>
          In Move, <strong>resources</strong> are special types that represent
          assets or capabilities that cannot be duplicated or accidentally
          destroyed. Unlike traditional programming languages where you can copy
          values freely, resources in Move follow strict ownership rules.
        </p>

        <BlogCallout type="info">
          Think of resources as physical objects: you can't make copies of a
          house key, and you can't just throw away your car. Each resource has
          exactly one owner at any time.
        </BlogCallout>

        <BlogSubSection title="Resource Declaration" color="blue">
          <p>
            Resources are declared using the <code>resource</code> keyword:
          </p>
          <BlogCode
            language="move"
            code={`// A token balance resource
resource Balance {
    value: u64
}

// A voting right resource
resource VotingRight {
    has_voted: bool,
    delegate: address
}

// An NFT resource
resource NFT {
    id: u64,
    owner: address,
    metadata: string
}`}
          />
        </BlogSubSection>
      </BlogSection>

      <BlogSection title="The Linear Type System" icon={Shield} color="emerald">
        <p>
          Move implements a <strong>linear type system</strong> for resources.
          This means:
        </p>

        <BlogList
          color="emerald"
          items={[
            "No implicit copying: Resources cannot be copied with =",
            "No implicit destruction: Resources cannot be discarded",
            "Explicit movement: Resources must be explicitly moved using the move keyword",
            "Single ownership: Each resource has exactly one owner",
          ]}
        />

        <BlogSubSection title="Explicit Movement" color="emerald">
          <p>
            When you want to transfer ownership of a resource, you must use the{" "}
            <code>move</code> keyword:
          </p>
          <BlogCode
            language="javascript"
            code={`// MoveJS syntax
transfer_token(to: address, amount: u64) {
  // Move the sender's balance resource
  let sender_balance = move Balance[signer()];

  // Move the recipient's balance (or create new one)
  let recipient_balance = Balance[to] || { value: 0 };

  // Update values
  sender_balance.value -= amount;
  recipient_balance.value += amount;

  // Move balances back to storage
  Balance[signer()] = move sender_balance;
  Balance[to] = move recipient_balance;
}`}
          />
        </BlogSubSection>
      </BlogSection>

      <BlogSection title="Storage and Global State" icon={Lock} color="amber">
        <p>
          Move provides global storage through <strong>resource tables</strong>.
          These are key-value stores where keys are addresses and values are
          resources:
        </p>

        <BlogCode
          language="javascript"
          code={`// Global resource storage
let balances: table<address, Balance> = {};
let voting_rights: table<address, VotingRight> = {};

// Store a resource globally
Balance[user_addr] = move new_balance;

// Retrieve a resource (borrows it)
let balance = borrow_global<Balance>(user_addr);

// Retrieve and modify a resource
let mut_balance = borrow_global_mut<Balance>(user_addr);
mut_balance.value += 100;`}
        />
      </BlogSection>

      <BlogSection
        title="How This Prevents Vulnerabilities"
        icon={Shield}
        color="indigo"
      >
        <p>
          Let's examine how Move's resource model prevents common smart contract
          attacks:
        </p>

        <BlogSubSection title="Preventing Reentrancy Attacks" color="indigo">
          <p>
            In Solidity, reentrancy occurs when a contract calls another
            contract, which can then call back into the first contract before
            the first call completes.
          </p>
          <p>In Move, this is impossible because:</p>
          <BlogList
            color="indigo"
            items={[
              "Resources cannot be accessed while they're being moved",
              "Each resource has a single owner, preventing concurrent access",
              "The linear type system ensures operations complete atomically",
            ]}
          />
        </BlogSubSection>

        <BlogSubSection title="Preventing Double Spending" color="indigo">
          <p>
            Double spending happens when the same asset is spent multiple times.
            In Move:
          </p>
          <BlogList
            color="indigo"
            items={[
              "Each resource can only exist in one place at a time",
              "Moving a resource removes it from its current location",
              "You cannot spend a resource that's already been moved",
            ]}
          />
        </BlogSubSection>

        <BlogSubSection title="Preventing Lost Assets" color="indigo">
          <p>
            Assets can get \"lost\" in Solidity due to bugs or exceptions. Move
            prevents this by:
          </p>
          <BlogList
            color="indigo"
            items={[
              "Requiring explicit handling of all resources",
              "Compiler-enforced resource management",
              "No implicit destruction of valuable assets",
            ]}
          />
        </BlogSubSection>
      </BlogSection>

      <BlogSection
        title="Resource Capabilities and Access Control"
        icon={Lock}
        color="purple"
      >
        <p>Resources can also represent capabilities or permissions:</p>
        <BlogCode
          language="javascript"
          code={`// Admin capability resource
resource AdminCapability { }

// Only admin can perform certain actions
require_admin() {
  assert(exists(AdminCapability[signer()]), "Not authorized");
}

transfer_admin(new_admin: address) {
  // Move admin capability to new address
  AdminCapability[new_admin] = move AdminCapability[signer()];
}`}
        />
      </BlogSection>

      <BlogSection
        title="Comparison with Other Approaches"
        icon={Globe}
        color="blue"
      >
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-700 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-800/50">
                <th className="border border-gray-700 px-4 py-3 text-left text-blue-400">
                  Security Approach
                </th>
                <th className="border border-gray-700 px-4 py-3 text-left text-blue-400">
                  Method
                </th>
                <th className="border border-gray-700 px-4 py-3 text-left text-blue-400">
                  Limitations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="border border-gray-700 px-4 py-3 font-medium">
                  Solidity
                </td>
                <td className="border border-gray-700 px-4 py-3">
                  Runtime checks, audits
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-400">
                  Human error, incomplete coverage
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="border border-gray-700 px-4 py-3 font-medium">
                  Rust
                </td>
                <td className="border border-gray-700 px-4 py-3">
                  Borrow checker, lifetimes
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-400">
                  Complex for smart contracts
                </td>
              </tr>
              <tr className="hover:bg-gray-800/30 transition-colors">
                <td className="border border-gray-700 px-4 py-3 font-medium text-blue-400">
                  Move
                </td>
                <td className="border border-gray-700 px-4 py-3">
                  Linear types, resources
                </td>
                <td className="border border-gray-700 px-4 py-3 text-gray-400">
                  Learning curve, different paradigm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BlogSection>

      <BlogSection title="Real-World Impact" icon={Zap} color="emerald">
        <p>Move's resource model has proven effective in production:</p>
        <BlogList
          color="emerald"
          items={[
            "Aptos: Processes millions of transactions daily without major exploits",
            "Sui: Uses Move for its object-based architecture",
            "Movement Network: Brings Move's security to new ecosystems",
          ]}
        />
        <p className="mt-6 text-gray-300">
          The absence of major exploits in Move-based chains demonstrates the
          effectiveness of the resource ownership model.
        </p>
      </BlogSection>

      <BlogCallout type="tip">
        <p className="italic text-lg">
          \"In traditional programming, you can copy data freely. In Move,
          assets are physical objects that must be carefully managed. This
          fundamental difference makes Move uniquely secure.\"
        </p>
      </BlogCallout>

      <BlogSection title="Conclusion" icon={Globe} color="purple">
        <p>
          Move's resource ownership model represents a fundamental advancement
          in smart contract security. By treating assets as physical resources
          that cannot be duplicated or lost, Move eliminates entire classes of
          vulnerabilities that have plagued traditional blockchains.
        </p>
        <p className="mt-4">
          MoveJS makes this powerful model accessible to JavaScript developers,
          bringing the security of Move to the largest developer community in
          the world.
        </p>
      </BlogSection>
    </>
  );
}
