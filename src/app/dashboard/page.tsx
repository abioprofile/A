"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import SideDashboard from "@/components/SideDashboard";
import LinkList from "@/components/LinkList";
import PhoneDisplay from "@/components/PhoneDisplay";
import ButtonCustomizer from "@/components/ButtonCustomizer";
import MobileBottomNav from "@/components/MobileBottomNav";
import ProfileContent from "@/components/ProfileContent";
import { useUserProfileByUsername } from "@/hooks/api/useAuth";
import { AuthContext, User } from "@/context/AuthContext";
import { useAppSelector } from "@/stores/hooks";
import { usePhoneDisplayProps } from "@/hooks/usePhoneDisplayProps";
import { ProfileLink, UserProfile } from "@/types/auth.types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

interface UserLink {
  id: string;
  title: string;
  url: string;
  platform: string;
  displayOrder: number;
  isVisible: boolean;
}

export default function DashboardPage() {
  const { user } = useContext(AuthContext) || {};
  const userData = useAppSelector((state) => state.auth.user);

  const [displayName, setDisplayName] = useState<string>("");
  const [username, setUsername] = useState<string>("User");

  useEffect(() => {
    const getName = () => {
      if (userData?.profile?.name) return userData.profile.name;
      if (userData?.name) return userData.name;
      if (user?.name) return user.name;
      return "User";
    };
    const getUsername = () => {
      if (userData?.profile?.username) return userData.profile.username;
      if (user?.profile?.username) return (user.profile as { username?: string })?.username;
      return "User";
    };

    setDisplayName(getName());
    setUsername(getUsername());
  }, [user, userData]);

  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [bio, setBio] = useState("UI/UX Designer");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [locations, setLocations] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState("");
  const [profileImage, setProfileImage] = useState<string>(
    "/icons/Profile Picture.png"
  );

  const {
    buttonStyle,
    fontStyle,
    selectedTheme,
    profile: phoneProfile,
    links: profileLinks,
  } = usePhoneDisplayProps();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (type: string) => {
    if (type === "editLocation") {
      setTempLocation(location);
    }
    setActiveModal(type);
  };
  const closeModal = () => setActiveModal(null);

  const handleLocationSearch = async (query: string) => {
    setTempLocation(query);
    if (query.length < 2) {
      setLocations([]);
      return;
    }
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const filtered = data
        .map((country: any) => country.name.common)
        .filter((name: string) =>
          name.toLowerCase().includes(query.toLowerCase())
        )
        .sort();
      setLocations(filtered);
    } catch (error) {
      toast.error("Failed to fetch locations");
    }
  };

  const handleSaveLocation = () => {
    if (tempLocation.trim()) {
      setLocation(tempLocation);
      toast.success(`Location updated to ${tempLocation}`);
      closeModal();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      toast.success("Image uploaded successfully");
      closeModal();
    }
  };

  const handleDeleteImage = () => {
    setProfileImage("/icons/Profile Picture.png");
    toast.success("Profile image deleted");
    closeModal();
  };

  const [isMobile, setIsMobile] = useState(false);
  const [showMobileLinks, setShowMobileLinks] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handlePhoneClick = () => {
    if (!isMobile) return;
    setShowMobileLinks(true);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const slideInVariants: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const modalOverlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const modalContentVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        delay: 0.1
      }
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-[#fff]">
  //       <motion.div
  //         animate={{ rotate: 360 }}
  //         transition={{
  //           duration: 1,
  //           repeat: Infinity,
  //           ease: "linear"
  //         }}
  //         className="rounded-full h-12 w-12 border-b-2 border-[#331400]"
  //       />
  //     </div>
  //   );
  // }

  return (
    <ProtectedRoute>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex space-y-4 md:space-y-6 md:bg-[#fff]"
      >
        <main className="hidden md:block w-full md:w-[60%] space-y-4">
          <motion.h1
            variants={itemVariants}
            className="p-8 text-[30px] font-medium"
          >
            Hi, {username}
          </motion.h1>
          
          <motion.div
            variants={itemVariants}
            className="max-w-3xl flex gap-4 items-center px-8"
          >
            <div
            >
              <Image
                src={userData?.profile?.avatarUrl || "/icons/Profile Picture.png"}
                alt="Profile"
                width={80}
                height={80}
                className="object-cover w-24 h-24  rounded-full"
                
              />
            </div>

            <motion.div variants={itemVariants}>
              <div
                className="mb-1"
                
              >
                <h1 className="font-semibold text-[24px]">
                  {displayName || "User"}
                </h1>
                <p className="font-thin text-[10px] mt-2 md:text-[14px]">
                  @{userData?.profile?.username || "username"}
                </p>
              </div>

              <p
                className="font-bold my-2 text-[14px]"
                
              >
                {userData?.profile?.bio || bio}
              </p>

              <div
              
                className="flex items-center w-fit whitespace-nowrap border border-gray-400 gap-1 text-xs md:text-[12px] font-semibold text-gray-500  px-1 py-1"
                
              >
                <Image
                  src="/icons/location1.png"
                  alt="Location"
                  width={12}
                  height={12}
                  className="w-fit h-3"
                />
                <span className="truncate">
                  {userData?.profile?.location || "No location"}
                </span>
              </div>
            </motion.div>
          </motion.div>

        

          {/* Other modals with similar animation patterns... */}

          <motion.div variants={itemVariants}>
            <LinkList
              linksDataData={profileLinks.sort(
                (a, b) => a.displayOrder - b.displayOrder
              )}
            />
          </motion.div>
        </main>

        <motion.aside
          variants={itemVariants}
          className="w-full md:w-[40%] h-[100vh] overflow-y-auto md:h-none -mb-20 md:mb-0 bg-[#Fff7de] overscroll-auto md:overscroll-none"
        >
          <SideDashboard />

          {/* PHONE DISPLAY */}
          <motion.div
            onClick={handlePhoneClick}
            className="md:pointer-events-none mx-auto cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PhoneDisplay
              phoneDisplayLoading={loading}
              buttonStyle={buttonStyle}
              fontStyle={fontStyle}
              selectedTheme={selectedTheme}
              profile={phoneProfile}
              links={profileLinks}
            />
          </motion.div>
          <MobileBottomNav />
        </motion.aside>

        {/* ================= MOBILE LINKLIST OVERLAY ================= */}
        <AnimatePresence>
          {isMobile && showMobileLinks && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideInVariants}
              className="fixed inset-0 bg-[#FFF7DE] z-[998] overflow-y-auto"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="sticky mb top-0 py-8 bg-[#FFF7DE] px-4 border-b"
              >
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMobileLinks(false)}
                    className="font-extrabold text-[19px] text-[#331400]"
                  >
                    <ChevronLeft className="inline mr-2" />
                    Abio Links
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#331400] text-[13px] shadow-[2px_2px_0px_0px_#000000] font-semibold bg-[#fed45c] px-4 py-2"
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
              <div>
                <div className="px-8 mb-8  max-w-3xl">
                  <div className="flex gap-2 items-center">
                    <div>
                      <Image
                        src={
                          userData?.profile?.avatarUrl ||
                          "/icons/Profile Picture.png"
                        }
                        alt="Profile"
                        width={80}
                        height={80}
                        className="object-cover shadow-lg w-20 h-20  rounded-full"
                        
                      />
                    </div>

                    <div>
                      <div
                        className="mb-1 cursor-pointer"
                        onClick={() => openModal("editBio")}
                      >
                        <motion.h1
                          whileHover={{ x: 5 }}
                          className="font-extrabold text-[20px]"
                        >
                          {displayName || "User"}
                        </motion.h1>
                        <p className="font-semibold text-[12px]">
                          {userData?.profile?.username || "username"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <motion.p
                      whileHover={{ x: 5 }}
                      className="font-bold my-2 text-[14px] cursor-pointer"
                      onClick={() => openModal("editBio")}
                    >
                      {userData?.profile?.bio || bio}
                    </motion.p>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center w-fit whitespace-nowrap border-1 border-gray-400 gap-1  text-xs md:text-[10px] text-gray-500 cursor-pointer px-1 py-1"
                      onClick={() => openModal("editLocation")}
                    >
                      <Image
                        src="/icons/location1.png"
                        alt="Location"
                        width={12}
                        height={12}
                        className="w-3 h-3 flex-shrink-0"
                      />
                      <span className="truncate text-[10px]">
                        {userData?.profile?.location || location}
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
              {/* LinkList EXACTLY AS DESKTOP */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className=""
              >
                <LinkList
                  linksDataData={profileLinks.sort(
                    (a: ProfileLink, b: ProfileLink) =>
                      a.displayOrder - b.displayOrder
                  )}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </ProtectedRoute>
  );
}