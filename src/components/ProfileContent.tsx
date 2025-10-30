'use client';
import Image from "next/image";
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Modal from "@/components/ui/modal";
import DeleteModal from "@/components/DeleteModal"; 
import { toast } from "sonner";

const ProfileContent = ({ onProfileUpdate }: { onProfileUpdate: (data: any) => void }) => {
  const [profileImage, setProfileImage] = useState<string>("/icons/profile picture.png");
  const [profileIcon, setProfileIcon] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [tempLocation, setTempLocation] = useState(""); 
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openModal = (type: string) => {
    if (type === "editLocation") setTempLocation(location);
    setActiveModal(type);
  };

  const closeModal = () => setActiveModal(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "icon") => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "icon") {
        setProfileIcon(imageUrl);
        toast.success("Icon uploaded successfully!");
      } else {
        setProfileImage(imageUrl);
        toast.success("Profile image uploaded successfully!");
      }
      onProfileUpdate({ profileImage: imageUrl, displayName, bio, location, profileIcon: type === "icon" ? imageUrl : profileIcon });
    }
  };

  const handleDeleteImage = () => {
    setProfileImage("/icons/profile picture.png");
    setProfileIcon(null);
    toast.success("Profile image deleted");
  };

  return (
    <div className="space-y-2 p-6 flex flex-col items-center gap-2">
      {/* Profile Image Section */}
      <div className="flex justify-between items-center w-full">
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
          {profileImage ? (
            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <Image
              src="/icons/profileplaceholder.png"
              alt="Profile"
              width={110}
              height={110}
              className="rounded-full shadow-md object-cover"
            />
          )}
          {profileIcon && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border">
              <img src={profileIcon} alt="icon" className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Upload & Delete Buttons */}
        <div className="flex flex-col space-y-2 mt-2">
          <button
            type="button"
            onClick={() => openModal("imageOptions")}
            className="bg-[#000] text-white text-[14px] px-4 py-[6px] cursor-pointer"
          >
            Upload Image
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="border border-[#000] text-[14px] text-[#FF0000] px-4 py-[6px] "
          >
            Delete
          </button>
        </div>
      </div>

      {/* Display Name */}
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="displayName" className="text-left text-sm font-bold">
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full border-2 border-[#000] px-3 py-2 text-[14px] bg-transparent"
        />
      </div>

      {/* Bio */}
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="bio" className="text-left text-sm font-bold">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border-2 border-[#000] px-3 py-2 bg-transparent text-[14px] h-24"
        />
      </div>

      {/* Location */}
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="location" className="text-left text-sm font-bold">
          Location
        </label>
        <div className="flex items-center border-2 border-[#000] px-3 py-2 bg-transparent">
          <MapPin className="mr-1 w-4 h-4" />
          <input
            id="location"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 placeholder:text-[13px] bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={activeModal === "imageOptions"} onClose={closeModal}>
        <div className="w-[280px] md:w-[320px] mx-auto text-center bg-white space-y-3 md:space-y-4">
          <h2 className="text-base md:text-lg text-[#331400] font-bold">Profile Picture</h2>
          <div className="flex flex-col gap-3 md:gap-4">
            <button onClick={() => setActiveModal("uploadImage")} className="bg-[#EBEBEB] py-2 px-3 md:px-4 text-xs md:text-sm hover:bg-gray-200">
              Upload your own image
            </button>
            <button onClick={() => setActiveModal("uploadIcon")} className="bg-[#EBEBEB] py-2 px-3 md:px-4 text-xs md:text-sm hover:bg-gray-200">
              Upload Icon
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="bg-[#EBEBEB] py-2 px-3 text-xs md:text-sm text-[#FF0000] hover:bg-gray-200">
              Delete
            </button>
            <button onClick={closeModal} className="text-xs md:text-sm text-gray-500 hover:underline">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Upload Profile Image */}
      <Modal isOpen={activeModal === "uploadImage"} onClose={closeModal}>
        <div className="w-[280px] md:w-[320px] mx-auto text-center">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Profile Picture</h2>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 cursor-pointer">
            <Image src="/icons/upload.svg" alt="Upload" width={32} height={32} />
            <p className="text-xs md:text-sm font-medium text-gray-700">Select file to upload</p>
            <input type="file" hidden accept="image/*" onChange={(e) => handleImageUpload(e, "image")} />
          </label>
          <button onClick={closeModal} className="mt-3 border w-full py-2 rounded-full text-xs md:text-sm text-gray-500 hover:underline">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Upload Icon */}
      <Modal isOpen={activeModal === "uploadIcon"} onClose={closeModal}>
        <div className="w-[280px] md:w-[320px] mx-auto text-center">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Upload Icon</h2>
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 cursor-pointer">
            <Image src="/icons/upload.svg" alt="Upload Icon" width={32} height={32} />
            <p className="text-xs md:text-sm font-medium text-gray-700">Select icon file</p>
            <input type="file" hidden accept="image/svg+xml, image/png" onChange={(e) => handleImageUpload(e, "icon")} />
          </label>
          <button onClick={closeModal} className="mt-3 border w-full py-2 rounded-full text-xs md:text-sm text-gray-500 hover:underline">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteImage}
      />
    </div>
  );
};

export default ProfileContent;






