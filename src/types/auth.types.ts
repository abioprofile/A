// Authentication types based on API response

export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  isEmailVerified: boolean;
  isOnboardingCompleted?: boolean;
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
  userId: string;
  username: string | null;
  bio: string | null;
  location: string | null;
  goals?: string[];
  avatarUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  links?: ProfileLink[];
  user: {
    name: string;
  };
  display: DisplayConfig;
}

export interface DisplayConfig {
  id: string;
  userId: string;
  profileId: string;
  selected_theme: string | null;
  font_config: {
    name: string;
    fillColor: string;
  };
  corner_config: {
    type: string;
    opacity: number;
    fillColor: string;
    shadowSize: string;
    shadowColor: string;
    strokeColor: string;
  };
  wallpaper_config: {
    type: string;
    image: {
      url: string;
      publicId: string;
    };
    backgroundColor: Array<{
      color: string;
      amount: number;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
  statusCode: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
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
  icon_link?: string;
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

interface WaitlistData {
  id: string,
  email: string,
  createdAt: string,
  updatedAt: string,
  name: string
}

export interface WaitlistRequest {
  success: boolean,
  message: string,
  data: WaitlistData[],
  statusCode: number
}
