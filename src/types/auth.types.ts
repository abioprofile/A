// Authentication types based on API response

export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: string;
  createdAt: string;
  updatedAt: string;
  profile: UserProfile; // Backend should always return this for consistency
}

// Temporary type for login response if backend doesn't return profile yet
// TODO: Remove this once backend is updated to return profile in login response
export interface UserWithoutProfile extends Omit<User, 'profile'> {
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  goals: string[];
  avatarUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  statusCode: number;
}

// Sign-in response structure (token is in data.token, user is in data.user)
export interface SignInResponse {
  success: boolean;
  message: string;
  data: {
    user: UserWithoutProfile; // User without profile
    token: string; // Token is here
  };
  statusCode: number;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Link type for profile links
export interface ProfileLink {
  id: string;
  profileId: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

// getting all links 
export interface AllLinksResponse {
  success: boolean,
  message: string,
  data: ProfileLink[],
  statusCode: number
}

// Profile with links (returned from update profile endpoint)
export interface ProfileWithLinks extends UserProfile {
  links: ProfileLink[];
}

// Update profile request
export interface UpdateProfileRequest {
  username?: string;
  displayName?: string | null;
  bio?: string | null;
  location?: string | null;
  goals?: string[];
}

// Update profile response
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: ProfileWithLinks;
  statusCode: number;
}

export interface AddLinksRequest {
  title: string;
  url: string;
  platform: string;
}
