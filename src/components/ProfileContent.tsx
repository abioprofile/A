"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/modal";
import DeleteModal from "@/components/DeleteModal";
import { toast } from "sonner";
import { useAppSelector } from "@/stores/hooks";
import { useUpdateProfileAvatar } from "@/hooks/api/useAuth";
import { LocationInput } from "@/components/LocationInput";

interface ProfileData {
  profileImage: string;
  displayName: string;
  bio: string;
  location: string;
  profileIcon?: string | null;
}

interface ProfileContentProps {
  onProfileUpdate: (data: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

const ProfileContent = ({
  onProfileUpdate,
  initialData,
}: ProfileContentProps) => {
  // Ensure default profile image path points to public/icons/Profile-Picture.png
  const defaultProfileImage = "/icons/Profile-Picture.png";
  const userData = useAppSelector((state) => state.auth.user);


  const { mutate: updateAvatar, isPending: isUploadingAvatar } = useUpdateProfileAvatar();

  const [profileImage, setProfileImage] = useState<string>(
    userData?.profile?.avatarUrl || defaultProfileImage,
  );
  const [profileIcon, setProfileIcon] = useState<string | null>(
    initialData?.profileIcon || null,
  );
  const [displayName, setDisplayName] = useState(
    initialData?.displayName || "",
  );
  const [bio, setBio] = useState(initialData?.bio || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Update internal state when initialData changes
  useEffect(() => {
    if (initialData) {
      // Only update if data actually changed
      const hasChanged =
        initialData.profileImage !== profileImage ||
        initialData.displayName !== displayName ||
        initialData.bio !== bio ||
        initialData.location !== location ||
        initialData.profileIcon !== profileIcon;

      if (hasChanged) {
        if (initialData.profileImage) setProfileImage(initialData.profileImage);
        if (initialData.displayName) setDisplayName(initialData.displayName);
        if (initialData.bio) setBio(initialData.bio);
        if (initialData.location) setLocation(initialData.location);
        if (initialData.profileIcon !== undefined)
          setProfileIcon(initialData.profileIcon);
        setIsDirty(false); // Reset dirty flag when getting new data from parent
      }
    }
  }, [initialData]);

  const handleSave = () => {
    onProfileUpdate({
      profileImage,
      displayName,
      bio,
      location,
      profileIcon,
    });
    setIsDirty(false);
    toast.success("Profile updated!");
  };

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "icon",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "icon") {
      const imageUrl = URL.createObjectURL(file);
      setProfileIcon(imageUrl);
      toast.success("Icon uploaded successfully!");
      onProfileUpdate({
        profileImage,
        displayName,
        bio,
        location,
        profileIcon: imageUrl,
      });
      setIsDirty(true);
      closeModal();
      e.target.value = "";
    } else {
      updateAvatar(file, {
        onSuccess: (response) => {
          if (response.data?.avatarUrl) {
            setProfileImage(response.data.avatarUrl);
            onProfileUpdate({
              profileImage: response.data.avatarUrl,
              displayName,
              bio,
              location,
              profileIcon,
            });
            toast.success("Profile image uploaded successfully!");
          }
          closeModal();
          e.target.value = "";
        },
        onError: () => {
          toast.error("Failed to upload profile image");
          e.target.value = "";
        }
      });
    }
  };

  const handleDeleteImage = () => {
    setProfileImage(defaultProfileImage);
    setProfileIcon(null);
    toast.success("Profile image deleted");
    setIsDirty(true);
    setShowDeleteModal(false);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setDisplayName(newVal);
    setIsDirty(true);
    onProfileUpdate({
      profileImage,
      displayName: newVal,
      bio,
      location,
      profileIcon,
    });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length <= 15) {
      const newVal = e.target.value;
      setBio(newVal);
      setIsDirty(true);
      onProfileUpdate({
        profileImage,
        displayName,
        bio: newVal,
        location,
        profileIcon,
      });
    } else {
      toast.error("Your bio can only contain up to 15 words.");
    }
  };

  const handleLocationChange = (newVal: string) => {
    setLocation(newVal);
    setIsDirty(true);
    onProfileUpdate({
      profileImage,
      displayName,
      bio,
      location: newVal,
      profileIcon,
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-2 md:space-y-3 flex flex-col items-center gap-2 md:gap-3">
      {/* Profile Image Section */}
      <div className="flex justify-between md:mb-8 items-center w-full">
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-200 overflow-hidden">
          <Image
            src={userData?.profile?.avatarUrl || defaultProfileImage}
            alt="Profile"
            fill
            sizes="60px"
            className="object-cover rounded-full"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = defaultProfileImage;
            }}
          />
          {profileIcon && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border shadow-sm">
              <Image
                src={profileIcon}
                alt="icon"
                width={16}
                height={16}
                className="object-contain rounded-full"
              />
            </div>
          )}
        </div>

