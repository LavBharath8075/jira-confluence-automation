import { Link, useParams } from "react-router-dom";
import { getIssueById } from "../services/mockIssues";

export default function IssueDetailPage() {
	const { issueId } = useParams<{ issueId: string }>();
	const issue = issueId ? getIssueById(issueId) : undefined;

	if (!issue) {
		return (
			<main>
				<p>Issue not found.</p>
				<Link to="/sprint-board">Back to Sprint Board</Link>
			</main>
		);
	}

	return (
		<main>
			<Link to="/sprint-board">← Back to Sprint Board</Link>
			<h1>
				{issue.key}: {issue.summary}
			</h1>
			<dl>
				<dt>Description</dt>
				<dd>{issue.description}</dd>

				<dt>Status</dt>
				<dd>{issue.status}</dd>

				<dt>Assignee</dt>
				<dd>{issue.assignee}</dd>

				<dt>Team Name</dt>
				<dd>{issue.teamName}</dd>

				<dt>Story Points</dt>
				<dd>{issue.storyPoints}</dd>

				<dt>Priority</dt>
				<dd>{issue.priority}</dd>
			</dl>
		</main>
	);
}
