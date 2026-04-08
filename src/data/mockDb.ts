// Mock Database representing Multi-Tenant Architecture
// Each record is isolated by `clientId`

export interface Client {
  id: string;
  name: string;
  companyName: string;
  tier: 'Standard' | 'Enterprise';
  status: 'Active' | 'Inactive';
}

export interface Project {
  id: string;
  clientId: string;
  title: string;
  status: 'In Progress' | 'Review' | 'Completed';
  progress: number;
  techStack: string[];
}

export interface Task {
  id: string;
  projectId: string; // Resolves transitively to clientId
  title: string;
  isInternal: boolean; // If true, NOT visible to Client
  status: 'Todo' | 'In Progress' | 'Done';
}

export const mockDb = {
  clients: [
    { id: 'client_1', name: 'Wajiha Zehra', companyName: 'Nexus Tech', tier: 'Enterprise', status: 'Active' },
    { id: 'client_2', name: 'John Doe', companyName: 'Acme Corp', tier: 'Standard', status: 'Active' },
  ],
  
  projects: [
    { id: 'proj_1', clientId: 'client_1', title: 'E-Commerce Platform', status: 'In Progress', progress: 65, techStack: ['React', 'Node.js', 'PostgreSQL'] },
    { id: 'proj_2', clientId: 'client_1', title: 'Admin Dashboard', status: 'Review', progress: 95, techStack: ['React', 'Tailwind'] },
    { id: 'proj_3', clientId: 'client_2', title: 'Marketing Website', status: 'Completed', progress: 100, techStack: ['Webflow'] },
  ],

  tasks: [
    { id: 'task_1', projectId: 'proj_1', title: 'Setup Authentication', isInternal: false, status: 'Done' },
    { id: 'task_2', projectId: 'proj_1', title: 'DB Schema Optimization (Internal)', isInternal: true, status: 'In Progress' },
    { id: 'task_3', projectId: 'proj_2', title: 'Deploy to Vercel', isInternal: false, status: 'Todo' },
  ]
};

// Simulated queries demonstrating isolation
export const getDataForClient = (clientId: string) => {
  const client = mockDb.clients.find(c => c.id === clientId);
  const projects = mockDb.projects.filter(p => p.clientId === clientId);
  
  // Clients CANNOT see internal tasks
  const tasks = mockDb.tasks.filter(t => 
    projects.map(p => p.id).includes(t.projectId) && !t.isInternal
  );

  return { client, projects, tasks };
};

export const getDataForTeam = () => {
  // Team sees EVERYTHING, including internal tasks
  return {
    clients: mockDb.clients,
    projects: mockDb.projects,
    tasks: mockDb.tasks // Can see isInternal: true
  };
};
