// TypeScript interfaces for Django REST API data structures

export interface ProfileImage {
  image_url: string;
  caption?: string;
}

export interface University {
  id: number
  name: string
  established: number
  location: string
  motto: string
  description: string
  vision: string
  mission: string
  image: string
}

export interface UniversityStats {
  students: number
  faculty: number
  departments: number
  alumni: number
  programs: number
  research_projects: number
}

export interface Achievement {
  id: number
  title: string
  year: number
  description: string
  category: string
}

export interface Department {
  id: number
  name: string
  code: string
  description: string
  head: string
  faculty_count: number
  student_count: number
  programs: string[]
  achievements: string[]
  image: string
  established: number
}

export interface Student {
  id: number;
  name: string;
  department_name: string;
  photo_url: string;
  quote: string;
  last_words: string;
  highlight_tagline: string;
  description: string;
  is_featured: boolean;
  department: number; // This is the department ID
  created_at: string;
  updated_at: string;
  my_story?: string;
  profile_images?: ProfileImage[];
}

export interface TraineeSuccessStory {
  id: number;
  name: string;
  graduation_year: number;
  department_name: string;
  current_position: string;
  achievement: string;
  photo_url: string;
  bio: string;
  department: number; // This is the department ID
  created_at: string;
  my_story?: string;
  project_showcase?: string;
  skills_acquired?: string;
  profile_images?: ProfileImage[];
}

export interface AlumniStats {
  total_alumni: number
  countries: number
  companies_founded: number
  patents_filed: number
}

export interface FacultyTribute {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  message: string;
  order?: number;
  department_name?: string;
  years_of_service?: number;
  specialization?: string;
}

export interface DirectorGeneralMessage {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  speech: string;
  created_at: string;
}

export interface CyberTalentDirectorMessage {
  id: number;
  name: string;
  position: string;
  photo_url: string;
  speech: string;
  created_at: string;
}

export interface Memory { // For MemoryBoard
  id: number;
  title: string;
  caption: string;
  author_name?: string;
  author_program?: string;
  author_year?: string;
  created_at: string;
  memory_type: string;
  photo_url?: string;
  department?: number; // This is the department ID
  department_name?: string;
}

export interface MemoryComment {
  id: number
  memory: number
  content: string
  author: string
  date_posted: string
}

export interface HeroData {
  title: string
  subtitle: string
  description: string
  background_image: string
  cta_primary: string
  cta_secondary: string
}

export interface NavigationItem {
  id: number
  title: string
  href: string
  order: number
  is_active: boolean
}

// API Response types
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface APIError {
  detail: string
  code?: string
}

// Form types
export interface ContactFormData {
  name: string
  email: string
  message: string
}

export interface MemoryFormData {
  title: string
  content: string
  category: string
  author: string
  author_program: string
  author_year: string
  image?: File
}

export interface TributeFormData {
  faculty_name: string
  department: string
  tribute_text: string
  submitted_by: string
}

// Filter types
export interface StudentFilters {
  department_name?: string; // Changed from program
  year?: string;
  search?: string;
  page?: number;
}

export interface AlumniFilters {
  department_name?: string; // Added to reflect change from program
  graduation_year?: string;
  // industry?: string; // Removed
  // location?: string; // Removed
  search?: string;
  page?: number;
}

export interface MemoryFilters {
  memory_type?: string; // Changed from category
  year?: string;
  search?: string;
  page?: number;
}
