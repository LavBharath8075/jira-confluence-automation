import { Link } from "react-router-dom";
import { mockIssues } from "../services/mockIssues";
import type { Issue } from "../types";

const STATUS_COLUMNS: Issue["status"][] = ["To Do", "In Progress", "In Review", "Done"];

export default function SprintBoardPage() {
	return (
		<main>
			<h1>Sprint Board</h1>
			<Link to="/issues/new">+ New Issue</Link>
			<div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
				{STATUS_COLUMNS.map((status) => (
					<section key={status} style={{ flex: 1, minWidth: 0 }}>
						<h2>{status}</h2>
						{mockIssues
							.filter((issue) => issue.status === status)
							.map((issue) => (
								<Link
									key={issue.id}
									to={`/issues/${issue.id}`}
									style={{
										display: "block",
										border: "1px solid #ccc",
										borderRadius: "4px",
										padding: "0.75rem",
										marginBottom: "0.5rem",
										textDecoration: "none",
										color: "inherit",
									}}
								>
									<strong>{issue.key}</strong>
									<p>{issue.summary}</p>
									<small>
										{issue.assignee} · {issue.storyPoints} pts
									</small>
								</Link>
							))}
					</section>
				))}
			</div>
		</main>
	);
}
