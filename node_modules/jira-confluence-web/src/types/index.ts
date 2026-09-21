export interface Issue {
	id: string;
	key: string;
	summary: string;
	description: string;
	status: "To Do" | "In Progress" | "In Review" | "Done";
	assignee: string;
	teamName: string;
	storyPoints: number;
	priority: "Low" | "Medium" | "High" | "Critical";
}

export type IssueFormValues = Omit<Issue, "id" | "key">;
