// -------------------------------------------
// API functions to connect with Django REST API
// -------------------------------------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://172.27.12.216:8000/yearbook/api";

// -------------------------------------------
// Generic API function
// -------------------------------------------
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Ensure endpoint always starts with single slash
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// -------------------------------------------
// About / University Info (mapped to "about")
// -------------------------------------------
export async function getUniversityInfo() {
  return apiRequest("/about/");
}

// -------------------------------------------
// Departments API calls
// -------------------------------------------
export async function getDepartments() {
  return apiRequest("/departments/");
}

export async function getDepartmentById(id: number) {
  return apiRequest(`/departments/${id}/`);
}

// -------------------------------------------
// Students API calls
// -------------------------------------------
export async function getStudents(params?: {
  department?: number;
  search?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return apiRequest(`/students/${queryString ? `?${queryString}` : ""}`);
}

export async function getStudentById(id: number) {
  return apiRequest(`/students/${id}/`);
}

// -------------------------------------------
// Faculty Tributes API calls (mapped to "faculty")
// -------------------------------------------
export async function getFacultyTributes() {
  return apiRequest("/faculty/");
}

export async function submitFacultyTribute(tribute: {
  faculty_name: string;
  department: string;
  tribute_text: string;
  submitted_by: string;
}) {
  return apiRequest("/faculty/", {
    method: "POST",
    body: JSON.stringify(tribute),
  });
}

// -------------------------------------------
// Memory Board API calls
// -------------------------------------------
export async function getMemories(params?: {
  memory_type?: string;
  department?: number;
  search?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const queryString = searchParams.toString();
  return apiRequest(`/memories/${queryString ? `?${queryString}` : ""}`);
}

// -------------------------------------------
// Extra available backend routes (optional)
// -------------------------------------------

// Director General message
export async function getDirectorGeneralMessages() {
  return apiRequest("/director-general/");
}

// Cyber Talent Director message
export async function getCyberTalentDirectorMessages() {
  return apiRequest("/cyber-talent-director/");
}

// Trainee Success Stories
export async function getTrainees() {
  return apiRequest("/trainees/");
}

// Leadership info
export async function getLeadership() {
  return apiRequest("/leadership/");
}