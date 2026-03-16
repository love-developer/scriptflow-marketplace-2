import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types ---
export type Role = 'guest' | 'buyer' | 'seller' | 'admin';
export type Level = 'New Creator' | 'Rising Builder' | 'Pro Architect' | 'Elite Innovator' | 'Legendary Creator';

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  avatar?: string;
  bio?: string;
  level: Level;
  joinDate: string;
  sales: number;
  banned?: boolean;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sellerId: string;
  sellerName: string;
  sellerLevel: Level;
  rating: number;
  testCount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  image: string;
  tags: string[];
  type: 'ai_workflow' | 'roblox_script';
  createdAt: string;
}

export interface Purchase {
  id: string;
  userId: string;
  itemId: string;
  itemTitle: string;
  price: number;
  date: string;
  type: 'ai_workflow' | 'roblox_script';
}

export interface TicketReply {
  id: string;
  ticketId: string;
  from: 'user' | 'admin';
  message: string;
  date: string;
  senderName?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  date: string;
  replies: TicketReply[];
}

export interface SellerRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewMessage?: string;
}

// --- Mock Data ---
const MOCK_USERS: User[] = [
  { id: 'u1', email: 'admin@marketplace.com', username: 'AdminMaster', role: 'admin', level: 'Legendary Creator', joinDate: '2023-01-01', sales: 0, bio: 'Platform administrator.' },
  { id: 'u2', email: 'seller@marketplace.com', username: 'PixelArchitect', role: 'seller', level: 'Pro Architect', joinDate: '2023-06-15', sales: 150, bio: 'ComfyUI specialist creating high-quality AI art workflows. 3 years in generative AI.' },
  { id: 'u3', email: 'buyer@marketplace.com', username: 'CreativeMind', role: 'buyer', level: 'New Creator', joinDate: '2024-02-10', sales: 0, bio: 'Digital artist and AI enthusiast.' },
  { id: 'u4', email: 'studio@marketplace.com', username: 'StudioAI', role: 'seller', level: 'Elite Innovator', joinDate: '2023-03-20', sales: 320, bio: 'Professional studio producing top-tier AI workflows for e-commerce and photography.' },
  { id: 'u5', email: 'ninja@marketplace.com', username: 'ScriptNinja', role: 'seller', level: 'Rising Builder', joinDate: '2023-09-10', sales: 45, bio: 'Roblox scripter with expertise in automation and game hacks.' },
  { id: 'u6', email: 'gamer@marketplace.com', username: 'GamerXX', role: 'buyer', level: 'New Creator', joinDate: '2024-01-05', sales: 0 },
];

