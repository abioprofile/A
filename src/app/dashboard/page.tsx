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
import { ButtonStyle } from "@/app/dashboard/appearance/page";
import FontCustomizer, { FontStyle } from "@/components/FontCustomizer";
import ProfileContent from "@/components/ProfileContent";
import { AuthContext, User } from "@/context/AuthContext";
import { useAppSelector } from "@/stores/hooks";
import { useGetAllLinks } from "@/hooks/api/useAuth";
import { ProfileLink, UserProfile } from "@/types/auth.types";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
// Import Framer Motion
import { motion, AnimatePresence } from "framer-motion";

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
  const [firstName, setFirstName] = useState<string>("User");

  useEffect(() => {
    if (user?.name) {
      const name = user.name.split(" ")[0];
      setDisplayName(user.name);
      setFirstName(name);
    } else if (userData?.name) {
      const name = userData.name.split(" ")[0];
      setDisplayName(userData.name);
      setFirstName(name);
    }
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

  const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
    borderRadius: "12px",
    backgroundColor: "#EAEAEA",
    borderColor: "#000000",
    opacity: 1,
    boxShadow: "none",
  });

  const [fontStyle, setFontStyle] = useState<FontStyle>({
    fontFamily: "Poppins",
    fillColor: "#000000",
    strokeColor: "#ff0000",
    opacity: 100,
  });

  const profile = {
    displayName: user?.name || "User",
    userName: user?.username || "username",
    bio,
    location,
    profileImage,
  };

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

  const [links, setLinks] = useState([
    {
      id: "1",
      platform: "Instagram",
      url: "https://www.instagram.com/davidosh",
      clicks: 0,
      active: true,
    },
    {
      id: "2",
      platform: "Behance",
      url: "https://www.behance.net/davidosh",
      clicks: 0,
      active: true,
    },
    {
      id: "3",
      platform: "Snapchat",
      url: "https://www.snapchat.com/add/davidosh",
      clicks: 0,
      active: true,
    },
    {
      id: "4",
      platform: "X",
      url: "https://x.com/davidosh",
      clicks: 0,
      active: true,
    },
  ]);

  const {
    data: linksData,
    isLoading: linksLoading,
    isError: linksError,
    refetch: refetchLinks,
  } = useGetAllLinks();

  const transformLinks = (links: unknown): ProfileLink[] => {
    if (!links || !Array.isArray(links)) return [];
    return links
      .map((link: unknown) => {
        if (typeof link === "object" && link !== null) {
          const l = link as Record<string, unknown>;
          return {
            id: String(l.id || ""),
            title: String(l.title || ""),
            url: String(l.url || ""),
            platform: String(l.platform || ""),
            displayOrder:
              typeof l.displayOrder === "number" ? l.displayOrder : 0,
            isVisible: l.isVisible !== false,
          };
        }
        return null;
      })
      .filter((link): link is ProfileLink => link !== null);
  };

  const profileLinks = linksData?.data
    ? Array.isArray(linksData.data)
      ? (linksData.data as ProfileLink[])
      : []
    : [];

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
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

  const slideInVariants = {
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

  const modalOverlayVariants = {
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

  const modalContentVariants = {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
          className="rounded-full h-12 w-12 border-b-2 border-[#331400]"
        />
      </div>
    );
  }

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
            Hi, {firstName}
          </motion.h1>
          
          <motion.div
            variants={itemVariants}
            className="max-w-3xl flex gap-4 items-center px-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={userData?.profile?.avatarUrl || "/icons/Profile Picture.png"}
                alt="Profile"
                width={80}
                height={80}
                className="object-cover w-24 h-24 cursor-pointer rounded-full"
                onClick={() => openModal("imageOptions")}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div
                className="mb-1 cursor-pointer"
                onClick={() => openModal("editBio")}
              >
                <motion.h1
                  whileHover={{ x: 5 }}
                  className="font-semibold text-[24px]"
                >
                  {displayName || "User"}
                </motion.h1>
                <p className="font-thin text-[10px] mt-2 md:text-[14px]">
                  @{userData?.profile?.username || "username"}
                </p>
              </div>

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
                className="flex items-center w-fit whitespace-nowrap border border-gray-400 gap-1 text-xs md:text-[12px] font-semibold text-gray-500 cursor-pointer px-1 py-1"
                onClick={() => openModal("editLocation")}
              >
                <Image
                  src="/icons/location1.png"
                  alt="Location"
                  width={12}
                  height={12}
                  className="w-fit h-3"
                />
                <span className="truncate">
                  {userData?.profile?.location || location}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated Modals */}
          <AnimatePresence>
            {activeModal === "editBio" && (
              <Modal isOpen={true} onClose={closeModal}>
                <motion.div
                  variants={modalContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full md:w-[400px] mx-auto"
                >
                  <h2 className="text-base md:text-lg font-semibold text-center mb-3 md:mb-4">
                    Edit Name and Bio
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const name = (
                        form.elements.namedItem("displayName") as HTMLInputElement
                      ).value;
                      const bioInput = (
                        form.elements.namedItem("bio") as HTMLInputElement
                      ).value;
                      setDisplayName(name);
                      setBio(bioInput);
                      toast.success("Profile updated");
                      closeModal();
                    }}
                  >
                    <div className="mb-3 md:mb-4">
                      <label
                        htmlFor="displayName"
                        className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
                      >
                        Display Name
                      </label>
                      <input
                        id="displayName"
                        name="displayName"
                        type="text"
                        defaultValue={displayName || ""}
                        className="w-full border border-2 border-[#000] px-3 py-2 text-[13px]"
                        required
                      />
                    </div>

                    <div className="mb-3 md:mb-4">
                      <label
                        htmlFor="bio"
                        className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        defaultValue={userData?.profile?.bio || bio}
                        className="w-full border border-2 border-[#000] px-3 py-2 text-[13px]"
                        required
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex justify-center gap-3"
                    >
                      <button
                        type="submit"
                        className="bg-[#FED45C] w-full text-[#331400] font-bold px-4 py-2 text-[14px]"
                      >
                        Save Changes
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeModal === "editLocation" && (
              <Modal isOpen={true} onClose={closeModal}>
                <motion.div
                  variants={modalContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-[280px] md:w-[320px] mx-auto text-center"
                >
                  <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">
                    Location
                  </h2>

                  <div className="relative mb-3 md:mb-4">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Image
                        src="/icons/location1.png"
                        alt="Location Icon"
                        width={12}
                        height={12}
                        className="w-3 h-3 md:w-[14px] md:h-[14px]"
                      />
                    </span>
                    <input
                      type="text"
                      placeholder="Location"
                      value={tempLocation}
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-[#000] text-[13px]"
                    />
                  </div>

                  <motion.ul
                    layout
                    className="max-h-[180px] md:max-h-[200px] overflow-y-auto text-left space-y-1"
                  >
                    {locations.map((loc, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          setTempLocation(loc);
                          setLocations([]);
                        }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-xs md:text-sm"
                        whileHover={{ x: 5 }}
                      >
                        {loc}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveLocation}
                    className="mt-1 text-[13px] font-bold bg-[#FED45C] text-[#331400] px-4 py-2"
                  >
                    Save Changes
                  </motion.button>
                </motion.div>
              </Modal>
            )}
          </AnimatePresence>

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
          className="w-full md:w-[40%] h-[100vh] md:h-none -mb-20 md:mb-0 bg-[#Fff7de]"
        >
          <SideDashboard />

          {/* PHONE DISPLAY */}
          <motion.div
            onClick={handlePhoneClick}
            className="md:pointer-events-none cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <PhoneDisplay
              buttonStyle={buttonStyle}
              fontStyle={fontStyle}
              selectedTheme="/themes/theme1.png"
              profile={profile}
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
              className="fixed inset-0 bg-[#FFF7DE] z-[999] overflow-y-auto"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="sticky mb-8 top-0 py-8 bg-[#FFF7DE] px-4 border-b"
              >
                <div className="flex items-center justify-between">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMobileLinks(false)}
                    className="font-bold text-[#331400]"
                  >
                    ← A.bio Links
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-[#FED45C] text-[13px] font-semibold bg-[#331400] px-4 py-2"
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
              <div>
                <div className="px-8 mb-8  max-w-3xl">
                  <div className="flex gap-2 items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={
                          userData?.profile?.avatarUrl ||
                          "/icons/Profile Picture.png"
                        }
                        alt="Profile"
                        width={80}
                        height={80}
                        className="object-cover shadow-lg w-20 h-20 cursor-pointer rounded-full"
                        onClick={() => openModal("imageOptions")}
                      />
                    </motion.div>

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