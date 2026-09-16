import type {
  User, ConsultantProfile, Project, Invoice, Conversation,
  Notification, Service, Testimonial, Stat, FAQ,
  ClientDashboardStats, ConsultantDashboardStats, AdminDashboardStats
} from '../types';

// ─── Mock Users ───────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Wanjiku',
    email: 'alice@example.com',
    role: 'client',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
  {
    id: 'u2',
    name: 'Brian Otieno',
    email: 'brian@example.com',
    role: 'consultant',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian',
    createdAt: '2024-02-05T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
  {
    id: 'u3',
    name: 'Carol Muthoni',
    email: 'carol@logictech.io',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-06-01T08:00:00Z',
  },
];

export const currentClientUser: User = mockUsers[0];
export const currentConsultantUser: User = mockUsers[1];
export const currentAdminUser: User = mockUsers[2];

// ─── Mock Consultant Profiles ─────────────────────────────────────────────────
export const mockConsultants: ConsultantProfile[] = [
  {
    id: 'c1',
    userId: 'u2',
    name: 'Brian Otieno',
    email: 'brian@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brian',
    specialization: 'Full Stack Development',
    bio: 'Senior full-stack developer with 8+ years of experience building scalable web applications using React, Node.js, and PostgreSQL. Expert in cloud infrastructure and microservices.',
    hourlyRate: 85,
    rating: 0.0,
    reviewCount: 0,
    completedProjects: 0,
    experienceYears: 8,
    availability: 'available',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    location: 'Nairobi, Kenya',
    verified: true,
  },
  {
    id: 'c2',
    userId: 'u4',
    name: 'Diana Kamau',
    email: 'diana@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    specialization: 'Cybersecurity',
    bio: 'Certified cybersecurity expert specializing in penetration testing, vulnerability assessments, and security architecture. Helping companies stay secure.',
    hourlyRate: 110,
    rating: 0.0,
    reviewCount: 0,
    completedProjects: 0,
    experienceYears: 10,
    availability: 'available',
    skills: ['Penetration Testing', 'SIEM', 'Firewall Config', 'ISO 27001', 'Zero Trust'],
    certifications: ['CISSP', 'CEH', 'CompTIA Security+'],
    location: 'Nairobi, Kenya',
    verified: true,
  },
  {
    id: 'c3',
    userId: 'u5',
    name: 'Emmanuel Njoroge',
    email: 'emma@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    specialization: 'Data Science & AI',
    bio: 'Machine learning engineer and data scientist with deep expertise in Python, TensorFlow, and building production AI pipelines. Transforming data into business insights.',
    hourlyRate: 120,
    rating: 0.0,
    reviewCount: 0,
    completedProjects: 0,
    experienceYears: 6,
    availability: 'busy',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Spark', 'Power BI'],
    certifications: ['Google ML Professional', 'TensorFlow Developer'],
    location: 'Mombasa, Kenya',
    verified: true,
  },
  {
    id: 'c4',
    userId: 'u6',
    name: 'Faith Waweru',
    email: 'faith@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Faith',
    specialization: 'Cloud & DevOps',
    bio: 'DevOps engineer and cloud architect specializing in CI/CD pipelines, Kubernetes orchestration, and multi-cloud deployments for enterprise clients.',
    hourlyRate: 95,
    rating: 0.0,
    reviewCount: 0,
    completedProjects: 0,
    experienceYears: 7,
    availability: 'available',
    skills: ['Kubernetes', 'Terraform', 'Jenkins', 'Azure', 'GCP', 'Linux'],
    certifications: ['CKA', 'Azure DevOps Expert', 'Terraform Associate'],
    location: 'Nairobi, Kenya',
    verified: true,
  },
  {
    id: 'c5',
    userId: 'u7',
    name: 'George Kiprop',
    email: 'george@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=George',
    specialization: 'UI/UX Design',
    bio: 'Product designer with a passion for creating beautiful, intuitive interfaces. Specialized in design systems, user research, and prototyping with Figma.',
    hourlyRate: 70,
    rating: 0.0,
    reviewCount: 0,
    completedProjects: 0,
    experienceYears: 5,
    availability: 'available',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research', 'CSS'],
    certifications: ['Google UX Design Certificate'],
    location: 'Eldoret, Kenya',
    verified: false,
  },
  {
    id: 'c6',
    userId: 'u8',
    name: 'Hannah Osei',
    email: 'hannah@example.com',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hannah',
    specialization: 'Database Administration',
    bio: 'Database administrator and architect with expertise in PostgreSQL, MySQL, and Oracle. Ensuring data integrity, performance tuning, and disaster recovery.',
    hourlyRate: 80,
    rating: 0.0,
    reviewCount: 0,
    completedProjects: 0,
    experienceYears: 9,
    availability: 'unavailable',
    skills: ['PostgreSQL', 'MySQL', 'Oracle', 'MongoDB', 'Redis', 'DBA Tools'],
    certifications: ['Oracle DBA Certified', 'MongoDB Associate'],
    location: 'Kisumu, Kenya',
    verified: true,
  },
];

