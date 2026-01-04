import React from "react";
import {
  BlogSection,
  BlogSubSection,
  BlogCode,
  BlogList,
  BlogCallout,
} from "./BlogUI";
import { Code2, Shield, Zap, Rocket, Terminal } from "lucide-react";

export function IntroMoveJSPost() {
  return (
    <>
      <BlogSection
        title="The Problem with Blockchain Development"
        icon={Shield}
        color="rose"
      >
        <p>
          Blockchain development has always been a steep learning curve.
          Traditional smart contract languages like Solidity require developers
          to learn entirely new paradigms, security models, and deployment
          processes. This creates a massive barrier to entry for the millions of
          JavaScript developers who want to build on Web3.
        </p>
        <p>
          Move, the programming language powering Aptos and Sui blockchains,
          offers superior security guarantees but comes with its own complexity.
          Writing Move contracts requires understanding resource ownership,
          linear types, and a completely different mental model from traditional
          programming.
        </p>
      </BlogSection>

      <BlogSection
        title="Enter MoveJS: JavaScript for Move Contracts"
        icon={Code2}
        color="blue"
      >
        <p>
          MoveJS is a domain-specific language (DSL) compiler that brings the
          familiarity of JavaScript syntax to Move smart contract development.
          It allows developers to write contracts using JavaScript-like syntax
          while automatically generating secure, auditable Move code.
        </p>

        <BlogSubSection title="Key Features" color="blue">
          <BlogList
            color="blue"
            items={[
              "Familiar Syntax: Write contracts using JavaScript/TypeScript syntax you already know",
              "Compile-time Safety: Automatic enforcement of Move's resource ownership model",
              "Zero Runtime Overhead: Compiles to native Move bytecode with no performance penalty",
              "Full IDE Support: VS Code extension with syntax highlighting and IntelliSense",
              "One-click Deployment: Direct deployment to Movement Network and other Move-based chains",
            ]}
          />
        </BlogSubSection>
      </BlogSection>

      <BlogSection title="How It Works" icon={Zap} color="amber">
        <p>
          MoveJS acts as a source-to-source compiler. You write your contract
          logic in a JavaScript-like syntax, and MoveJS transforms it into
          equivalent Move code that maintains all the security properties of the
          original language.
        </p>
        <p>
          The compiler includes a semantic analyzer that ensures your JavaScript
          code follows Move's linear type system, preventing common
          vulnerabilities at compile time rather than runtime.
        </p>

        <BlogSubSection title="A Simple Example" color="amber">
          <p>Here's how you would write a basic token contract in MoveJS:</p>
          <BlogCode
            language="javascript"
            title="SimpleToken.movejs"
            code={`// MoveJS Token Contract
contract SimpleToken {
  // Define a resource type for balances
  resource Balance {
    value: u64
  }

  // Initialize contract with total supply
  init(initial_supply: u64) {
    // Create initial balance for deployer
    Balance[signer()] = { value: initial_supply };
  }

  // Transfer tokens between accounts
  transfer(to: address, amount: u64) {
    // Move resources cannot be copied - they must be moved
    let sender_balance = move Balance[signer()];
    let recipient_balance = Balance[to] || { value: 0 };

    // Update balances
    sender_balance.value -= amount;
    recipient_balance.value += amount;

    // Move balances back to storage
    Balance[signer()] = move sender_balance;
    Balance[to] = move recipient_balance;
  }

  // Check balance
  balance_of(owner: address): u64 {
    return Balance[owner]?.value || 0;
  }
}`}
          />
        </BlogSubSection>
      </BlogSection>

      <BlogSection title="The Security Advantage" icon={Shield} color="emerald">
        <p>
          Move's resource ownership model prevents entire classes of
          vulnerabilities:
        </p>
        <BlogList
          color="emerald"
          items={[
            "No Reentrancy Attacks: Resources cannot be accessed while they're being used",
            "No Double Spending: Each resource can only exist in one place at a time",
            "No Lost Assets: Resources must be explicitly moved or destroyed",
            "No Integer Overflows: Built-in overflow protection in Move",
          ]}
        />
      </BlogSection>

      <BlogSection title="Getting Started" icon={Terminal} color="indigo">
        <p>Getting started with MoveJS is straightforward:</p>
        <BlogCode
          language="bash"
          code={`# Install the MoveJS CLI
npm install -g @js2move/cli

# Create a new project
movejs init my-token

# Compile to Move
movejs compile

# Deploy to network
movejs deploy`}
        />
      </BlogSection>

      <BlogSection
        title="The Future of Web3 Development"
        icon={Rocket}
        color="purple"
      >
        <p>
          MoveJS represents a bridge between Web2 and Web3 development. By
          bringing familiar JavaScript syntax to the secure world of Move, we're
          making blockchain development accessible to millions of developers
          while maintaining the security guarantees that make Move special.
        </p>
        <p>
          The future of Web3 isn't about forcing developers to learn new
          languages—it's about meeting them where they are. MoveJS is our
          contribution to that future.
        </p>

        <BlogCallout type="tip">
          "MoveJS doesn't just make Move development easier—it makes Web3
          development accessible to everyone who knows JavaScript."
        </BlogCallout>
      </BlogSection>
    </>
  );
}
