
import { User } from "../types";
import { useAuth } from "@/contexts/AuthContext";

export const users: User[] = [
  {
    id: "user-1",
    name: "Dr. Elena Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Professor of Molecular Biology with a focus on CRISPR gene editing technologies",
    institution: "University of Science & Technology",
    role: "researcher",
    papers: ["paper-1", "paper-3"],
    reviews: ["review-2", "review-4"],
    tokens: 1250,
    wallet: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
  },
  {
    id: "user-2",
    name: "Dr. Marcus Chen",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Quantum Computing Specialist with publications in quantum supremacy and error correction",
    institution: "National Institute of Advanced Research",
    role: "researcher",
    papers: ["paper-2"],
    reviews: ["review-1", "review-3"],
    tokens: 850,
    wallet: "0x1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0"
  },
  {
    id: "user-3",
    name: "Dr. Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Environmental Researcher with focus on climate change adaptation strategies",
    institution: "Global Climate Research Center",
    role: "reviewer",
    papers: ["paper-4"],
    reviews: ["review-5"],
    tokens: 720,
    wallet: "0xAbCdEf123456789AbCdEf123456789AbCdEf1234"
  },
  {
    id: "user-4",
    name: "Prof. David Williams",
    avatar: "https://i.pravatar.cc/150?img=7",
    bio: "Theoretical Physicist specializing in string theory and multidimensional spaces",
    institution: "Institute of Advanced Theoretical Studies",
    role: "editor",
    papers: [],
    reviews: ["review-6", "review-7"],
    tokens: 1500,
    wallet: "0x9876543210AbCdEf9876543210AbCdEf98765432"
  }
];

// This is now a hook that gets the current user from the auth context
// or falls back to the mock data for development
export const getCurrentUser = () => {
  try {
    const { user, profile } = useAuth();
    
    if (user && profile) {
      return {
        id: user.id,
        name: profile.full_name || user.email?.split('@')[0] || "User",
        avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}`,
        bio: profile.bio || "",
        institution: profile.institution || "",
        role: profile.role || "researcher",
        papers: [],
        reviews: [],
        tokens: profile.tokens || 0,
        wallet: profile.wallet_address || ""
      } as User;
    }
    
    // Fallback to mock data for development
    return users[0];
  } catch (error) {
    // If not within the auth context, return mock data
    return users[0];
  }
};

export const getUserById = (id: string) => {
  return users.find(user => user.id === id);
};
