'use client';
import Image from "next/image";
import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Modal from "@/components/ui/modal";
import { toast } from "sonner";

const ProfileContent = ({ onProfileUpdate }: { onProfileUpdate: (data: any) => void }) => {
  const [profileImage, setProfileImage] = useState<string >("/icons/profileplaceholder.png");
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [tempLocation, setTempLocation] = useState(""); 
   const [activeModal, setActiveModal] = useState<string | null>(null);
  const openModal = (type: string) => {
    if (type === "editLocation") {
      setTempLocation(location); // Initialize temp location with current location
    }
    setActiveModal(type);
  };
  const closeModal = () => setActiveModal(null);
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      onProfileUpdate({ profileImage: imageUrl, displayName, bio, location });
    }
  };

 const handleDeleteImage = () => {
    setProfileImage("/icons/profileplaceholder.png");
    toast.success("Profile image deleted");
    closeModal();
  };

  const handleSave = () => {
    const updatedProfile = {
      displayName,
      bio,
      location,
      profileImage,
    };
     onProfileUpdate(updatedProfile); 
  toast.success("Profile updated successfully!");
  closeModal();
  };

  return (
    <div className="space-y-2  p-6  flex flex-col items-center gap-6">
      {/* Profile Image */}
      <div className="flex justify-between items-center w-full">
        <div className="w-28 h-28 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden">
          {profileImage ? (
            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
          ) : (
            <Image
        src="/icons/profileplaceholder.png"
        alt="Profile"
        width={110} // matching w-28
        height={110} // matching h-28
        className="rounded-full shadow-md object-cover"
      />
          )}
        </div>

        {/* Upload & Delete Buttons */}
        
<div className="flex flex-col gap-4 mt-2">
  <button
    type="button"
    onClick={() => openModal("imageOptions")}
    className="bg-[#7140EB] text-white text-[15px] px-4 py-[8px]  cursor-pointer"
  >
    Upload Image
  </button>

  <button
    onClick={handleDeleteImage}
    className="border border-[#7140EB] text-[15px] text-[#FF0000] px-4 py-[8px]"
  >
    Delete
  </button>
</div>
      </div>

{/* Display Name */}
<div className="w-full flex flex-col gap-1">
  <label htmlFor="displayName" className="text-left text-sm font-bold ">
    Display Name
  </label>
  <input
    id="displayName"
    type="text"
    
    value={displayName}
    onChange={(e) => setDisplayName(e.target.value)}
    className="w-full border border-[#7140EB80] px-3 py-2 text-[14px]  bg-transparent"
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
    className="w-full border border-[#7140EB80] px-3 py-2  bg-transparent text-[14px] h-28"
  />
</div>

{/* Location */}
<div className="w-full flex flex-col gap-1">
  <label htmlFor="location" className="text-left text-sm font-bold">
    Location
  </label>
  <div className="flex items-center border border-[#7140EB80] px-3 py-2 bg-transparent">
    <MapPin className=" mr-2" />
    <input
      id="location"
      type="text"
      placeholder="Location"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="flex-1 bg-transparent text-white outline-none"
    />
  </div>
</div>

{/* Save Button */}
<button
  onClick={handleSave}
  className="w-full  bg-gradient-to-r from-[#7140EB] to-[#FF6EC7] text-white py-3 rounded"
>
  Save Changes
</button>
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
    </div>
  );
};

export default ProfileContent;



