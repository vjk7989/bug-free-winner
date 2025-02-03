export interface Permission {
  moduleId: string;
  moduleName: string;
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  username: string;
  password: string;
  permissions: Permission[];
}

export interface Showing {
  id: string
  date: Date
  time: string
  property: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
  leadName?: string
  leadId?: string
}

export interface Task {
  id: string;
  title: string;
  date: string;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  property: string;
  date: string;  // ISO date string format
  notes: string;
  callHistory: Array<{
    date: string;  // ISO date string format
    duration: number;
    recording?: string;
  }>;
  propertyPreferences: {
    budget: {
      min: number;
      max: number;
    };
    propertyType: string[]; // ['detached', 'semi-detached', 'townhouse', 'condo']
    bedrooms: number;
    bathrooms: number;
    locations: string[]; // Preferred neighborhoods/cities
    features: string[]; // ['garage', 'basement', 'pool', etc]
  };
  mortgageDetails: {
    preApproved: boolean;
    lender?: string;
    preApprovalAmount?: number;
    downPayment?: number;
    mortgageType?: string; // 'fixed' | 'variable'
  };
  documents: Array<{
    type: string; // 'id', 'preApproval', 'offer', 'agreement'
    name: string;
    url: string;
    dateUploaded: string;
  }>;
  showings?: Showing[]
  offers: Array<{
    propertyAddress: string;
    offerAmount: number;
    offerDate: string;
    status: string; // 'pending', 'accepted', 'rejected', 'countered'
    conditions: string[];
    closingDate?: string;
  }>;
  tasks?: Task[];
} 