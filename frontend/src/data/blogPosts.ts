export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content?: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
}

export const blogPosts: BlogPost[] = [
    {
        id: 'featured',
        slug: 'intro-movejs',
        title: 'Introducing MoveJS: JavaScript-like Syntax for Move Smart Contracts',
        excerpt: 'Learn how MoveJS bridges the gap between Web2 and Web3 development with familiar JavaScript syntax for Move blockchain.',
        content: `
            <h2>What is MoveJS?</h2>
            <p>MoveJS is a revolutionary DSL compiler that transforms JavaScript-style code into secure Move smart contracts. It's designed to make blockchain development accessible to millions of JavaScript developers.</p>

            <h3>Key Features</h3>
            <ul>
                <li>Familiar JavaScript/TypeScript syntax</li>
                <li>Compile-time safety checks</li>
                <li>One-click deployment to Movement Network</li>
                <li>Full IDE support with VS Code extension</li>
            </ul>

            <h3>Getting Started</h3>
            <p>Getting started with MoveJS is simple. Install the CLI tool and create your first smart contract in minutes.</p>

            <blockquote>
                "MoveJS makes Web3 development feel like Web2, but with all the security guarantees of Move."
            </blockquote>

            <h3>Example</h3>
            <pre><code>// Define a simple token contract
contract Token {
  resource Balance;

  init(signer: signer, initial: u64) {
    Balance[signer] = initial;
  }

  transfer(from: signer, to: address, amount: u64) {
    Balance[from] -= amount;
    Balance[to] += amount;
  }
}</code></pre>

            <p>This intuitive syntax compiles down to secure, auditable Move code that runs on the Movement blockchain.</p>
        `,
        author: 'MoveJS Team',
        date: 'December 25, 2025',
        readTime: '5 min read',
        category: 'Product',
        image: '/blog_intro_movejs_1767290363920.png'
    },
    {
        id: '2',
        slug: 'smart-contract-tutorial',
        title: 'Building Your First Smart Contract with MoveJS',
        excerpt: 'A step-by-step guide to creating, compiling, and deploying your first MoveJS smart contract.',
        content: `
            <h2>Introduction</h2>
            <p>This tutorial will walk you through creating a complete smart contract using MoveJS.</p>

            <h3>Prerequisites</h3>
            <ul>
                <li>Basic JavaScript knowledge</li>
                <li>Node.js installed</li>
                <li>MoveJS CLI tool</li>
            </ul>

            <p>Let's build a simple voting contract that demonstrates key MoveJS concepts.</p>
        `,
        author: 'MoveJS Team',
        date: 'December 28, 2025',
        readTime: '8 min read',
        category: 'Tutorial',
        image: '/blog_smart_contract_tutorial_1767290380535.png'
    },
    {
        id: '3',
        slug: 'ownership-model',
        title: 'Understanding Move\'s Resource Ownership Model',
        excerpt: 'Deep dive into how Move\'s unique resource ownership prevents common smart contract vulnerabilities.',
        content: `
            <h2>Resource Ownership in Move</h2>
            <p>Move's resource ownership model is one of its most powerful features for writing secure smart contracts.</p>

            <h3>Linear Types</h3>
            <p>Resources in Move cannot be copied or dropped - they must be explicitly moved, ensuring assets are never accidentally lost or duplicated.</p>

            <blockquote>
                "With Move's resource model, common vulnerabilities like reentrancy attacks become impossible by design."
            </blockquote>
        `,
        author: 'MoveJS Team',
        date: 'January 2, 2026',
        readTime: '6 min read',
        category: 'Technical',
        image: '/blog_ownership_model_1767290425361.png'
    }
];
