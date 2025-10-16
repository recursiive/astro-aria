export const siteConfig = {
  name: "Ryan Hunt",
  title: "Computer Science Student / IT Audit Intern",
  description: "Portfolio website of Ryan Hunt",
  accentColor: "#BF5700",
  social: {
    email: "ryanahunt@proton.me",
    linkedin: "https://linkedin.com/in/ryananthunt",
    twitter: "https://x.com/recusiive",
    github: "https://github.com/recursiive",
    cyberdefenders: "https://cyberdefenders.org/p/recursiive",
    tryhackme: "https://tryhackme.com/p/recusiive"
  },
  aboutMe:
    "I am a Senior Computer Science & Cybersecurity student at The University of Texas at San Antonio (UTSA) and I am currently interning as an IT Auditor. I've gained hands-on experience with risk-based IT Audit assessments, frameworks, and full-stack web developing skills.",
  skills: ["Javascript", "React", "Next.js", "Python", "Linux", "SQL", "NIST"],
  projects: [
    {
      name: "Steganography Project",
      description:
        "Command-line steganography program to hide and extract arbitrary binary files within 8-bit grayscale BMP images by using a simple run-length encoding (RLE) scheme on each pixels LSB.",
      link: "https://github.com/rhunt0/steganography-project",
      skills: ["Python", "Linux", "Steganography"],
    },
    {
      name: "D2C E-Commerce Platform",
      description:
        "D2C e-commerce bakery platform with an integrated secure admin content management system that has currently served over 150+ customers, built using Next.js, TypeScript, and SQL.",
      link: "https://thecrispydough.com/",
      skills: ["Next.js", "SQL", "TypeScript"],
    },
    {
      name: "Participant @ TracerFIRE",
      description:
        "Placed 2nd out of 16 in the TracerFIRE cybersecurity competition hosted by Sandia National Laboratories, focused on digital forensics and incident response, utilizing tools such as Elastic, Velociraptor, Malcolm, Detect It Easy to uncover the story of a simulated company's live cyber attack.",
      link: "https://www.linkedin.com/posts/ryananthunt_this-weekend-i-competed-in-the-tracerfire-activity-7302135454970060800-mpQe?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEapH0EBE3YP-Lwgk0Lr8Q4nvL9GIrNacac",
      skills: ["Digital Forensics", "Incident Response", "Elastic"],
    },
  ],
  experience: [
    {
      company: "Randolph-Brooks Federal Credit Union",
      title: "IT Audit Intern",
      dateRange: "May 2025 - Present",
      bullets: [
        "Independently executed risk-based IT assessment programs — including audits, findings, and validations with clearly defined scopes and objectives, aligned to industry frameworks and regulatory standards.",
        "Collaborated with cross-functional teams to validate corrective actions and monitor implementation progress, driving continuous improvement in IT controls and processes.",
        "Validated remediations of critical audit observations that if left unaddressed, could have exposed the organization to potential losses exceeding $600 million.",
      ],
    },
    {
      company: "Six Flags Fiesta Texas",
      title: "Information Systems Technician",
      dateRange: "February 2025 - May 2025",
      bullets: [
        "Provided technical support and troubleshooting for Windows 10 systems, Oracle POS hardware, VoIP and analog phones, and computers using Jira ticketing software to track and resolve IT service requests.",
        "Performed daily system status checks on UPS, servers, firewalls, and network switches; reported issues to leadership and supported Active Directory queries such as user creation and group policy enforcement.",
      ],
    },
    {
      company: "Freelance",
      title: "Full-Stack Web Developer",
      dateRange: "January 2024 - Present",
      bullets: [
        "Engineered a bakery e-commerce platform website with an integrated secure admin content management system that has currently served over 150+ customers, built on Next.js, TypeScript, SQL.",
        "Provided structural website redesigns and maintenance for 3 companies mainly utilizing WordPress, TypeScript, and JavaScript.",
      ],
    },
    {
      company: "Watershed Carwash",
      title: "Salesperson",
      dateRange: "June 2022 - May 2025",
      bullets: [
        "Generated over $720K in annual recurring membership sales by building strong customer relationships and promoting carwash packages across San Antonio and New Braunfels while practicing professional, informative selling practices.",
      ],
    },
  ],
  education: [
    {
      school: "University of Texas at San Antonio",
      degree: "Bachelor of Science in Computer Science",
      dateRange: "2021 - Dec 2025",
      achievements: [
        "3.68 GPA",
        "Member of Cyber Jedis, Computer Security Association",
        "Dean's List recipient",
      ],
    },
  ],
};
