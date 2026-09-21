import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createIssue, getIssueById, updateIssue } from "../services/mockIssues";
import type { Issue, IssueFormValues } from "../types";
const STATUS_OPTIONS: Issue["status"][] = ["To Do", "In Progress", "In Review", "Done"];
const PRIORITY_OPTIONS: Issue["priority"][] = ["Low", "Medium", "High", "Critical"];

const EMPTY_FORM: IssueFormValues = {
	summary: "",
	description: "",
	status: "To Do",
	assignee: "",
	teamName: "",
	storyPoints: 1,
	priority: "Medium",
};

export default function IssueFormPage() {
	const { issueId } = useParams<{ issueId: string }>();
	const navigate = useNavigate();
	const isEditing = Boolean(issueId);
	const existingIssue = issueId ? getIssueById(issueId) : undefined;

	const [form, setForm] = useState<IssueFormValues>(
		existingIssue
			? {
					summary: existingIssue.summary,
					description: existingIssue.description,
					status: existingIssue.status,
					assignee: existingIssue.assignee,
					teamName: existingIssue.teamName,
					storyPoints: existingIssue.storyPoints,
					priority: existingIssue.priority,
				}
			: EMPTY_FORM,
	);
	const [error, setError] = useState<string | null>(null);

	if (isEditing && !existingIssue) {
		return <p>Issue not found.</p>;
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!form.summary.trim() || !form.assignee.trim() || !form.teamName.trim()) {
			setError("Summary, assignee, and team name are required.");
			return;
		}
		setError(null);

		const issue =
			isEditing && issueId ? updateIssue(issueId, form) : createIssue(form);

		if (issue) {
			navigate(`/issues/${issue.id}`);
		}
	}

	return (
		<main>
			<h1>{isEditing ? "Edit Issue" : "Create Issue"}</h1>
			<form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: "480px" }}>
				<label>
					Summary
					<input
						type="text"
						value={form.summary}
						onChange={(e) => setForm({ ...form, summary: e.target.value })}
						required
					/>
				</label>

				<label>
					Description
					<textarea
						value={form.description}
						onChange={(e) => setForm({ ...form, description: e.target.value })}
						rows={4}
					/>
				</label>

				<label>
					Status
					<select
						value={form.status}
						onChange={(e) => setForm({ ...form, status: e.target.value as Issue["status"] })}
					>
						{STATUS_OPTIONS.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
				</label>

				<label>
					Assignee
					<input
						type="text"
						value={form.assignee}
						onChange={(e) => setForm({ ...form, assignee: e.target.value })}
						required
					/>
				</label>

				<label>
					Team Name
					<input
						type="text"
						value={form.teamName}
						onChange={(e) => setForm({ ...form, teamName: e.target.value })}
						required
					/>
				</label>

				<label>
					Story Points
					<input
						type="number"
						min={0}
						value={form.storyPoints}
						onChange={(e) => setForm({ ...form, storyPoints: Number(e.target.value) })}
					/>
				</label>

				<label>
					Priority
					<select
						value={form.priority}
						onChange={(e) => setForm({ ...form, priority: e.target.value as Issue["priority"] })}
					>
						{PRIORITY_OPTIONS.map((priority) => (
							<option key={priority} value={priority}>
								{priority}
							</option>
						))}
					</select>
				</label>

				{error && <p role="alert" style={{ color: "red" }}>{error}</p>}

				<button type="submit">{isEditing ? "Save Changes" : "Create Issue"}</button>
			</form>
		</main>
	);
}
