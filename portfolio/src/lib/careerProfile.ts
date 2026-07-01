import {
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Database,
  Rocket,
  ScanSearch,
  type LucideIcon,
} from "lucide-react";

export type TimelineItem = {
  period: string;
  title: string;
  summary: string;
  outcome: string;
};

export type ProjectCard = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
};

export type SkillGroup = {
  icon: LucideIcon;
  title: string;
  items: string[];
};

export type PortfolioLink = {
  title: string;
  href: string;
  status: string;
  description: string;
};

export const expertise = [
  "Machine Learning",
  "Computer Vision",
  "NLP",
  "PyTorch",
  "Scikit-learn",
  "Python",
  "Spark",
  "SQL",
];

export const metrics = [
  {
    value: "72 -> 90",
    label: "F1 score lift on facial biometrics classification",
  },
  {
    value: "3",
    label: "cross-functional teammates led on a cryobiology project",
  },
  {
    value: "2025",
    label: "BSc in Applied Mathematics completed with a 5.0 GPA",
  },
];

export const journey: TimelineItem[] = [
  {
    period: "Feb 2025 - Present",
    title: "Facial Soft Biometrics Classification",
    summary:
      "Fine-tuning ResNet models for multi-label facial attribute prediction with a strong emphasis on data quality, imbalance handling, and measurable gains.",
    outcome:
      "Improved F1 score from 72 to 90 by combining augmentation strategy, targeted data integration, and Focal Loss.",
  },
  {
    period: "Feb 2024 - Jun 2024",
    title: "Cryobiology Project",
    summary:
      "Led a three-person team building instance segmentation and tracking workflows for cells and spheroids in microscopic imagery.",
    outcome:
      "Delivered segmentation, filtering, SAHI-based x10 image optimization, geometric measurements, and change-tracking over sequences.",
  },
  {
    period: "Jan 2023 - May 2023",
    title: "Geometrica",
    summary:
      "Designed an interactive desktop tool for exploring second-degree curves with real-time manipulation and visual feedback.",
    outcome:
      "Built a PyQt interface with Matplotlib-powered visualization for shape selection, rotation, and equation editing.",
  },
  {
    period: "Mar 2022 - May 2022",
    title: "Regression Project",
    summary:
      "Built a regression model analyzing the relationship between inflation and unemployment while implementing core numerical routines from scratch.",
    outcome:
      "Created custom matrix operations and statistical indicators including correlation, variability, and R2 score.",
  },
];

export const projectCards: ProjectCard[] = [
  {
    icon: BrainCircuit,
    eyebrow: "Applied ML",
    title: "Model performance, not just experimentation",
    description:
      "I like work that moves from idea to proof. My recent biometrics research focused on training strategy, imbalance correction, and practical metric gains rather than one-off demos.",
  },
  {
    icon: ScanSearch,
    eyebrow: "Computer Vision",
    title: "Segmentation and structure from noisy imagery",
    description:
      "In cryobiology, I worked on extracting objects, filtering artifacts, and turning masks into measurements that support downstream biological analysis.",
  },
  {
    icon: ChartNoAxesCombined,
    eyebrow: "Analytical Rigor",
    title: "Mathematics-first thinking",
    description:
      "My applied mathematics background shapes how I reason about models, evaluation, optimization, and the tradeoffs between clarity, complexity, and performance.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    icon: Code2,
    title: "Core Stack",
    items: ["Python", "C++", "Scala", "Git", "Jupyter", "SQL"],
  },
  {
    icon: Database,
    title: "Data + ML",
    items: [
      "PyTorch",
      "Scikit-learn",
      "NumPy",
      "Pandas",
      "Feature Engineering",
      "EDA",
    ],
  },
  {
    icon: Rocket,
    title: "Systems + Scale",
    items: ["Apache Spark", "Hadoop", "Algorithms", "Data Structures", "Qt"],
  },
];

export const portfolioLinks: PortfolioLink[] = [
  {
    title: "Case Studies",
    href: "#contact",
    status: "Launching soon",
    description:
      "Deep dives into model decisions, experiments, and measurable outcomes.",
  },
  {
    title: "Project Archive",
    href: "#journey",
    status: "Curating now",
    description:
      "A growing catalog of technical projects across ML, CV, and analytical engineering.",
  },
  {
    title: "Writing + Notes",
    href: "#about",
    status: "Reserved",
    description:
      "A future space for research notes, implementation lessons, and practical ML reflections.",
  },
];

export const starterQuestions = [
  "What kind of machine learning problems do you enjoy most?",
  "Can you tell me about your cryobiology project?",
  "How did you improve the facial biometrics model?",
  "What are you looking for in your next opportunity?",
];

export const digitalTwinProfile = `
Name: Ilona Kuznetsova
Title: Data Scientist
Location: Kyiv, Ukraine
Contact email: ilonakuz@proton.me
Phone: +380 (68) 393 8534

Professional summary:
- Data scientist with a background in applied mathematics.
- Focus areas: machine learning, computer vision, NLP, data science, and analytical engineering.
- Interested in building intelligent systems with measurable outcomes and disciplined implementation.

Education:
- National Technical University "Kharkiv Polytechnic Institute"
- Bachelor's in Applied Mathematics
- Dates: September 2021 to June 2025
- GPA: 5.0
- Relevant courses: Algorithms, Computational Methods, Statistics, OOP, Calculus

Languages spoken:
- English: Full Working Proficiency
- Ukrainian: Bilingual Proficiency
- Russian: Bilingual Proficiency

Skills:
- Languages: Python, C++, Scala
- ML and AI: PyTorch, Scikit-learn, NLP, Computer Vision, RNN
- Data science: NumPy, Pandas, Matplotlib, Seaborn, EDA, Feature Engineering
- Big data: Apache Spark, Hadoop
- Tools: Qt, Jupyter, Git, SQL, Algorithms, Data Structures

Achievements and certifications:
- Finalist, All-Ukrainian Olympiad in Informatics (Stage 3, 2020)
- Google Cloud Skill Boost certifications in GenAI, LLM, TensorFlow, and Data Engineering
- Fundamentals of Distributed and Parallel Computing certificate

Selected technical projects:
${journey
  .map(
    (item) =>
      `- ${item.title} (${item.period}): ${item.summary} ${item.outcome}`,
  )
  .join("\n")}

Career preferences and voice:
- Communicate as a thoughtful, professional, ambitious early-career data scientist.
- Speak in first person when answering questions about experience, interests, goals, or work style.
- Be concise, honest, and grounded in the provided profile.
- If something is not covered here, say that it is not on the current CV/portfolio rather than inventing details.
`.trim();