        {/* Upload & Delete Buttons */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-0 md:space-y-2 mt-2">
          <button
            onClick={() => openModal("imageOptions")}
            className="bg-black text-white text-[11px] md:text-[12px] px-3 md:px-4 py-[5px] md:py-[6px] cursor-pointer transition hover:opacity-90"
          >
            Upload Image
          </button>
          {/* <button
            onClick={() => setShowDeleteModal(true)}
            className="border border-black text-[12px] text-red-600 px-4 py-[6px] transition hover:bg-red-50"
          >
            Delete
          </button> */}
        </div>
      </div>

      {/* Display Name */}
      <div className="w-full flex flex-col gap-1">
        <label
          htmlFor="displayName"
          className="text-left text-[11px] md:text-[12px] font-semibold"
        >
          Display Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={handleDisplayNameChange}
          className="w-full border border-black px-3 py-2 text-[13px] md:text-[14px] placeholder:text-[11px] md:placeholder:text-[14px] bg-transparent"
          placeholder="Enter your display name"
        />
      </div>

      {/* Bio */}
      <div className="w-full flex flex-col gap-1">
        <label htmlFor="bio" className="text-left text-[11px] md:text-[12px] font-semibold">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={handleBioChange}
          className="w-full border border-[#000] px-3 py-2 bg-transparent text-[13px] md:text-[14px] placeholder:text-[11px] md:placeholder:text-[14px] h-10 md:h-24 text-gray-800"
          placeholder="Tell us about yourself (max 15 words)..."
        />
        <p className="text-[11px] hidden md:block text-gray-500 text-right">
          {bio.trim() === "" ? 0 : bio.trim().split(/\s+/).length}/15 words
        </p>
      </div>

      {/* Location (reusable: search + select from dropdown) */}
      <LocationInput
        id="location"
        label="Location"
        value={location}
        onChange={handleLocationChange}
        placeholder="Search for a location"
        className="w-full flex flex-col gap-1"
      />

      {/* Save Button */}
      

      {/* --- MODALS --- */}
      <Modal isOpen={activeModal === "imageOptions"} onClose={closeModal}>
        <div className="w-[280px] md:w-[320px] mx-auto text-center bg-white space-y-3 md:space-y-4">
          <h2 className="text-[14px] md:text-[16px] font-bold text-[#331400]">
            Profile Picture
          </h2>
          <div className="flex flex-col gap-3 md:gap-4">
            <button
              onClick={() => setActiveModal("uploadImage")}
              className="bg-[#EBEBEB] py-2 px-3 md:px-4 text-xs md:text-sm hover:bg-gray-200"
            >
              Upload your own image
            </button>
            <button
              onClick={() => setActiveModal("uploadIcon")}
              className="bg-[#EBEBEB] py-2 px-3 md:px-4 text-xs md:text-sm hover:bg-gray-200"
            >
              Upload Icon
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-[#EBEBEB] py-2 px-3 text-xs md:text-sm text-[#FF0000] hover:bg-gray-200"
            >
              Delete
            </button>
            <button
              onClick={closeModal}
              className="text-xs md:text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Upload Image */}
      <Modal isOpen={activeModal === "uploadImage"} onClose={closeModal}>
        <div className="w-[280px] md:w-[320px] mx-auto text-center">
          <h2 className="text-[14px] md:text-[16px] font-semibold mb-3 md:mb-4">
            Profile Picture
          </h2>
          <label className={`flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed border-gray-300 ${isUploadingAvatar ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            {isUploadingAvatar ? (
               <div className="flex flex-col items-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                 <p className="text-xs md:text-sm font-medium text-gray-700">Uploading...</p>
               </div>
            ) : (
              <>
                <Image
                  src="/icons/upload.svg"
                  alt="Upload"
                  width={32}
                  height={32}
                />
                <p className="text-xs md:text-sm font-medium text-gray-700">
                  Select file to upload
                </p>
              </>
            )}
            <input
              ref={imageInputRef}
              type="file"
              hidden
              accept="image/*"
              disabled={isUploadingAvatar}
              onChange={(e) => handleImageUpload(e, "image")}
            />
          </label>
          <button
            onClick={closeModal}
            className="mt-3 border w-full py-2 rounded-full text-xs md:text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* Upload Icon */}
      <Modal isOpen={activeModal === "uploadIcon"} onClose={closeModal}>
        <div className="w-[280px] md:w-[320px] mx-auto text-center">
          <h2 className="text-[14px] md:text-[16px] font-semibold mb-3 md:mb-4">
            Upload Icon
          </h2>
          <label className="flex flex-col items-center justify-center w-full h-32 md:h-40 border-2 border-dashed border-gray-300 cursor-pointer">
            <Image
              src="/icons/upload.svg"
              alt="Upload Icon"
              width={32}
              height={32}
            />
            <p className="text-xs md:text-sm font-medium text-gray-700">
              Select icon file
            </p>
            <input
              ref={iconInputRef}
              type="file"
              hidden
              accept="image/svg+xml, image/png"
              onChange={(e) => handleImageUpload(e, "icon")}
            />
          </label>
          <button
            onClick={closeModal}
            className="mt-3 border w-full py-2 rounded-full text-xs md:text-sm text-gray-500 hover:underline"
          >
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
