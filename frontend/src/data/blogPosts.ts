import React from 'react';
import { IntroMoveJSPost } from '../components/blog/IntroMoveJSPost';
import { SmartContractTutorialPost } from '../components/blog/SmartContractTutorialPost';
import { OwnershipModelPost } from '../components/blog/OwnershipModelPost';

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: React.ComponentType;
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
        content: IntroMoveJSPost,
        author: 'Akshad',
        date: 'December 25, 2025',
        readTime: '8 min read',
        category: 'Product',
        image: '/blog_intro_movejs_1767290363920.png'
    },
    {
        id: '2',
        slug: 'smart-contract-tutorial',
        title: 'Building Your First Smart Contract with MoveJS',
        excerpt: 'A step-by-step guide to creating, compiling, and deploying your first MoveJS smart contract.',
        content: SmartContractTutorialPost,
        author: 'Gourav',
        date: 'December 28, 2025',
        readTime: '12 min read',
        category: 'Tutorial',
        image: '/blog_smart_contract_tutorial_1767290380535.png'
    },
    {
        id: '3',
        slug: 'ownership-model',
        title: 'Understanding Move\'s Resource Ownership Model',
        excerpt: 'Deep dive into how Move\'s unique resource ownership prevents common smart contract vulnerabilities.',
        content: OwnershipModelPost,
        author: 'MoveJS Team',
        date: 'January 2, 2026',
        readTime: '10 min read',
        category: 'Technical',
        image: '/blog_ownership_model_1767290425361.png'
    }
];
