import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import NodeCache from 'node-cache';
import ora from 'ora';
import Table from 'cli-table3';

// Load environment variables
dotenv.config();

// Initialize cache with 5 minutes TTL
const cache = new NodeCache({ stdTTL: 300 });

// GitHub API configuration
const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error(chalk.red('Error: GitHub token not found. Please set GITHUB_TOKEN in .env file'));
  process.exit(1);
}

const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

async function fetchGitHubData(username) {
  const spinner = ora('Fetching GitHub data...').start();
  
  try {
    // Check cache first
    const cachedData = cache.get(username);
    if (cachedData) {
      spinner.succeed('Data retrieved from cache');
      return cachedData;
    }

    // Fetch user data
    const userResponse = await axios.get(`${GITHUB_API}/users/${username}`, { headers });
    const user = userResponse.data;

    // Fetch repositories
    const reposResponse = await axios.get(`${GITHUB_API}/users/${username}/repos?sort=stars&per_page=5`, { headers });
    const repos = reposResponse.data;

    // Fetch recent issues
    const issuesResponse = await axios.get(`${GITHUB_API}/search/issues?q=author:${username}+is:issue+is:open&per_page=5`, { headers });
    const issues = issuesResponse.data.items;

    const data = {
      user,
      repos,
      issues
    };

    // Cache the data
    cache.set(username, data);
    spinner.succeed('Data fetched successfully');
    return data;
  } catch (error) {
    spinner.fail('Error fetching data');
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    throw error;
  }
}

function displayUserInfo(user) {
  console.log('\n' + chalk.bold.blue('👤 User Information'));
  console.log(chalk.green('Name:'), user.name || 'N/A');
  console.log(chalk.green('Bio:'), user.bio || 'N/A');
  console.log(chalk.green('Location:'), user.location || 'N/A');
  console.log(chalk.green('Public Repos:'), user.public_repos);
  console.log(chalk.green('Followers:'), user.followers);
  console.log(chalk.green('Following:'), user.following);
}

function displayTopRepos(repos) {
  console.log('\n' + chalk.bold.blue('⭐ Top Repositories'));
  const table = new Table({
    head: ['Name', 'Stars', 'Forks', 'Language'],
    colWidths: [30, 10, 10, 15]
  });

  repos.forEach(repo => {
    table.push([
      repo.name,
      repo.stargazers_count,
      repo.forks_count,
      repo.language || 'N/A'
    ]);
  });

  console.log(table.toString());
}

function displayRecentIssues(issues) {
  console.log('\n' + chalk.bold.blue('📝 Recent Issues'));
  if (issues.length === 0) {
    console.log(chalk.yellow('No recent issues found'));
    return;
  }

  const table = new Table({
    head: ['Repository', 'Title', 'State'],
    colWidths: [20, 40, 10]
  });

  issues.forEach(issue => {
    table.push([
      issue.repository.name,
      issue.title,
      issue.state
    ]);
  });

  console.log(table.toString());
}

async function main() {
  try {
    const { username } = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Enter GitHub username:',
        validate: input => input.trim() !== '' ? true : 'Username is required'
      }
    ]);

    const data = await fetchGitHubData(username);
    displayUserInfo(data.user);
    displayTopRepos(data.repos);
    displayRecentIssues(data.issues);

  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

main(); 