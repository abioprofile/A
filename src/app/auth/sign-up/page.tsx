  "use client";

  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import Image from "next/image";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { toast } from "sonner";
  import { useState } from "react";
  import { Label } from "@/components/ui/label";
  import { Eye, EyeOff } from "lucide-react";
  import { Separator } from "@/components/ui/separator";
  import { registerUser } from "@/lib/auth";

  const SignUp = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    });

    // Handle input changes
    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    };

  // Validate form
  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

   
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

    // Submit 
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setLoading(true);
      try {
        const res = await registerUser(
        `${formData.firstName} ${formData.lastName}`,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

        if (!res.success) {
          throw new Error(res.message || "Signup failed");
        }

        toast.success("Account created successfully!", {
          description: "Check your email for verification to complete signup.",
        });

        // Redirect to verification page with user email
        router.push(`/auth/verification?email=${encodeURIComponent(formData.email)}&prev=register`);
        
      } catch (error: any) {
        console.error('Signup error:', error);
        toast.error(error.message || "Signup failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="lg:flex lg:justify-between bg-[#FEF4EA] min-h-screen w-full">
        <div className="p-4">
          <Link href="/" className="flex items-center gap-1 group">
            <Image
              src="/icons/A.Bio.png"
              alt="A.Bio Logo"
              width={28}
              height={28}
              priority
              className="cursor-pointer select-none transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-xl md:text-2xl text-black tracking-wide">
              bio
            </span>
          </Link>
        </div>

        <div className="p-4 mt-10 max-w-xl mx-auto flex flex-col">
          <div className="flex flex-col items-center lg:mt-2 flex-1">
            <div className="mb-4 text-center">
              <h1 className="text-xl lg:text-2xl font-bold mb-1 bg-[#331400] text-transparent bg-clip-text">
                Signup to A.Bio
              </h1>
              <p className="text-[#666464] text-xs">
                Create your smart digital identity in minutes.
              </p>
            </div>

            <form className="space-y-2.5 w-full lg:max-w-fit" onSubmit={handleSubmit}>
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-semibold text-[14px]">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="md:h-8 text-xs placeholder:text-[11px] border border-black"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  disabled={loading}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-semibold text-[14px]">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="md:h-8 text-xs placeholder:text-[11px] border border-black"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="font-semibold mb-2 text-[14px]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="md:h-8 text-xs placeholder:text-[11px] border border-black"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label htmlFor="password" className="font-semibold text-[14px]">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="md:h-8 pr-7 text-xs placeholder:text-[11px] border border-black"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label htmlFor="confirm_password" className="font-semibold text-[14px]">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    className="md:h-8 pr-7 text-[11px] placeholder:text-[11px] border border-black"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full md:h-8 bg-[#FED45C] text-[#331400] text-sm font-semibold hover:bg-[#fecf4a] transition-colors"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* OR Divider */}
              <div className="flex items-center gap-2">
                <Separator className="flex-1" />
                <span className="text-gray-500 text-[10px]">or</span>
                <Separator className="flex-1" />
              </div>

              {/* Socials */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  className="md:h-8 text-[10px] font-medium flex items-center gap-1"
                  disabled={loading}
                >
                  <Image src={"/assets/icons/auth/apple.svg"} alt="apple icon" width={14} height={14} priority />
                  Apple
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="md:h-8 text-[10px] font-medium flex items-center gap-1"
                  disabled={loading}
                >
                  <Image src={"/assets/icons/auth/google.svg"} alt="google icon" width={14} height={14} priority />
                  Google
                </Button>
              </div>

              {/* Redirect to Login */}
              <div className="text-center">
                <p className="text-[12px] text-gray-600 font-semibold">
                  Already a user?{" "}
                  <Link 
                    href="/auth/sign-in" 
                    className="bg-[#EA2228] text-transparent bg-clip-text hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-2 text-right lg:pr-8">
            <Link href="/privacy-policy" className="text-[12px] text-gray-500 font-semibold hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default SignUp;