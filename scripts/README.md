# GitHub Pages Index Update Scripts

This directory contains the update scripts for the GitHub Pages Index.

## Local Development

### Prerequisites

- Node.js 14 or higher
- Dependencies installed from root: `npm install` (from project root)

### Setup

1. Install dependencies from the project root:

   ```bash
   cd ..
   npm install
   ```

2. Create a `.env` file in the project root or export your GitHub token:

   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```

### Running the Update Script

From the project root directory:

```bash
# Run with GitHub token from environment
npm run update:dev

# Run without token (rate limited)
npm run update
```

### Direct Script Execution

You can also run the script directly:

```bash
# From project root
node scripts/update-repositories.js

# With token
GITHUB_TOKEN=your_token node scripts/update-repositories.js
```

## Script Details

- **update-repositories.js** - Main script that fetches repository data and updates the JSON file
- Uses configuration from `../config.json`
- Outputs to `../docs/repositories.json`
- Includes rate limiting and error handling
- Validates Terraform modules have releases before inclusion

## Configuration

The script uses the main `config.json` file in the project root. No separate configuration is needed for the scripts.