const MOCK_ITEMS: Workflow[] = [
  { id: 'w1', title: 'Portrait Enhancer Pro v2.0', description: 'Advanced ComfyUI workflow for generating highly detailed, photorealistic portraits with dynamic lighting. Supports ControlNet and LoRA.', price: 29.99, category: 'Photography', sellerId: 'u2', sellerName: 'PixelArchitect', sellerLevel: 'Pro Architect', rating: 4.8, testCount: 1240, status: 'Approved', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80', tags: ['portrait', 'photorealism', 'comfyui'], type: 'ai_workflow', createdAt: '2024-01-15' },
  { id: 'w2', title: 'Anime Style Transfer', description: 'Convert any photo into high-quality anime style with this optimized workflow. Fast and reliable, works with any base model.', price: 15.00, category: 'Stylization', sellerId: 'u2', sellerName: 'PixelArchitect', sellerLevel: 'Pro Architect', rating: 4.9, testCount: 3500, status: 'Approved', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80', tags: ['anime', 'transfer', 'fast'], type: 'ai_workflow', createdAt: '2024-02-01' },
  { id: 'w3', title: 'Product Photography Studio', description: 'Generate studio-quality product backgrounds from flat product images. Perfect for e-commerce stores and Amazon listings.', price: 49.00, category: 'E-commerce', sellerId: 'u4', sellerName: 'StudioAI', sellerLevel: 'Elite Innovator', rating: 5.0, testCount: 890, status: 'Approved', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', tags: ['product', 'studio', 'ecommerce'], type: 'ai_workflow', createdAt: '2024-02-20' },
  { id: 'w4', title: 'Fantasy Landscape Generator', description: 'Create stunning fantasy landscapes with epic lighting, detailed environments and cinematic composition.', price: 24.99, category: 'Art', sellerId: 'u4', sellerName: 'StudioAI', sellerLevel: 'Elite Innovator', rating: 4.7, testCount: 2100, status: 'Approved', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80', tags: ['fantasy', 'landscape', 'art'], type: 'ai_workflow', createdAt: '2024-02-25' },
  { id: 'w5', title: 'Realistic Upscaler 4x', description: 'Upscale any image to 4x resolution with minimal artifacts. Optimized for faces and detailed textures.', price: 19.99, category: 'Upscaling', sellerId: 'u2', sellerName: 'PixelArchitect', sellerLevel: 'Pro Architect', rating: 4.6, testCount: 5400, status: 'Approved', image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&q=80', tags: ['upscale', '4k', 'resolution'], type: 'ai_workflow', createdAt: '2024-03-01' },
  { id: 'w6', title: 'Logo & Brand Design AI', description: 'Generate professional logo concepts and brand assets from a simple text description. SVG-ready output.', price: 39.99, category: 'Design', sellerId: 'u4', sellerName: 'StudioAI', sellerLevel: 'Elite Innovator', rating: 4.5, testCount: 780, status: 'Approved', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', tags: ['logo', 'branding', 'design'], type: 'ai_workflow', createdAt: '2024-03-05' },
  { id: 'w7', title: 'Cinematic Video Frame Enhancer', description: 'Enhance video frames to cinematic quality using AI. Add film grain, color grading, and sharpening.', price: 34.99, category: 'Video', sellerId: 'u2', sellerName: 'PixelArchitect', sellerLevel: 'Pro Architect', rating: 4.4, testCount: 320, status: 'Pending', image: 'https://images.unsplash.com/photo-1536240478700-b869ad10a2eb?w=800&q=80', tags: ['video', 'cinematic', 'grading'], type: 'ai_workflow', createdAt: '2024-03-10' },
  { id: 'w8', title: '3D Object Concept Renderer', description: 'Turn sketch descriptions into 3D-rendered product concepts. Ideal for industrial and furniture design.', price: 44.99, category: '3D', sellerId: 'u4', sellerName: 'StudioAI', sellerLevel: 'Elite Innovator', rating: 4.8, testCount: 430, status: 'Approved', image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80', tags: ['3d', 'concept', 'render'], type: 'ai_workflow', createdAt: '2024-03-12' },
  { id: 's1', title: 'Auto Farm Pro Simulator', description: 'Highly optimized auto farm script for popular simulators. Undetected and frequently updated for all major patches.', price: 9.99, category: 'Farming', sellerId: 'u5', sellerName: 'ScriptNinja', sellerLevel: 'Rising Builder', rating: 4.5, testCount: 500, status: 'Approved', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', tags: ['autofarm', 'simulator'], type: 'roblox_script', createdAt: '2024-03-01' },
  { id: 's2', title: 'ESP & Wallhack Toolkit', description: 'Clean visual ESP with customizable colors. Safe for most major games with anti-cheat bypass. Monthly sub available.', price: 14.99, category: 'Visuals', sellerId: 'u5', sellerName: 'ScriptNinja', sellerLevel: 'Rising Builder', rating: 4.2, testCount: 2100, status: 'Approved', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', tags: ['esp', 'visuals', 'competitive'], type: 'roblox_script', createdAt: '2024-03-10' },
  { id: 's3', title: 'Infinite Jump & Speed Hack', description: 'Smooth infinite jump + speed multiplier. Easy to configure, works across 95% of Roblox games.', price: 7.99, category: 'Movement', sellerId: 'u5', sellerName: 'ScriptNinja', sellerLevel: 'Rising Builder', rating: 4.3, testCount: 3800, status: 'Approved', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80', tags: ['jump', 'speed', 'movement'], type: 'roblox_script', createdAt: '2024-03-15' },
  { id: 's4', title: 'Auto Collect & Coin Farmer', description: 'Automatically collect coins, gems and rewards in any Roblox idle/farming game. Configurable radius.', price: 5.99, category: 'Farming', sellerId: 'u5', sellerName: 'ScriptNinja', sellerLevel: 'Rising Builder', rating: 4.0, testCount: 1200, status: 'Approved', image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80', tags: ['collect', 'coins', 'idle'], type: 'roblox_script', createdAt: '2024-03-20' },
];

// --- Store Definition ---
interface AppState {
  currentUser: User | null;
  users: User[];
  items: Workflow[];
  purchases: Purchase[];
  tickets: Ticket[];
  sellerRequests: SellerRequest[];
  
  // Actions
  login: (email: string, pass: string) => void;
  register: (email: string, pass: string, username: string, role: Role) => void;
  logout: () => void;
  
  buyItem: (itemId: string) => void;
  createTicket: (subject: string, message: string) => void;
  uploadItem: (item: Omit<Workflow, 'id' | 'sellerId' | 'sellerName' | 'sellerLevel' | 'rating' | 'testCount' | 'createdAt'>) => void;
  requestSellerStatus: (message: string) => void;
  
  // Support Actions
  addTicketReply: (ticketId: string, message: string, from: 'user' | 'admin') => void;
  updateTicketStatus: (ticketId: string, status: Ticket['status']) => void;
  
  // Admin Actions
  updateItemStatus: (id: string, status: Workflow['status']) => void;
  updateUserRole: (id: string, role: Role) => void;
  deleteItem: (id: string) => void;
  approveSellerRequest: (requestId: string, approved: boolean, reviewMessage?: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: MOCK_USERS,
      items: MOCK_ITEMS,
      purchases: [],
      tickets: [],
      sellerRequests: [],

      login: (email) => {
        const user = get().users.find(u => u.email === email);
        if (user) set({ currentUser: user });
        else throw new Error("Invalid credentials");
      },

      register: (email, _, username, role) => {
        const newUser: User = {
          id: `u${Date.now()}`,
          email,
          username,
          role,
          level: 'New Creator',
          joinDate: new Date().toISOString().split('T')[0],
          sales: 0
        };
        set((state) => ({ 
          users: [...state.users, newUser],
          currentUser: newUser
        }));
      },

      logout: () => set({ currentUser: null }),

      buyItem: (itemId) => {
        const state = get();
        const user = state.currentUser;
        const item = state.items.find(i => i.id === itemId);
        if (!user || !item) return;

        const purchase: Purchase = {
          id: `p${Date.now()}`,
          userId: user.id,
          itemId: item.id,
          itemTitle: item.title,
          price: item.price,
          date: new Date().toISOString(),
          type: item.type
        };
        set({ purchases: [purchase, ...state.purchases] });
      },

      createTicket: (subject, message) => {
        const user = get().currentUser;
        if (!user) return;
        const ticket: Ticket = {
          id: `t${Date.now()}`,
          userId: user.id,
          subject,
          message,
          status: 'Open',
          date: new Date().toISOString(),
          replies: []
        };
        set(state => ({ tickets: [ticket, ...state.tickets] }));
      },

      addTicketReply: (ticketId, message, from) => {
        const state = get();
        const user = state.currentUser;
        if (!user) return;
        
        const reply: TicketReply = {
          id: `r${Date.now()}`,
          ticketId,
          from,
          message,
          date: new Date().toISOString(),
          senderName: user.username
        };
        
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id === ticketId 
              ? { 
                  ...ticket, 
                  replies: [...(ticket.replies || []), reply],
                  status: from === 'admin' ? 'In Progress' : ticket.status
                }
              : ticket
          )
        }));
      },

      updateTicketStatus: (ticketId, status) => {
        set(state => ({
          tickets: state.tickets.map(ticket => 
            ticket.id === ticketId ? { ...ticket, status, replies: ticket.replies || [] } : ticket
          )
        }));
      },

      uploadItem: (itemData) => {
        const user = get().currentUser;
        if (!user || user.role !== 'seller') return;

        const newItem: Workflow = {
          ...itemData,
          id: `w${Date.now()}`,
          sellerId: user.id,
          sellerName: user.username,
          sellerLevel: user.level,
          rating: 0,
          testCount: 0,
          createdAt: new Date().toISOString()
        };
        set(state => ({ items: [newItem, ...state.items] }));
      },

      updateItemStatus: (id, status) => {
        set(state => ({
          items: state.items.map(i => i.id === id ? { ...i, status } : i)
        }));
      },

      updateUserRole: (id, role) => {
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, role } : u)
        }));
      },

      deleteItem: (id) => {
        set(state => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },

      requestSellerStatus: (message) => {
        const user = get().currentUser;
        if (!user) return;

        const request: SellerRequest = {
          id: `sr${Date.now()}`,
          userId: user.id,
          username: user.username,
          email: user.email,
          message,
          status: 'Pending',
          date: new Date().toISOString()
        };

        set(state => ({ sellerRequests: [request, ...state.sellerRequests] }));
      },

      approveSellerRequest: (requestId, approved, reviewMessage) => {
        const state = get();
        const request = state.sellerRequests.find(r => r.id === requestId);
        if (!request) return;

        // Update the request
        set(state => ({
          sellerRequests: state.sellerRequests.map(r => 
            r.id === requestId 
              ? { 
                  ...r, 
                  status: approved ? 'Approved' : 'Rejected',
                  reviewedBy: state.currentUser?.username,
                  reviewedAt: new Date().toISOString(),
                  reviewMessage
                }
              : r
          )
        }));

        // If approved, update user role
        if (approved) {
          set(state => ({
            users: state.users.map(u => 
              u.id === request.userId ? { ...u, role: 'seller' as Role } : u
            )
          }));
        }
      }
    }),
    {
      name: 'marketplace-storage',
    }
  )
);
