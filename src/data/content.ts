// src/data/content.ts

export const personalData = {
  name: "Samuel Kwak",
  title: "Cloud & AI Platform Engineer",
  bio: "Highly adaptable full-stack engineer with over 7 years of experience delivering projects with ambiguous scopes and evolving requirements. I am obsessed with understanding technical design. I am a strong proponent of testable, readable code, and I thrive on improving team processes and developer experience through collaboration and tooling. I use AI-driven, agentic workflows for enhanced productivity.",
  resumeUrl: "/Resume 2026.pdf",
};

export const projects = [
  {
    title: "Azure Copilot in Portal",
    slug: "azure-copilot",
    description: "Contributor across the Azure Copilot in Portal stack, with emphasis on deeply understanding client-server interaction quality, reliability, and performance, as well as measurement thereof.",
    techStack: ["React", "CosmosDB", "Microsoft Bot Framework"],
    isHero: true,
    isLarge: false,
    isWide: false,
  },
  {
    title: "RevMatch App",
    slug: "revmatch",
    description: "Car Journaling Mobile/Web App. Passion project built ground-up using cloud-first stack hosted on GCP and Vercel. Designed and developed backend architecture, primary owner of webapp.",
    techStack: ["GCP", "Vercel", "Cloud SQL", "Firebase TRDB", "MongoDB", "Cloud Tasks"],
    liveUrl: "https://revmatch.io",
    isHero: false,
    isLarge: true,
    isWide: false,
  },
  {
    title: "retest-ai",
    slug: "retest-ai",
    description: "An AI-powered testing suite that automates regression testing and reasoning. [Placeholder description, click to see more]",
    techStack: ["Next.js", "OpenAI", "Node.js"],
    isHero: false,
    isLarge: false,
    isWide: true,
  },
  {
    title: "Generative Art",
    slug: "generative-art",
    description: "Algorithmic visual experiments and WebGL shaders.",
    techStack: ["WebGL", "Three.js"],
    isHero: false,
    isLarge: false,
    isWide: false,
  },
  {
    title: "Kwakanalia",
    slug: "kwakanalia",
    description: "Full-stack wedding platform with custom RSVP and guest tech.",
    techStack: ["Gatsby", "Docker", "Typescript"],
    liveUrl: "https://kwakanalia.wedding",
    isHero: false,
    isLarge: false,
    isWide: false,
  },
];

export const experience = [
  {
    date: "Sep 2024 - Present",
    title: "Senior Software Engineer",
    company: "Microsoft, Azure Copilot Core",
    description: "Contributor across the Azure Copilot SDK stack and Azure Copilot in Portal. Built scalable telemetry systems. Led development of an internal tool for agent/plugin development, completing MVP ahead of a 3-month deadline.",
  },
  {
    date: "May 2020 - Sep 2024",
    title: "Software Engineer 2",
    company: "Microsoft, Azure Portal Framework",
    description: "Developed and deployed multiple high-value experiences receiving over 1 million unique weekly loads. Cross-functional leadership between Azure Mobile and Azure Support teams to revamp high-traffic views.",
  },
  {
    date: "Mar 2018 - May 2020",
    title: "Software Developer",
    company: "Big Nerd Ranch, Web Team",
    description: "Primary contributor of a critical search service UI/UX for a Fortune 100 client. Led internal process reforms and pioneered BNR's web internship program focusing on diverse hires.",
  },
];
