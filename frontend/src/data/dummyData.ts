import { Board } from "@/types";

export const dummyData: Board = {
  columns: [
    { id: "backlog", title: "Backlog", cardIds: ["card-1", "card-2"] },
    { id: "todo", title: "To Do", cardIds: ["card-3", "card-4"] },
    { id: "in-progress", title: "In Progress", cardIds: ["card-5", "card-6"] },
    { id: "review", title: "Review", cardIds: ["card-7"] },
    { id: "done", title: "Done", cardIds: ["card-8", "card-9"] },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "Design system architecture",
      details: "Define component library structure and naming conventions",
    },
    "card-2": {
      id: "card-2",
      title: "Set up CI/CD pipeline",
      details: "Configure GitHub Actions for automated testing and deployment",
    },
    "card-3": {
      id: "card-3",
      title: "Implement user authentication",
      details: "Add login/logout functionality with JWT tokens",
    },
    "card-4": {
      id: "card-4",
      title: "Create API documentation",
      details: "Document all REST endpoints with examples",
    },
    "card-5": {
      id: "card-5",
      title: "Build dashboard components",
      details: "Create reusable chart and widget components",
    },
    "card-6": {
      id: "card-6",
      title: "Optimize database queries",
      details: "Add indexes and rewrite slow queries",
    },
    "card-7": {
      id: "card-7",
      title: "Write unit tests",
      details: "Achieve 80% code coverage for core modules",
    },
    "card-8": {
      id: "card-8",
      title: "Set up project repository",
      details: "Initialize Git repo and add base files",
    },
    "card-9": {
      id: "card-9",
      title: "Create wireframes",
      details: "Design low-fidelity mockups for all screens",
    },
  },
};