// ─── Mock Projects ─────────────────────────────────────────────────────────────
export const mockProjects: Project[] = [];

// ─── Mock Invoices ─────────────────────────────────────────────────────────────
export const mockInvoices: Invoice[] = [];

// ─── Mock Conversations ────────────────────────────────────────────────────────
export const mockConversations: Conversation[] = [];

// ─── Mock Notifications ────────────────────────────────────────────────────────
export const mockNotifications: Notification[] = [];

// ─── Mock Services ─────────────────────────────────────────────────────────────
export const mockServices: Service[] = [
  { id: 's1', title: 'Web Development', description: 'Build fast, scalable web applications from design to deployment.', iconIdentifier: 'FaCode' },
  { id: 's2', title: 'Cybersecurity', description: 'Protect your digital assets with comprehensive security audits and solutions.', iconIdentifier: 'FaShieldAlt' },
  { id: 's3', title: 'Cloud & DevOps', description: 'Modernize your infrastructure with cloud migration and CI/CD pipelines.', iconIdentifier: 'FaCloud' },
  { id: 's4', title: 'Data Science & AI', description: 'Extract value from your data with machine learning and predictive analytics.', iconIdentifier: 'FaBrain' },
  { id: 's5', title: 'UI/UX Design', description: 'Design intuitive, delightful user experiences that convert and retain users.', iconIdentifier: 'FaPalette' },
  { id: 's6', title: 'Database Administration', description: 'Ensure optimal database performance, security, and disaster recovery.', iconIdentifier: 'FaDatabase' },
  { id: 's7', title: 'Mobile Development', description: 'Build native and cross-platform mobile apps for iOS and Android.', iconIdentifier: 'FaMobile' },
  { id: 's8', title: 'IT Consulting', description: 'Strategic technology consulting to align IT with your business goals.', iconIdentifier: 'FaLightbulb' },
];

// ─── Mock Testimonials ─────────────────────────────────────────────────────────
export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amara Osei',
    role: 'CTO',
    company: 'Finbridge Africa',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    content: 'Logic Tech connected us with a cybersecurity expert who hardened our entire fintech stack in under 3 weeks. The process was seamless — from matching to delivery. We felt genuinely supported every step of the way.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'James Muthoni',
    role: 'Head of Engineering',
    company: 'Savannah eCommerce',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    content: 'We needed a senior React developer on a tight deadline. Logic Tech had us matched within hours. The consultant delivered a full redesign of our storefront that boosted conversions by 34%. Absolutely worth it.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Linda Waweru',
    role: 'Operations Director',
    company: 'MediLink Health',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    content: 'Our legacy database was a nightmare. The DBA consultant from Logic Tech optimised our PostgreSQL setup and reduced query times by 80%. The escrow payment system gave us full confidence throughout the engagement.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'David Kariuki',
    role: 'Founder & CEO',
    company: 'BuildRight PropTech',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    content: 'We hired a cloud architect who migrated our monolith to microservices on AWS. The milestone tracking on the platform made it easy to follow progress in real time. Highly recommend for any startup scaling fast.',
    rating: 4,
  },
  {
    id: 't5',
    name: 'Grace Njeri',
    role: 'Product Manager',
    company: 'Edu-Connect Kenya',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    content: "The UI/UX consultant transformed our learning platform into something our students actually love using. Engagement metrics doubled after the redesign. Logic Tech's vetting process clearly works — quality talent only.",
    rating: 5,
  },
  {
    id: 't6',
    name: 'Samuel Otieno',
    role: 'IT Manager',
    company: 'TransAfrica Logistics',
    avatarUrl: 'https://i.pravatar.cc/150?img=52',
    content: 'From mobile app development to ongoing IT consulting, Logic Tech has been our go-to platform for two years. The consultants are professional, deadline-conscious, and always go the extra mile. A true partner for growth.',
    rating: 5,
  },
];

