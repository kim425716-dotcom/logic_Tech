import type {
  User, Project, Invoice, Conversation,
  Notification, Service, Testimonial, Stat, FAQ,
  ClientDashboardStats, AdminDashboardStats
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
export const currentAdminUser: User = mockUsers[1];

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
  { id: 's8', title: 'IT Consulting & Architecture', description: 'Strategic technology architecture to align IT with your business goals.', iconIdentifier: 'FaLightbulb' },
];

// ─── Mock Testimonials ─────────────────────────────────────────────────────────
export const mockTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Amara Osei',
    role: 'CTO',
    company: 'Finbridge Africa',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    content: 'Logic Tech deployed a cybersecurity team that hardened our entire fintech infrastructure in under 3 weeks. The delivery was seamless from scoping to deployment. We felt supported every step of the way.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'James Muthoni',
    role: 'Head of Engineering',
    company: 'Savannah eCommerce',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    content: 'We needed a complete frontend overhaul on a tight deadline. Logic Tech assigned dedicated engineers who delivered a modern architecture that boosted our conversions by 34%. Absolutely worth it.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Linda Waweru',
    role: 'Operations Director',
    company: 'MediLink Health',
    avatarUrl: 'https://i.pravatar.cc/150?img=25',
    content: 'Our legacy database was a bottleneck. The database engineers at Logic Tech optimized our PostgreSQL setup and reduced query times by 80%. The transparent project milestones gave us full confidence throughout.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'David Kariuki',
    role: 'Founder & CEO',
    company: 'BuildRight PropTech',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    content: 'Logic Tech migrated our monolith to high-availability microservices on AWS. Milestone tracking on the dashboard made it easy to follow progress in real time. Highly recommend for any scaling company.',
    rating: 4,
  },
  {
    id: 't5',
    name: 'Grace Njeri',
    role: 'Product Manager',
    company: 'Edu-Connect Kenya',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    content: 'The Logic Tech design and frontend team transformed our learning platform into a world-class experience. Engagement metrics doubled after the redesign.',
    rating: 5,
  },
  {
    id: 't6',
    name: 'Samuel Otieno',
    role: 'IT Manager',
    company: 'TransAfrica Logistics',
    avatarUrl: 'https://i.pravatar.cc/150?img=52',
    content: 'From mobile app engineering to cloud infrastructure, Logic Tech has been our primary technology partner for two years. Professional, deadline-conscious, and always exceeding expectations.',
    rating: 5,
  },
];

// ─── Platform Stats ─────────────────────────────────────────────────────────────
export const platformStats: Stat[] = [
  { label: 'Projects Delivered', value: '150+', description: 'Successfully deployed' },
  { label: 'Uptime & Reliability', value: '99.9%', description: 'Enterprise-grade SLA' },
  { label: 'Satisfied Clients', value: '80+', description: 'Companies worldwide' },
  { label: 'Countries Served', value: '12+', description: 'Global tech operations' },
];

// ─── FAQ ────────────────────────────────────────────────────────────────────────
export const mockFAQs: FAQ[] = [
  {
    id: 'faq1',
    question: 'How does Logic Tech deliver IT projects?',
    answer: 'Every project follows a structured engineering lifecycle: requirements discovery, architecture design, sprint-based development with live milestone tracking, automated QA, and seamless production deployment.',
  },
  {
    id: 'faq2',
    question: 'What project scopes and sizes do you support?',
    answer: 'We deliver projects ranging from targeted technical audits and feature development to full-scale enterprise software systems, cloud migrations, and dedicated engineering squads.',
  },
  {
    id: 'faq3',
    question: 'How does project pricing and milestone approval work?',
    answer: 'Pricing is transparent and milestone-based. You approve project deliverables at each milestone before funds are released, ensuring total control over your budget and quality.',
  },
  {
    id: 'faq4',
    question: 'Who owns the Intellectual Property (IP) of the deliverables?',
    answer: 'You retain 100% full ownership of all source code, architecture, designs, documentation, and IP created during your project under standard enterprise agreements.',
  },
  {
    id: 'faq5',
    question: 'What ongoing maintenance and support is provided?',
    answer: 'We provide post-deployment warranty, SLA-backed monitoring, performance tuning, and optional dedicated maintenance retainers to keep your systems running smoothly.',
  },
  {
    id: 'faq6',
    question: 'How quickly can project work begin after submission?',
    answer: 'Once you submit a service request, our solution architects review your requirements and provide an initial proposal and timeline within 24 hours.',
  },
];

// ─── Dashboard Stats ────────────────────────────────────────────────────────────
export const mockClientStats: ClientDashboardStats = {
  activeProjects: 0,
  pendingRequests: 0,
  totalSpent: 0,
  completedProjects: 0,
};

export const mockAdminStats: AdminDashboardStats = {
  totalUsers: 2,
  totalClients: 1,
  activeProjects: 0,
  totalRevenue: 0,
  pendingApprovals: 0,
};
