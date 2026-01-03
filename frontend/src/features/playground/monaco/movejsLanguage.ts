export const movejsLanguageConfig = {
    keywords: [
        'contract', 'resource', 'init', 'transfer', 'fun',
        'let', 'assert', 'return', 'public', 'entry'
    ],

    tokenizer: {
        root: [
            [/[a-z_$][\w$]*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],
            [/[A-Z][\w$]*/, 'type.identifier'],
            [/[{}()\[\]]/, '@brackets'],
            [/[0-9]+/, 'number'],
            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string'],
        ],

        string: [
            [/[^\\"]+/, 'string'],
            [/"/, 'string', '@pop']
        ],
    },
};