// ─── Platform Stats ─────────────────────────────────────────────────────────────
export const platformStats: Stat[] = [
  { label: 'Expert Consultants', value: '1', description: 'Vetted IT professionals' },
  { label: 'Projects Completed', value: '0', description: 'Successfully delivered' },
  { label: 'Satisfied Clients', value: '0', description: 'Companies worldwide' },
  { label: 'Countries Served', value: '1', description: 'Global reach' },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────
export const mockFAQs: FAQ[] = [
  {
    id: 'faq1',
    question: 'How does Logic Tech vet its consultants?',
    answer: 'All consultants go through a rigorous 3-step process: portfolio review, technical assessment, and video interview. Only the top 15% are accepted onto the platform.',
  },
  {
    id: 'faq2',
    question: 'Is there a minimum project size?',
    answer: 'We support projects of all sizes, from small one-time tasks to long-term enterprise contracts. Our platform is flexible to meet your needs.',
  },
  {
    id: 'faq3',
    question: 'How does payment protection work?',
    answer: 'Funds are held in escrow and released to the consultant only upon your approval of completed milestones. You are always in control of your budget.',
  },
  {
    id: 'faq4',
    question: 'Can I hire multiple consultants for one project?',
    answer: 'Absolutely! You can assemble a full team of specialists for complex projects. Our platform supports team-based engagements.',
  },
  {
    id: 'faq5',
    question: 'What if I am not satisfied with the work?',
    answer: 'We offer a dispute resolution service. If issues arise, our team mediates and ensures a fair outcome. Your satisfaction is our priority.',
  },
  {
    id: 'faq6',
    question: 'How do I get started as a consultant?',
    answer: 'Sign up, complete your profile with your skills and portfolio, pass our vetting process, and start receiving project requests. The whole process takes 3-5 business days.',
  },
  {
    id: 'faq7',
    question: 'Who owns the Intellectual Property (IP) of the work produced?',
    answer: 'You retain 100% ownership of all IP, code, and deliverables created for your project. All consultants sign standard NDAs and IP assignment agreements prior to kickoff.',
  },
  {
    id: 'faq8',
    question: 'What are the platform transaction fees?',
    answer: 'Logic Tech charges a transparent 5% service fee for clients and 10% for consultants to cover secure escrow, platform maintenance, and 24/7 dispute resolution support.',
  },
  {
    id: 'faq9',
    question: 'How quickly can a consultant start working on my project?',
    answer: 'Most clients are matched with suitable candidates within 2 to 24 hours of posting their project requirements, allowing work to begin almost immediately.',
  },
];

// ─── Dashboard Stats ────────────────────────────────────────────────────────────
export const mockClientStats: ClientDashboardStats = {
  activeProjects: 0,
  pendingRequests: 0,
  totalSpent: 0,
  completedProjects: 0,
};

export const mockConsultantStats: ConsultantDashboardStats = {
  activeProjects: 0,
  pendingProposals: 0,
  totalEarned: 0,
  avgRating: 0.0,
};

export const mockAdminStats: AdminDashboardStats = {
  totalUsers: 3,
  totalConsultants: 1,
  totalClients: 1,
  activeProjects: 0,
  totalRevenue: 0,
  pendingApprovals: 0,
};
