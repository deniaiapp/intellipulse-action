# Intellipulse Action

Collaborate, Ask, Edit with Intellipulse on GitHub Issues.

## Description

This GitHub Action integrates with Intellipulse AI to automatically analyze and respond to GitHub issues. When triggered, it sends the issue content to Intellipulse and posts the AI-generated response as a comment on the issue.

## Usage

### Basic Setup

Create a workflow file (e.g., `.github/workflows/intellipulse.yml`) in your repository:

```yaml
name: Intellipulse AI Response

on:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created]

jobs:
  intellipulse-response:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Run Intellipulse Action
        uses: ./
        with:
          intellipulse-action-key: ${{ secrets.INTELLIPULSE_ACTION_KEY }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Required Secrets

1. **INTELLIPULSE_ACTION_KEY**: Your Intellipulse API key from your Deni AI account settings
2. **GITHUB_TOKEN**: Automatically provided by GitHub (no setup needed)

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `intellipulse-action-key` | Action key for Intellipulse. You can find it in your Deni AI account settings. | Yes | - |
| `github-token` | GitHub token for authentication. | Yes | `${{ github.token }}` |

### Outputs

| Output | Description |
|--------|-------------|
| `summary` | The summarized content from Intellipulse |

## How it Works

1. The action is triggered when an issue is opened, edited, or when a comment is created
2. It extracts the issue content and sends it to the Intellipulse API
3. The AI-generated response is posted as a comment on the original issue
4. The response is also available as an action output for further processing

## Setup Instructions

1. Get your Intellipulse API key from your [Deni AI account settings](https://canary.deniai.app)
2. Add the API key as a repository secret named `INTELLIPULSE_ACTION_KEY`
3. Create a workflow file as shown in the usage example above
4. Commit and push the workflow file to your repository

## Error Handling

The action includes comprehensive error handling:
- If the Intellipulse API call fails, an error message will be posted instead
- If commenting on the issue fails, the action will fail but the response will still be available as an output
- All errors are logged to the action output for debugging

## License

ISC