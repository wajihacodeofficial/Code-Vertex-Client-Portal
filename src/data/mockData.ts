export interface ChangeRequest {
  id: string;
  title: string;
  description: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  cost: number;
  timelineImpactDays: number;
  submittedAt: string;
}

export interface Scope {
  version: string;
  isApproved: boolean;
  included: string[];
  excluded: string[];
  approvedAt?: string;
}

export interface Financials {
  totalBudget: number;
  paidAmount: number;
  remainingBalance: number;
  paymentMilestones: { name: string; amount: number; dueDate: string; status: 'Paid' | 'Pending' | 'Overdue', condition: string }[];
}

export interface Project {
  id: string;
  name: string;
  type: 'Web App' | 'Mobile' | 'API' | 'Design';
  pm: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Blocked' | 'Completed' | 'On Hold';
  deadline: string;
  description: string;
  techStack: string[];
  team: { name: string; role: string; avatar: string }[];
  scope?: Scope;
  changeRequests?: ChangeRequest[];
  financials?: Financials;
}

export const projects: Project[] = [
  {
    id: '1',
    name: 'E-Commerce Platform',
    type: 'Web App',
    pm: 'Wajiha Zehra',
    progress: 65,
    status: 'In Progress',
    deadline: 'May 15, 2026',
    description: 'A full-scale e-commerce solution with multi-vendor support.',
    techStack: ['Next.js', 'PostgreSQL', 'Stripe'],
    team: [{ name: 'PM', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=pm' }]
  },
  {
    id: '2',
    name: 'Mobile Banking App',
    type: 'Mobile',
    pm: 'Wajiha Zehra',
    progress: 45,
    status: 'Review',
    deadline: 'June 30, 2026',
    description: 'Secure and high-performance banking app for iOS/Android.',
    techStack: ['React Native', 'Kotlin', 'Swift'],
    team: [{ name: 'Lead Dev', role: 'Lead Developer', avatar: 'https://i.pravatar.cc/150?u=dev' }]
  }
];

export interface Invoice {
  id: string;
  project: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Draft';
}

export const invoices: Invoice[] = [
  {
    id: 'CV-10042',
    project: 'E-Commerce Platform',
    issueDate: 'Mar 15, 2026',
    dueDate: 'Apr 15, 2026',
    amount: 15400,
    status: 'Paid'
  },
  {
    id: 'CV-10058',
    project: 'E-Commerce Platform',
    issueDate: 'Apr 01, 2026',
    dueDate: 'Apr 15, 2026',
    amount: 8200,
    status: 'Unpaid'
  }
];

export interface Ticket {
  id: string;
  subject: string;
  project: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  created: string;
}

export const tickets: Ticket[] = [
  {
    id: 'T-852',
    subject: 'Stripe API Webhook Failing',
    project: 'E-Commerce Platform',
    priority: 'Critical',
    status: 'Open',
    created: '2 hours ago'
  }
];

export const activityFeed: any[] = [
  { id: 1, type: 'message', content: 'New message from Project Manager', time: '10 mins ago' },
  { id: 2, type: 'file', content: 'Design assets updated', time: '1 hour ago' }
];

export const notifications: any[] = [
  { id: 1, type: 'message', message: 'PM sent a message', time: '10 mins ago', read: false },
  { id: 2, type: 'invoice', message: 'New invoice generated', time: '1 hour ago', read: false }
];
