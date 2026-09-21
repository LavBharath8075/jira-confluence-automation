import { Link, Route, Routes } from "react-router-dom";
import SprintBoardPage from "./pages/SprintBoardPage";
import IssueDetailPage from "./pages/IssueDetailPage";
import IssueFormPage from "./pages/IssueFormPage";

function HomePage() {
	return (
		<main>
			<h1>Jira/Confluence Automation</h1>
			<p>Frontend shell is running.</p>
		</main>
	);
}

export default function App() {
	return (
		<>
			<nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
				<Link to="/">Home</Link>
				<Link to="/sprint-board">Sprint Board</Link>
			</nav>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/sprint-board" element={<SprintBoardPage />} />
				<Route path="/issues/new" element={<IssueFormPage />} />
				<Route path="/issues/:issueId" element={<IssueDetailPage />} />
				<Route path="/issues/:issueId/edit" element={<IssueFormPage />} />
			</Routes>
		</>
	);
}

