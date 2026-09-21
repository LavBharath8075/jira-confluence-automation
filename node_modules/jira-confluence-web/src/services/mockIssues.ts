import type { Issue, IssueFormValues } from "../types";

// Temporary in-memory sample data until the API's Jira integration is wired up.
export const mockIssues: Issue[] = [
	{
		id: "1",
		key: "JCA-101",
		summary: "Set up CI pipeline for API and web workspaces",
		description:
			"Configure GitHub Actions to run typecheck, lint, and tests for the apps/api and apps/web workspaces on every pull request.",
		status: "In Progress",
		assignee: "Alex Chen",
		teamName: "Platform",
		storyPoints: 5,
		priority: "High",
	},
	{
		id: "2",
		key: "JCA-102",
		summary: "Design Confluence page renderer for weekly reports",
		description:
			"Build a markdown-to-Confluence renderer that converts generated status reports into published Confluence pages.",
		status: "To Do",
		assignee: "Priya Sharma",
		teamName: "Automation",
		storyPoints: 8,
		priority: "Medium",
	},
	{
		id: "3",
		key: "JCA-103",
		summary: "Add sprint board view to web dashboard",
		description:
			"Implement a Sprint Board page that lists Jira issues grouped by status, with a detail view for each issue.",
		status: "In Review",
		assignee: "Jordan Lee",
		teamName: "Automation",
		storyPoints: 3,
		priority: "High",
	},
	{
		id: "4",
		key: "JCA-104",
		summary: "Normalize Jira field mappings from config",
		description:
			"Load field mapping definitions from config/field-mappings.toml and normalize raw Jira API responses into internal models.",
		status: "Done",
		assignee: "Sam Patel",
		teamName: "Platform",
		storyPoints: 5,
		priority: "Critical",
	},
	{
		id: "5",
		key: "JCA-105",
		summary: "Write integration tests for report generation",
		description:
			"Cover the report generation flow end-to-end, including data fetch, normalization, and markdown rendering.",
		status: "To Do",
		assignee: "Priya Sharma",
		teamName: "QA",
		storyPoints: 3,
		priority: "Low",
	},
];

export function getIssueById(id: string): Issue | undefined {
	return mockIssues.find((issue) => issue.id === id);
}

export function createIssue(values: IssueFormValues): Issue {
	const nextNumber = mockIssues.length + 101;
	const issue: Issue = {
		id: String(Date.now()),
		key: `JCA-${nextNumber}`,
		...values,
	};
	mockIssues.push(issue);
	return issue;
}

export function updateIssue(id: string, values: IssueFormValues): Issue | undefined {
	const issue = getIssueById(id);
	if (!issue) return undefined;
	Object.assign(issue, values);
	return issue;
}
