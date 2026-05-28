export interface BibleVerse {
  address: string;
  text: string;
}

export interface PainPoint {
  title: string;
  category: string;
  description: string;
  biblicalRoot: string;
  bibleVerses: string[];
}

export interface ProactivePrevention {
  title: string;
  actionPlan: string;
  ghanaianContextNote: string;
}

export interface ManagementStrategy {
  situation: string;
  mentorResponse: string;
  keyPrinciple: string;
}

export interface AssessmentResult {
  developmentalStage: string;
  painPoints: PainPoint[];
  proactivePrevention: ProactivePrevention[];
  managementStrategies: ManagementStrategy[];
  isFallbackMode?: boolean;
  errorInfo?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isSpeaking?: boolean;
  sources?: { title: string; url: string }[];
}

export interface ForumPost {
  id: string;
  title: string;
  author: string;
  role: "Parent" | "Youth Guide" | "Teen Coach" | "Mentor" | "School Counselor";
  region: string;
  content: string;
  verses: string[];
  likes: number;
  hasLiked?: boolean;
  replies: ForumReply[];
  timestamp: string;
  category: "Boarding School" | "Social Media" | "Discipline" | "Spiritual Growth";
}

export interface ForumReply {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
}
