import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      {/* Phone container */}
      <div className="relative w-[320px] h-[580px] border-[6px] border-black bg-white overflow-hidden shadow-xl">

        {/* ===== TOP PROFILE CARD ===== */}
        <div className="bg-white p-5">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-[56px] h-[56px] rounded-full overflow-hidden border">
              <Image
                src="/icons/Profile Picture.png"
                alt="Profile"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>

            {/* Name */}
            <div>
              <p className="font-bold text-sm">David Osh</p>
              <p className="text-xs text-gray-500">@davidosh</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-xs mt-3">
            I am a Product designer &amp; Co founder
          </p>

          {/* Location */}
          <div className="inline-flex items-center gap-1 mt-2 border px-2 py-[2px] text-[10px]">
            <Image
              src="/icons/location1.png"
              alt="location"
              width={10}
              height={10}
            />
            Lagos, Nigeria
          </div>

          {/* Link indicator */}
          <div className="mt-3 flex items-center gap-2 relative">
            <Image src="/icons/link.png" alt="link" width={18} height={18} />
            <div className="absolute -bottom-1 left-0 w-6 h-[2px] bg-red-500" />
          </div>
        </div>

        {/* ===== BACKGROUND IMAGE ===== */}
        <div className="absolute inset-0 top-[190px] -z-10">
          <Image
            src="/themes/rick-morty.png"
            alt="background"
            fill
            className="object-cover"
          />
        </div>

        {/* ===== BUTTONS ===== */}
        <div className="relative z-10 px-4 pt-6 space-y-4">
          {[
            { label: "Follow my instagram", icon: "/icons/Social.png" },
            { label: "Checkout my portfolio", icon: "/icons/Social 2.png" },
            { label: "add on snapchat", icon: "/icons/Social 1.png" },
            { label: "tiktok", icon: "/icons/Social 3.png" },
          ].map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-4 py-3 font-medium text-sm
                         bg-[#C8F46A] border-2 border-black rounded-xl
                         shadow-[0_5px_0_#000]"
            >
              <Image src={item.icon} alt={item.label} width={18} height={18} />
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
