# GitHub User Finder CLI

A command-line tool to fetch and display GitHub user information, their top repositories, and recent issues.

## Features

- View GitHub user profile information
- See top 5 repositories sorted by stars
- Check recent open issues
- Cached results for faster repeated queries

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A GitHub Personal Access Token

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/cli-github-finder.git
cd cli-github-finder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your GitHub token:
```bash
GITHUB_TOKEN=your_github_token_here
```

To get a GitHub token:
1. Go to GitHub.com → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click "Generate new token"
3. Give it a name and select these permissions:
   - `repo` (Full control of private repositories)
   - `user` (Update ALL user data)
4. Copy the generated token and paste it in your `.env` file

## Usage

Run the tool using:
```bash
npm start
```

The tool will prompt you to enter a GitHub username. After entering the username, it will display:
- User profile information
- Top 5 repositories
- Recent open issues

## Example Output

```
👤 User Information
Name: John Doe
Bio: Software Developer
Location: New York
Public Repos: 42
Followers: 100
Following: 50

⭐ Top Repositories
┌──────────────┬──────────┬──────────┬───────────────┐
│ Name         │ Stars    │ Forks    │ Language      │
├──────────────┼──────────┼──────────┼───────────────┤
│ project-1    │ 100      │ 20       │ JavaScript    │
└──────────────┴──────────┴──────────┴───────────────┘

📝 Recent Issues
No recent issues found
```
