"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/ui/modal";
import { toast } from "sonner";
import SideDashboard from "@/components/SideDashboard";
import LinkList from "@/components/LinkList";
import PhoneDisplay from "@/components/PhoneDisplay";
import Skeleton from "@/components/Skeleton/Skeleton";
import ButtonCustomizer, {ButtonStyle} from '@/components/ButtonCustomizer';
import FontCustomizer, { FontStyle } from '@/components/FontCustomizer';
import ProfileContent, {profile} from "@/components/ProfileContent";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("David Oshinowo");
  const [bio, setBio] = useState("UI/UX Designer");
  const [location, setLocation] = useState("Lagos, Nigeria");
  const [locations, setLocations] = useState<string[]>([]);
  const [tempLocation, setTempLocation] = useState(""); // Temporary location state for editing
  const [profileImage, setProfileImage] = useState<string>("/icons/profileplaceholder.png");

   const [buttonStyle, setButtonStyle] = useState<ButtonStyle>({
      borderRadius: '12px',
      backgroundColor: '#EAEAEA',
      borderColor: '#000000',
      opacity: 1,
      boxShadow: 'none',
    });
  
    const [fontStyle, setFontStyle] = useState<FontStyle>({
      fontFamily: 'Poppins',
      fillColor: '#000000',
      strokeColor: '#ff0000',
      opacity: 100,
    });
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const openModal = (type: string) => {
    if (type === "editLocation") {
      setTempLocation(location); // Initialize temp location with current location
    }
    setActiveModal(type);
  };
  const closeModal = () => setActiveModal(null);
  const [links, setLinks] = useState([
  { id: '1', platform: 'Instagram', url: 'https://www.instagram.com/davidosh', clicks: 0, active: true },
  { id: '2', platform: 'Behance', url: 'https://www.behance.net/davidosh', clicks: 0, active: true },
  { id: '3', platform: 'Snapchat', url: 'https://www.snapchat.com/add/davidosh', clicks: 0, active: true },
  { id: '4', platform: 'X', url: 'https://x.com/davidosh', clicks: 0, active: true },
]);
  
  const handleLocationSearch = async (query: string) => {
    setTempLocation(query); // Update temp location as user types
    if (query.length < 2) {
      setLocations([]);
      return;
    }
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      const filtered = data
        .map((country: any) => country.name.common)
        .filter((name: string) => name.toLowerCase().includes(query.toLowerCase()))
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
    setProfileImage("/icons/profileplaceholder.png");
    toast.success("Profile image deleted");
    closeModal();
  };

   

  if (loading) {
    return (
      <section className="flex min-h-screen mt-8 p-4 md:p-6 space-y-4 md:space-y-6 bg-[#f8f9fd]">
        {/* Main Content Skeleton */}
        <main className="w-full md:w-[60%] space-y-4 md:space-y-6">
          {/* Profile Card Skeleton */}
          <div className="border shadow-sm flex gap-3 md:gap-4 items-center p-3 md:p-4 bg-white ">
            <Skeleton width="80px" height="80px" />
            <div className="space-y-3 w-full">
              <div className="space-y-2">
                <Skeleton width="150px" height="200px" />
                <Skeleton width="100px" height="150px" />
              </div>
              <Skeleton width="120px" height="14px" />
              <Skeleton width="100px" height="24px" />
            </div>
          </div>

          {/* Link List Skeleton */}
          <div className="bg-white p-4  space-y-4">
            <Skeleton width="100px" height="20px" className="mb-4" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <Skeleton width="24px" height="24px" />
                  <Skeleton width="120px" height="16px" />
                </div>
                <Skeleton width="24px" height="24px"  />
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar Skeleton */}
        <aside className="hidden md:block md:w-[40%] space-y-6">
          {/* SideDashboard Skeleton */}
          <div className="bg-white p-4 space-y-4">
            <Skeleton width="150px" height="20px" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton width="100%" height="80px" />
              <Skeleton width="100%" height="80px" />
            </div>
          </div>

          {/* PhoneDisplay Skeleton */}
          <div className="bg-white p-4 ">
            <Skeleton width="100%" height="400px" />
          </div>
        </aside>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen p-4 md:p-6 space-y-4 md:space-y-6 bg-[#f8f9fd]">
      <main className="w-full md:w-[60%] space-y-4 md:space-y-6">
        <div className="border shadow-sm flex gap-3 md:gap-4 items-center p-3 md:p-4 bg-white ">
          <Image
            src={profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="object-cover w-20 h-20 md:w-25 md:h-25 cursor-pointer rounded-full"
            onClick={() => openModal("imageOptions")}
          />

          <div>
            <div className="mb-2 md:mb-3 cursor-pointer" onClick={() => openModal("editBio")}>
              <h1 className="font-bold text-base md:text-lg">{displayName}</h1>
              <p className="font-thin text-xs md:text-[12px]">@davidosh</p>
            </div>

            <p className="font-semibold mb-1 md:mb-2 text-xs md:text-[11px]">{bio}</p>

            <div
              className="flex items-center min-w-fit whitespace-nowrap border border-gray-300 gap-1 text-xs md:text-[12px] text-gray-500 cursor-pointer px-2 py-1 rounded"
              onClick={() => openModal("editLocation")}
            >
              <Image 
                src="/icons/location1.png" 
                alt="Location" 
                width={12} 
                height={12} 
                className="w-3 h-3 md:w-[14px] md:h-[14px] flex-shrink-0" 
              />
              <span className="truncate">{location}</span>
            </div>
          </div>
        </div>

        {/* Edit Bio Modal */}
        <Modal isOpen={activeModal === "editBio"} onClose={closeModal}>
          <div className="w-full md:w-[400px] mx-auto">
            <h2 className="text-base md:text-lg font-semibold text-center mb-3 md:mb-4">Edit Name and Bio</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem("displayName") as HTMLInputElement).value;
                const bioInput = (form.elements.namedItem("bio") as HTMLInputElement).value;
                setDisplayName(name);
                setBio(bioInput);
                toast.success("Profile updated");
                closeModal();
              }}
            >
              <div className="mb-3 md:mb-4">
                <label htmlFor="displayName" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  defaultValue={displayName}
                  className="w-full border border-2 border-[#7140EB80] px-3 py-2 text-xs md:text-sm"
                  required
                />
              </div>

              <div className="mb-3 md:mb-4">
                <label htmlFor="bio" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name=" "
                  rows={3}
                  defaultValue={bio}
                  className="w-full border border-2 border-[#7140EB80] rounded-md px-3 py-2 text-xs md:text-sm"
                  required
                />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] w-full text-white px-4 py-2 text-xs md:text-sm rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Edit Location Modal */}
        <Modal isOpen={activeModal === "editLocation"} onClose={closeModal}>
          <div className="w-[280px] md:w-[320px] mx-auto text-center">
            <h2 className="text-base md:text-lg font-bold mb-3 md:mb-4">Location</h2>

            <div className="relative mb-3 md:mb-4">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Image src="/icons/location1.png" alt="Location Icon" width={12} height={12} className="w-3 h-3 md:w-[14px] md:h-[14px]" />
              </span>
              <input
                type="text"
                placeholder="Location"
                value={tempLocation}
                onChange={(e) => handleLocationSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-[#7140EB80] text-xs md:text-sm"
              />
            </div>

            <ul className="max-h-[180px] md:max-h-[200px] overflow-y-auto text-left space-y-1">
              {locations.map((loc, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setTempLocation(loc);
                    setLocations([]); // Clear suggestions when one is selected
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded-md text-xs md:text-sm"
                >
                  {loc}
                </li>
              ))}
            </ul>

            <button
              onClick={handleSaveLocation}
              className="mt-2 w-full text-xs md:text-sm bg-gradient-to-r from-[#7140EB] to-[#FB8E8E] text-white px-4 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </Modal>

        {/* Image Options Modal */}
        <Modal isOpen={activeModal === "imageOptions"} onClose={closeModal}>
          <div className="w-[280px] md:w-[320px] mx-auto text-center bg-white space-y-3 md:space-y-4">
            <h2 className="text-base md:text-lg font-bold">Profile Picture</h2>
            <div className="flex flex-col gap-3 md:gap-4">
              <button
                onClick={() => setActiveModal("uploadImage")}
                className="bg-[#EBEBEB] py-2 px-3 md:px-4 rounded-md text-xs md:text-sm hover:bg-gray-200"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Image src="/images/contact-us-image.svg" alt="Upload" width={30} height={30} className="w-6 h-6 md:w-[35px] md:h-[35px]" />
                  <div className="text-left">
                    <h1 className="text-sm md:text-[15px] font-bold">Upload your own image</h1>
                    <p className="text-[9px] md:text-[10px] font-light">Choose an image, GIF from your device.</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setActiveModal("deleteConfirm")}
                className="w-full px-3 md:px-4 py-2 bg-[#EBEBEB] text-black rounded-md hover:bg-gray-200 text-xs md:text-sm"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Image src="/icons/delete.svg" alt="Delete" width={30} height={30} className="w-6 h-6 md:w-[35px] md:h-[35px]" />
                  <div className="text-left">
                    <h1 className="text-sm md:text-[15px] font-bold">Delete</h1>
                    <p className="text-[9px] md:text-[10px] font-light">Delete current image.</p>
                  </div>
                </div>
              </button>
              <button onClick={closeModal} className="text-xs md:text-sm text-gray-500 hover:underline">
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* Upload Modal */}
        <Modal isOpen={activeModal === "uploadImage"} onClose={closeModal}>
          <div className="w-[280px] md:w-[320px] mx-auto text-center">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Profile Picture</h2>
            <label className="flex flex-col items-center justify-center w-full h-40 md:h-48 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
              <div className="flex flex-col items-center space-y-1 md:space-y-2">
                <Image src="/icons/upload.svg" alt="Upload" width={32} height={32} className="w-8 h-8 md:w-10 md:h-10" />
                <p className="text-xs md:text-sm font-medium text-gray-700">Select file to upload</p>
                <p className="text-[10px] md:text-xs text-gray-400">or drag-and-drop file</p>
                <p className="text-[8px] md:text-[10px] text-gray-500 mt-1">
                  Allowed file types: JPEG, PNG, WebP, GIF, AVIF, BMP, HEIC, HEIF
                </p>
              </div>
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/webp, image/gif, image/avif, image/bmp, image/heic, image/heif" 
                hidden 
                onChange={handleImageUpload} 
              />
            </label>
            <button onClick={closeModal} className="mt-3 md:mt-4 border border-2 w-full py-2 rounded-full text-xs md:text-sm text-gray-500 hover:underline">
              Cancel
            </button>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={activeModal === "deleteConfirm"} onClose={closeModal}>
          <div className="w-[300px] md:w-[400px] mx-auto text-center space-y-3 md:space-y-4">
            <h2 className="text-base md:text-lg font-bold">Delete Profile Image</h2>
            <p className="text-[10px] md:text-[12px]">Are you sure you want to delete your profile picture?</p>
            <div className="flex justify-center gap-3 md:gap-4 mt-3 md:mt-4">
              <button
                onClick={handleDeleteImage}
                className="bg-red-500 text-white font-medium px-3 md:px-4 py-1 md:py-2 rounded-md text-xs md:text-sm hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-200 text-xs md:text-sm font-medium px-3 md:px-4 py-1 md:py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <LinkList />
      </main>

      <aside className="hidden md:block md:w-[40%]">
        <SideDashboard />
        <PhoneDisplay buttonStyle={buttonStyle} fontStyle={fontStyle}
        selectedTheme={"/themes/theme1.png"}
         profile={profile}
        
        />
      </aside>
    </section>
  );
}