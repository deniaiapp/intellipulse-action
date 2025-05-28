// src/index.ts

import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';

async function run() {
  try {
    // 1. Get inputs from the GitHub Action workflow
    const intellipulseApiKey = core.getInput('intellipulse-api-key', { required: true });
    const issueBody = core.getInput('issue-body', { required: true });
    const issueNumber = parseInt(core.getInput('issue-number', { required: true }), 10);

    const intellipulseApiUrl = "https://canary.deniai.app/api/intellipulse/action";

    // 2. Construct the request payload for IntelliPulse API (assuming OpenAI API format)
    const requestData = {
      messages: [
        { role: "user", content: `${issueBody}` }
      ]
    };

    // 3. Call the IntelliPulse API
    core.info('Calling Intellipulse API...');
    let intellipulseResponseContent: string;
    try {
      const response = await axios.post(intellipulseApiUrl, requestData, {
        headers: {
          "Authorization": `Bearer ${intellipulseApiKey}`,
          "Content-Type": "application/json"
        },
      });

      // Parse the response (assuming OpenAI API chat completions format)
      intellipulseResponseContent = response.data?.content || 'No response from IntelliPulse.';
      core.info('Successfully received response from IntelliPulse.');
    } catch (error: any) {
      core.error(`Failed to call IntelliPulse API: ${error.message}`);
      if (error.response) {
        core.error(`IntelliPulse API Response Status: ${error.response.status}`);
        core.error(`IntelliPulse API Response Data: ${JSON.stringify(error.response.data)}`);
      }
      // Set a fallback error message
      intellipulseResponseContent = 'Error: Could not get response from IntelliPulse API. Please check action logs for details.';
    }

    // 4. Add a comment to the GitHub Issue
    // Ensure issueNumber is valid before attempting to comment
    if (issueNumber > 0) {
      core.info(`Adding comment to issue #${issueNumber}...`);
      // github-token is automatically provided by GitHub Actions runner, but explicitly passed as input
      const octokit = github.getOctokit(core.getInput('github-token', { required: false }) || process.env.GITHUB_TOKEN || '');
      const { owner, repo } = github.context.repo;

      const commentBody = `🤖 Response from Intellipulse:\n\n${intellipulseResponseContent}`;

      try {
        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: issueNumber,
          body: commentBody
        });
        core.info('Comment added successfully.');
      } catch (error: any) {
        // If commenting fails, set the action as failed but still output the summary if available
        core.setFailed(`Failed to add comment to issue: ${error.message}`);
      }
    } else {
      core.warning('Invalid issue number provided. Skipping comment creation.');
    }

    // 5. Set action output (optional, but good for debugging or chaining actions)
    core.setOutput('summary', intellipulseResponseContent);

  } catch (error: any) {
    // Catch any unexpected errors that might occur during the action execution
    core.setFailed(error.message);
  }
}

// Run the action
run();
