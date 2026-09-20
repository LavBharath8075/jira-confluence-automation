# Module 13 Completion Report

## MCP Configuration
{
  "servers": {
    "echo-windows": {
      "command": "powershell",
      "args": [
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        "./path/to/mcp-echo.ps1"
      ]
    },
    "atlassian-official": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v2/mcp"
    },
    "mcp-atlassian-jira": {
      "command": "uvx",
      "args": [
        "mcp-atlassian"
      ],
      "env": {
        "JIRA_URL": "${env:JIRA_URL}",
        "JIRA_USERNAME": "${env:JIRA_USERNAME}",
        "JIRA_API_TOKEN": "${env:JIRA_API_TOKEN}",
        "JIRA_PROJECT": "${env:JIRA_PROJECT}"
      }
    }
  }
}

## Configured Servers
- echo-windows
- atlassian-official
- mcp-atlassian-jira

## MCP Tool Test
- Tool used: echo-windows
- Output:
The argument './path/to/mcp-echo.ps1' to the -File parameter does not exist. Pro
vide the path to an existing '.ps1' file as an argument to the -File parameter.
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.
