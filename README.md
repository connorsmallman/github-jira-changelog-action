# Jira Changelog Action

Generates a changelog message by looking at Jira issue keys, surrounded by square brackets (i.e. [DEV-123]), in the git commit logs. When it finds one, it associates that Jira issue ticket with that commit and adds it to the output.

## Inputs

### `jira_host`

**Required** Root host of your JIRA installation without protocol. // (i.e "yourapp.atlassian.net")

### `jira_email`

**Required** Email address of the user to login with

### `jira_token`

**Required** Auth token of the user to login with

### `jira_base_url`

Jira base web URL for changelog message entries

### `jira_ticket_id_pattern`

Regex used to match the issue ticket key
*Note: Use capture group one to isolate the key text within surrounding characters (if needed).*

### `source_control_range_from`

Starting branch to get range of commits

### `source_control_range_to`

Ending branch to get range of commits

### `approval_statuses`

Comma separated list of issue statuses treated as approved


### `exclude_issue_types`

Comma separated list of issue types to exclude from changelog


### `include_pending_approval_section`

Boolean flag indicating whether to include or exclude `Pending Approval` section

## Outputs

### `changelog_message`

Generated changelog entry

```
Jira Tickets
---------------------

  * <Bug> - Unable to access date widget
    [DEV-1234] https://yoursite.atlassian.net/browse/DEV-1234

  * <Story> - Support left-handed keyboards
    [DEV-5678] https://yoursite.atlassian.net/browse/DEV-5678

  * <Story> - Search by location
    [DEV-8901] https://yoursite.atlassian.net/browse/DEV-8901

Other Commits
---------------------

  * <cd6f512> - Fix typo in welcome message

Pending Approval
---------------------
 ~ None. Yay! ~
```

## Example usage

```yaml
on: [push]

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    name: Changelog
    steps:
      - name: Set Version
        run: echo ::set-env name=VERSION::1.1.1
      # To use this repository's private action, you must check out the repository
      - name: Checkout
        uses: actions/checkout@v1
      - name: Changelog
        id: changelog
        uses: actions/jira-changelog@v1
        with:
          jira_host: 'myapp.atlassian.net'
          jira_email: 'jirauser@myapp.com'
          jira_token: 'qWoJBdlEp6pJy15fc9tGpsOOR2L5i35v'
          jira_base_url: 'https://yoursite.atlassian.net'
          source_control_range_from: 'develop'
          source_control_range_to: 'master'
      - name: Get the changelog message
        run: echo "${{ steps.changelog.outputs.changelog_message }}"
```
