module.exports = {
  hooks: {
    readPackage(pkg) {
      // Fix poseidon-lite to work with Vite's ESM handling
      if (pkg.name === 'poseidon-lite') {
        // Ensure proper ESM/CJS interop
        pkg.exports = {
          '.': {
            import: './index.js',
            require: './index.js',
            default: './index.js',
          },
          './poseidon1': './poseidon1.js',
          './poseidon2': './poseidon2.js',
          './poseidon3': './poseidon3.js',
          './poseidon4': './poseidon4.js',
          './poseidon5': './poseidon5.js',
          './poseidon6': './poseidon6.js',
          './poseidon7': './poseidon7.js',
          './poseidon8': './poseidon8.js',
          './poseidon9': './poseidon9.js',
          './poseidon10': './poseidon10.js',
          './poseidon11': './poseidon11.js',
          './poseidon12': './poseidon12.js',
          './poseidon13': './poseidon13.js',
          './poseidon14': './poseidon14.js',
          './poseidon15': './poseidon15.js',
          './poseidon16': './poseidon16.js',
        };
        // Add type field for better ESM compatibility
        pkg.type = 'commonjs';
      }
      return pkg;
    },
  },
};
