export type DocumentCategory =
  | 'identity'
  | 'education'
  | 'insurance'
  | 'warranty'
  | 'vehicle'
  | 'property'
  | 'medical'
  | 'financial'
  | 'other';

export type DocumentStatus = 'active' | 'expiring_soon' | 'expired' | 'verified';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  documentNumber?: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  tags: string[];
  s3Key: string;
  s3Bucket: string;
  s3Url?: string;
  fileSize: string;
  mimeType: string;
  isEncrypted: boolean;
  notes?: string;
  familySharedWith: string[]; // member IDs
  aiSummary?: string;
  aiExtractedFields?: Record<string, string>;
  status: DocumentStatus;
  createdAt: string;
  previewUrl?: string;
  isFavorite?: boolean;
}

export type SubscriptionBillingCycle = 'monthly' | 'quarterly' | 'annual' | 'biannual';
export type SubscriptionCategory = 'entertainment' | 'productivity' | 'cloud' | 'fitness' | 'utilities' | 'finance' | 'other';
export type SubscriptionStatus = 'active' | 'trial' | 'cancelled' | 'expiring_soon';

export interface SubscriptionItem {
  id: string;
  name: string;
  service: string;
  logo?: string;
  plan: string;
  billingCycle: SubscriptionBillingCycle;
  amount: number;
  currency: string;
  category: SubscriptionCategory;
  nextRenewalDate: string;
  startDate: string;
  paymentMethod: string;
  autoRenew: boolean;
  cancellationUrl?: string;
  websiteUrl?: string;
  alertDaysBefore: number;
  status: SubscriptionStatus;
  familySharedWith: string[];
  notes?: string;
}

export type PasswordCategory = 'banking' | 'social' | 'work' | 'shopping' | 'email' | 'crypto' | 'entertainment' | 'other';

export interface PasswordItem {
  id: string;
  title: string;
  username: string;
  email?: string;
  passwordEncrypted: string;
  category: PasswordCategory;
  websiteUrl?: string;
  notes?: string;
  strengthScore: number; // 0 to 100
  lastUpdated: string;
  isCompromised?: boolean;
  twoFactorKey?: string;
  familySharedWith: string[];
  isFavorite?: boolean;
}

export type BillType =
  | 'electricity'
  | 'water'
  | 'gas'
  | 'internet'
  | 'mobile'
  | 'credit_card'
  | 'rent'
  | 'maintenance'
  | 'insurance_premium'
  | 'other';

export interface BillItem {
  id: string;
  title: string;
  biller: string;
  billType: BillType;
  amount: number;
  currency: string;
  dueDate: string;
  billingPeriod: string;
  isPaid: boolean;
  paidDate?: string;
  paymentReference?: string;
  invoiceFileUrl?: string;
  invoiceNumber?: string;
  autoPay: boolean;
  remindersSet: boolean;
  notes?: string;
  category: string;
}

export interface WarrantyItem {
  id: string;
  productName: string;
  brand: string;
  modelNumber?: string;
  serialNumber?: string;
  category?: string;
  purchaseDate: string;
  warrantyPeriodMonths: number;
  expiryDate: string;
  purchasePrice?: number;
  currency: string;
  retailer?: string;
  invoiceDocId?: string;
  supportContact?: string;
  supportPhone?: string;
  supportWebsite?: string;
  coverageDetails: string;
  status: 'active' | 'expiring_soon' | 'expired';
  notes?: string;
}

export type ReminderCategory = 'expiry' | 'bill' | 'subscription' | 'medical' | 'warranty' | 'custom';
export type ReminderPriority = 'low' | 'medium' | 'high' | 'critical';
export type ReminderRepeat = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ReminderItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  isCompleted: boolean;
  repeat: ReminderRepeat;
  relatedItemId?: string;
  relatedItemType?: 'document' | 'subscription' | 'bill' | 'warranty';
  notified: boolean;
  createdAt: string;
}

export type FamilyRelationship = 'Spouse' | 'Child' | 'Parent' | 'Sibling' | 'Guardian' | 'Emergency Contact' | 'Other';
export type FamilyAccessLevel = 'viewer' | 'restricted' | 'manager';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: FamilyRelationship;
  email: string;
  phone?: string;
  avatar: string;
  accessLevel: FamilyAccessLevel;
  sharedDocumentIds: string[];
  status: 'active' | 'invited' | 'pending';
  canDownload: boolean;
  lastActive?: string;
  emergencyAccess: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  emergencyContact: string;
  googleLinked: boolean;
  twoFactorEnabled: boolean;
  masterPinSet: boolean;
  storageUsedMb: number;
  storageMaxMb: number;
  createdAt: string;
}

export interface CloudWatchLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
}

export interface CloudInfrastructure {
  ec2: {
    instanceId: string;
    instanceType: string;
    region: string;
    publicIp: string;
    privateIp: string;
    state: string;
    uptime: string;
    cpuAverage: number;
    memoryAverage: number;
    diskUsageGb: string;
  };
  s3: {
    bucketName: string;
    region: string;
    storageClass: string;
    totalObjects: number;
    totalSizeMb: number;
    encryption: string;
    versioning: string;
    crossRegionReplication: string;
  };
  rds: {
    dbInstance: string;
    engine: string;
    deployment: string;
    activeConnections: number;
    storageAllocatedGb: number;
    storageUsedGb: number;
    iops: number;
    avgQueryTimeMs: number;
    status: string;
  };
  cloudWatch: {
    status: string;
    activeAlarms: number;
    metricsMonitored: number;
    logStreams: CloudWatchLog[];
    timeSeries: Array<{
      time: string;
      cpuUtilization: number;
      memoryUtilization: number;
      s3Requests: number;
      rdsQueryLatencyMs: number;
      networkInKbps: number;
      networkOutKbps: number;
    }>;
  };
}

export interface AISmartSearchMatch {
  type: 'document' | 'subscription' | 'bill' | 'warranty' | 'password';
  id: string;
  title: string;
  reason: string;
}

export interface AISmartSearchResult {
  directAnswer: string;
  matchingItems: AISmartSearchMatch[];
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
}
