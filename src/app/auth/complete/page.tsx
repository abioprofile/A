"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { FaInstagram, FaTiktok, FaPinterest, FaTwitter, FaCopy, FaWhatsapp, FaXTwitter, FaFacebook, FaSnapchat, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

interface UserProfileData {
  id: string;
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  location: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  links: UserLink[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: UserProfileData;
  statusCode: number;
}

interface UserData {
  username?: string;
  displayName?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  links?: UserLink[];
}

// Fallback function if the API import fails
const fallbackGetUserProfile = async (username: string, headers: Record<string, string> = {}) => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const response = await fetch(`${baseURL}/user/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fallback API call failed:', error);
    throw error;
  }
};

export default function ProfileLivePage() {
  const router = useRouter();
  const { getUserData, user, token } = useAuth();
  const [userData, setUserData] = useState<UserData>({});
  const [showShareBox, setShowShareBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch user data from backend
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      setApiError(null);

      const cachedData = getUserData();
      const username = cachedData.username || user?.name;

      if (!username) {
        setError("Username not found");
        setLoading(false);
        return;
      }

      // Create headers with authentication
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log("Fetching profile for username:", username);

      let response;
      
      try {
        // import and use the API function dynamically
        const apiModule = await import("@/lib/auth");
        if (apiModule.getUserProfile) {
          response = await apiModule.getUserProfile(username, headers) as ApiResponse;
        } else {
          throw new Error("getUserProfile function not found in API module");
        }
      } catch (importError) {
        console.error("API import failed, using fallback:", importError);
        setApiError("Using fallback API method");
        response = await fallbackGetUserProfile(username, headers) as ApiResponse;
      }

      console.log("API Response:", response);

      if (response.success && response.data) {
        const profileData = response.data;
        
        // Transform the backend data to match our frontend interface
        const backendUserData: UserData = {
          username: profileData.username,
          displayName: profileData.displayName || undefined,
          bio: profileData.bio || undefined,
          location: profileData.location || undefined,
          avatarUrl: profileData.avatarUrl || undefined,
          links: profileData.links || [],
        };

        console.log("Transformed user data:", backendUserData);
        setUserData(backendUserData);
      } else {
        throw new Error(response.message || "Failed to load profile");
      }

    } catch (err: any) {
      console.error("Error fetching user data:", err);
      const errorMessage = err?.message || err?.response?.data?.message || "Failed to load profile data";
      setError(errorMessage);
      
      // Fallback to cached data
      const cachedData = getUserData();
      console.log("Falling back to cached data:", cachedData);
      setUserData(cachedData);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Refresh data when token changes
  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const platformIcons: Record<string, JSX.Element> = {
    INSTAGRAM: <FaInstagram className="w-4 h-4" />,
    TIKTOK: <FaTiktok className="w-4 h-4" />,
    PINTEREST: <FaPinterest className="w-4 h-4" />,
    TWITTER: <FaTwitter className="w-4 h-4" />,
    FACEBOOK: <FaFacebook className="w-4 h-4" />,
    SNAPCHAT: <FaSnapchat className="w-4 h-4" />,
    YOUTUBE: <FaYoutube className="w-4 h-4" />,
    WHATSAPP: <FaWhatsapp className="w-4 h-4" />,
    X: <FaXTwitter className="w-4 h-4" />,
    snapchat: <FaSnapchat className="w-4 h-4" />,
    facebook: <FaFacebook className="w-4 h-4" />,
    youtube: <FaYoutube className="w-4 h-4" />,
    instagram: <FaInstagram className="w-4 h-4" />,
    tiktok: <FaTiktok className="w-4 h-4" />,
    twitter: <FaTwitter className="w-4 h-4" />,
  };

  const getPlatformIcon = (platform: string) => {
    const normalizedPlatform = platform.toUpperCase();
    return platformIcons[normalizedPlatform] || platformIcons[platform.toLowerCase()] || <FaCopy className="w-4 h-4" />;
  };

  const profileLink = userData.username ? `abio.site/${userData.username}` : "abio.site/profile";

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(profileLink);
    const shareText = encodeURIComponent(`Check out my Abio profile!`);

    const shareUrls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      copy: profileLink,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(profileLink);
        alert('Profile link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        const textArea = document.createElement('textarea');
        textArea.value = profileLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Profile link copied to clipboard!');
      }
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  const handleRetry = () => {
    fetchUserData();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#331400] mx-auto mb-4"></div>
          <p className="text-[#331400]">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error && !userData.username && !userData.displayName) {
    return (
      <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleRetry}
              className="bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5]"
            >
              Retry
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E]"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF4E8] flex flex-col items-center justify-center px-6 py-10 overflow-hidden relative">
      {apiError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-md">
          <span className="block sm:inline">{apiError}</span>
          <button 
            onClick={() => setApiError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}
      
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded z-50 max-w-md">
          <span className="block sm:inline">Note: {error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}
      
      <div className="flex flex-col-reverse lg:flex-row items-center justify-center w-full max-w-6xl gap-16 relative z-10">
        {/* Left Side — Profile Preview */}
        <div className="relative w-full max-w-sm flex justify-center items-center lg:mr-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block w-[450px] h-[450px] bg-[#331400] rounded-full" />

          <Card className="relative bg-white border-[6px] border-black md:border-none overflow-hidden shadow-md z-10 w-3/4">
            <div className="p-6 flex flex-col items-start">
              {/* Profile Info */}
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-16 h-16 shadow-md">
                  <AvatarImage
                    src={userData.avatarUrl || "/avatar-placeholder.png"}
                    alt={userData.displayName || userData.username || "Profile"}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {(userData.displayName || userData.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="font-bold text-[14px] text-[#2C1C0D]">
                    {userData.displayName || userData.username || "User"}
                  </h2>
                  <p className="text-[10px] text-[#5C4C3B] mb-1">
                    @{userData.username || "username"}
                  </p>
                </div>
              </div>

              {/* Bio + Location */}
              <div className="w-full text-left">
                <p className="text-[11px] text-[#3A2B20] mb-3">{userData.bio || "No bio added yet."}</p>
                {userData.location && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 border border-[#C8C0B5] text-xs text-[#5C4C3B] mb-6">
                    <FaMapMarkerAlt className="w-3 h-3" />
                    <span>{userData.location}</span>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="bg-[#F5F5F5] p-4 w-full space-y-4">
                {userData.links && userData.links.length > 0 ? (
                  userData.links
                    .filter(link => link.isVisible !== false)
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white px-3 py-2 font-medium text-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded"
                    >
                      {getPlatformIcon(link.platform)}
                      <span className="truncate">{link.title}</span>
                    </a>
                  ))
                ) : (
                  <p className="text-[11px] text-[#3A2B20] text-center">No links added yet.</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side — Share Section */}
        <div className="flex flex-col justify-center items-start text-left max-w-md">
          <h1 className="text-3xl font-bold text-[#331400] mb-3">
            Your profile is now live!
          </h1>
          <p className="text-[#4B2E1E] mb-6">
            Get more visitors by sharing your Abio Profile everywhere.
          </p>

          <div className="hidden md:flex items-center w-full border border-[#C8C0B5] overflow-hidden mb-6 rounded">
            <input
              readOnly
              value={profileLink}
              className="border-0 w-full text-[#4B2E1E] font-medium bg-transparent px-3 py-2 focus-visible:ring-0"
            />
            <button
              className="p-3 bg-transparent hover:bg-[#FFF1D0] transition-colors"
              onClick={() => handleShare('copy')}
            >
              <FaCopy className="w-4 h-4 text-[#4B2E1E]" />
            </button>
          </div>

          <div className="hidden md:flex w-full gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5 transition-colors"
            >
              Continue Editing
            </Button>
            <Button
              onClick={() => setShowShareBox(true)}
              className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5 transition-colors"
            >
              Share your Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Buttons */}
      <div className="fixed bottom-0 left-0 w-full flex md:hidden gap-3 bg-white p-4 border-t border-gray-200 shadow-md">
        <Button
          onClick={() => router.push("/dashboard")}
          className="flex-1 bg-[#FED45C] hover:bg-[#f5ca4f] text-[#4B2E1E] font-semibold py-5 transition-colors"
        >
          Continue Editing
        </Button>
        <Button
          onClick={() => setShowShareBox(true)}
          className="flex-1 bg-[#331400] hover:bg-[#4B2E1E] text-[#FFE4A5] font-semibold py-5 transition-colors"
        >
          Share
        </Button>
      </div>

      {/* Slide-Up Share Box */}
      <AnimatePresence>
        {showShareBox && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg p-6 z-50 md:hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#331400]">Share your Abio</h3>
              <button
                onClick={() => setShowShareBox(false)}
                className="text-[#331400] font-bold text-xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <button
                onClick={() => handleShare('copy')}
                className="flex flex-col items-center text-[#4B2E1E] p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaCopy className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">Copy Link</span>
              </button>

              <button 
                onClick={() => handleShare('whatsapp')}
                className="flex flex-col items-center text-green-600 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaWhatsapp className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>

              <button 
                onClick={() => handleShare('twitter')}
                className="flex flex-col items-center text-black p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaXTwitter className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">X</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}