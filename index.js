const core = require('@actions/core');
const github = require('@actions/github')
const _ = require('lodash');
const Entities = require('html-entities');
const ejs = require('ejs');
const Haikunator = require('haikunator');
const { SourceControl, Jira } = require('jira-changelog');
const RegExpFromString = require('regexp-from-string');

const config = {
  jira: {
    api: {
      host: core.getInput('jira_host'),
      email: core.getInput('jira_email'),
      token: core.getInput('jira_token'),
    },
    baseUrl: core.getInput('jira_base_url'),
    ticketIDPattern: RegExpFromString(core.getInput('jira_ticket_id_pattern')),
    approvalStatus: core.getInput('approval_statuses').split(",").filter(x => x !== ""),
    excludeIssueTypes: core.getInput('exclude_issue_types').split(",").filter(x => x !== ""),
    includeIssueTypes: [],
  },
  sourceControl: {
    defaultRange: {
      from: core.getInput('source_control_range_from'),
      to: core.getInput('source_control_range_to')
    }
  },
};



const template = `
Release version: <%= releaseVersionName -%>

Jira Tickets
---------------------
<% tickets.forEach((ticket) => { %>
  * [<%= ticket.fields.issuetype.name %>] - [<%= ticket.key %>](<%= baseUrl + '/browse/' + ticket.key %>) <%= ticket.fields.summary -%>
<% }); -%>
<% if (!tickets.size) {%> ~ None ~ <% } %>

Unkown Tickets (not found in Jira)
---------------------
<% unknownTickets.forEach((ticket) => { %>
  * <%= ticket.summary -%>
<% }); -%>
<% if (!unknownTickets.size) {%> ~ None ~ <% } %>

Other Commits
---------------------
<% commits.forEach((commit) => { %>
  * <%= commit.slackUser ? '@'+commit.slackUser.name : commit.authorName %> - [<%= commit.revision.substr(0, 7) %>] - <%= commit.summary -%>
<% }); -%>
<% if (!commits.length) {%> ~ None ~ <% } %>
`;

function generateReleaseVersionName() {
  const hasVersion = process.env.VERSION;
  if (hasVersion) {
    return process.env.VERSION;
  } else {
    const haikunator = new Haikunator();
    return haikunator.haikunate();
  }
}

async function getIssues() {
  // Get commits for a range
  const source = new SourceControl(config);
  const jira = new Jira(config);

  const range = config.sourceControl.defaultRange;
  console.log(`Getting range ${range.from}...${range.to} commit logs`);
  const commitLogs = await source.getCommitLogs('./', range);

  const issues = new Map();
  const unknownIssues = new Map();
  const commits = [];

  for (const commit of commitLogs) {
    const match = config.jira.ticketIDPattern.exec(commit.summary);
    if (match) {
      const ticketId = match[1];

      if (issues.has(ticketId)) {
        continue;
      }

      console.log(`Fetching Jira issue ${ticketId}`);
      try {
        const issue = await jira.getJiraIssue(ticketId);
        if (issue) {
          issues.set(ticketId, issue);
        }
      } catch (error) {
        console.error(`Error while fetching Jira issue ${ticketId}: ${error.message}`);
        unknownIssues.set(ticketId, commit);
      }
    } else {
      commits.push(commit);
    }
  }

  return {
    tickets: issues,
    unknownTickets: unknownIssues,
    commits: commits,
  };
}


async function main() {
  try {
    const issues = await getIssues();
    const releaseVersionName = generateReleaseVersionName();

    console.log(`Release version name: ${releaseVersionName}`);
    console.log(`Jira tickets: ${issues.tickets.size}`);
    console.log(`Unknown tickets: ${issues.unknownTickets.size}`);


    console.debug("Issues: ", issues.tickets);
    console.debug("Unknown Issues: ", issues.unknownTickets);

    data = {
      releaseVersionName: releaseVersionName,
      baseUrl: config.jira.baseUrl,
      tickets: issues.tickets,
      unknownTickets: issues.unknownTickets,
      // commits without tickets
      commits: issues.commits,
    };
    data.includePendingApprovalSection = core.getInput('include_pending_approval_section') === 'true';

    const entitles = new Entities.AllHtmlEntities();
    const changelogMessage = ejs.render(template, data);

    console.log('Changelog message entry:');
    console.log(entitles.decode(changelogMessage));

    core.setOutput('changelog_message', changelogMessage);
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

main();