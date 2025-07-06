# GitHub Pages Index

A dynamic static web app that automatically discovers and categorizes GitHub Pages deployments across multiple users and organizations. This centralized index organizes your web apps, Terraform modules, and documentation sites into a beautiful, searchable interface.

## 🚀 Features

- **Automatic Discovery**: Uses GitHub API to find repositories with GitHub Pages enabled
- **Scheduled Updates**: GitHub Action runs every 6 hours to update repository data
- **Smart Categorization**: Automatically categorizes repositories into:
  - 🌐 Web Applications
  - 🏗️ Terraform Modules
  - 📚 Documentation & Tools
- **Configurable Sources**: Easy-to-edit configuration file for users and organizations
- **Repository Exclusions**: Flexible filtering to exclude specific repositories or patterns
- **Dark Mode Support**: Respects system preferences with manual toggle
- **Search & Filter**: Find repositories quickly with real-time search
- **Responsive Design**: Works perfectly on desktop and mobile
- **Fast Loading**: Pre-generated data eliminates API rate limits and improves performance
- **Modern UI**: Clean, professional interface with smooth animations

## 🎯 Live Demo

Visit the live site: [https://jajera.github.io/gitprofile/](https://jajera.github.io/gitprofile/)

## ⚙️ Configuration

### `config.json`

The app uses a centralized configuration file to define sources and filtering rules:

```json
{
  "sources": {
    "users": ["jajera"],
    "organizations": ["tfstack", "jajera"]
  },
  "filters": {
    "includePatterns": [
      "has_pages",
      "terraform-*",
      "topic:terraform-module"
    ],
    "excludeRepositories": [
      "gitprofile",
      ".github",
      "private-repo-example"
    ],
    "excludePatterns": [
      "archive-*",
      "backup-*",
      "test-*"
    ]
  },
  "categorization": {
    "webApps": {
      "topics": ["web-app", "webapp", "pwa", "react", "vue", "angular"],
      "keywords": ["app", "tool", "converter", "generator", "calculator"]
    },
    "terraformModules": {
      "namePrefix": "terraform-",
      "topics": ["terraform-module", "terraform", "infrastructure"]
    }
  },
  "settings": {
    "rateLimitDelay": 1000,
    "updateSchedule": "0 */6 * * *"
  }
}
```

### Configuration Options

#### Sources

- **`users`**: Array of GitHub usernames to scan
- **`organizations`**: Array of GitHub organization names to scan

#### Filters

- **`includePatterns`**: Patterns that determine which repositories to include
  - `has_pages`: Include repositories with GitHub Pages enabled
  - `terraform-*`: Include repositories starting with "terraform-"
  - `topic:terraform-module`: Include repositories with specific topics
- **`excludeRepositories`**: Exact repository names to exclude
- **`excludePatterns`**: Wildcard patterns for repository names to exclude

#### Categorization

- **`webApps`**: Criteria for identifying web applications
- **`terraformModules`**: Criteria for identifying Terraform modules
- **`documentation`**: Criteria for identifying documentation sites

## 🔄 Automatic Updates

The repository data is automatically updated via GitHub Actions:

### Schedule

- **Every 6 hours**: Automatic updates via cron schedule
- **Manual trigger**: Can be triggered manually from GitHub Actions tab
- **Config changes**: Automatically runs when `config.json` is modified

### Update Process

1. GitHub Action reads `config.json`
2. Fetches repository data from GitHub API (authenticated)
3. Applies filtering and categorization rules
4. Generates `docs/repositories.json` with processed data
5. Commits updated data back to repository
6. GitHub Pages automatically rebuilds and deploys

### Benefits

- **No rate limits**: Pre-generated data eliminates client-side API calls
- **Fast loading**: Static JSON file loads instantly
- **Always current**: Regular updates ensure fresh data
- **Reliable**: Server-side processing with proper error handling

## 🚀 Local Development

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/jajera/gitprofile.git
   cd gitprofile
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the web server**:

   ```bash
   npm start
   ```

4. **Open in browser**:

   ```plaintext
   http://localhost:3000
   ```

### Local Repository Updates

You can run the repository update script locally for development and testing:

1. **Set up GitHub token** (optional but recommended):

   ```bash
   export GITHUB_TOKEN=your_github_token_here
   ```

2. **Run the update script**:

   ```bash
   # Update repository data
   npm run update

   # Or with token inline
   GITHUB_TOKEN=your_token npm run update:dev
   ```

3. **Test your changes**:
   - Modify `config.json` to test filtering/categorization
   - Run the update script to see the results
   - Check the generated `docs/repositories.json` file
   - Refresh the web app to see changes

### Available Scripts

- `npm start` - Start the web server
- `npm run serve` - Alternative server command
- `npm run dev` - Start in development mode
- `npm run update` - Update repository data locally
- `npm run update:dev` - Update with GitHub token from environment

### Development Workflow

1. **Make configuration changes** in `config.json`
2. **Test locally** with `npm run update`
3. **Verify results** in `docs/repositories.json`
4. **Test the web app** with `npm start`
5. **Commit changes** to trigger automatic deployment

## 📂 Repository Detection

The app includes repositories that meet any of these criteria:

- Has GitHub Pages enabled (`has_pages: true`)
- Name starts with `terraform-` (Terraform modules)
- Has `terraform-module` topic/tag
- Matches custom include patterns in config

## 🎨 Categorization Logic

### Web Applications

- Has GitHub Pages enabled
- Contains web app topics: `web-app`, `webapp`, `pwa`, `react`, `vue`, `angular`, `javascript`, `typescript`
- Name or description contains app keywords: `app`, `tool`, `converter`, `generator`, `calculator`, `game`

### Terraform Modules

- Name starts with `terraform-`
- Has `terraform-module` topic

### Documentation & Tools

- Has GitHub Pages enabled
- Doesn't match web app or Terraform module criteria

## 🔧 Manual Repository Update

### GitHub Actions

To manually trigger a repository data update:

1. Go to the **Actions** tab in your GitHub repository
2. Click on **"Update Repository Data"** workflow
3. Click **"Run workflow"** button
4. Wait for the action to complete

### Local Development

```bash
# Update repository data locally
npm run update

# Or with authentication
GITHUB_TOKEN=your_token npm run update:dev
```

## 📁 Project Structure

```plaintext
├── docs/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS with dark mode support
│   ├── app.js              # Client-side application logic
│   └── repositories.json   # Generated repository data
├── scripts/
│   ├── update-repositories.js  # Repository update script
│   ├── package.json           # Script dependencies
│   └── README.md             # Script documentation
├── .github/
│   └── workflows/
│       ├── pages.yml            # GitHub Pages deployment
│       └── update-repositories.yml # Repository data update
├── config.json             # Configuration file
├── package.json            # Project configuration
└── README.md              # This file
```

## 🎨 Dark Mode

The app supports dark mode with:

- **System Preference**: Automatically detects system preference
- **Manual Toggle**: Sun/moon button in header
- **Persistent**: Remembers your choice in localStorage

## 🔧 Technologies Used

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: CSS Custom Properties (CSS Variables)
- **API**: GitHub REST API (server-side)
- **Automation**: GitHub Actions
- **Deployment**: GitHub Pages
- **Configuration**: JSON
- **Runtime**: Node.js (for update script)

## 🌟 Key Features

### GitHub Actions Integration

- Scheduled updates every 6 hours
- Authenticated API access for higher rate limits
- Automatic deployment on data changes
- Manual trigger support

### Local Development Support

- Standalone update script
- NPM scripts for easy execution
- Environment variable support
- Detailed logging and error handling

### Smart Filtering

- Include/exclude specific repositories
- Pattern-based filtering (wildcards)
- Topic-based categorization
- Flexible configuration

### Performance Optimizations

- Pre-generated static data
- No client-side API calls
- Intelligent caching
- Fast loading times

## 📊 Data Structure

The generated `repositories.json` includes:

- Repository metadata (name, description, topics, etc.)
- Categorization information
- GitHub Pages URLs
- Statistics and counts
- Last updated timestamp

## 🔒 Security

- GitHub token automatically provided by Actions
- No sensitive data in client-side code
- Proper API rate limiting
- Secure token handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update `config.json` if needed
5. Test locally with `npm run update`
6. Test the web app with `npm start`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://jajera.github.io/gitprofile/)
- [GitHub Repository](https://github.com/jajera/gitprofile)
- [Issues](https://github.com/jajera/gitprofile/issues)

---

**Note**: Repository data is automatically updated every 6 hours via GitHub Actions. For local development, use `npm run update` to refresh the data manually.
