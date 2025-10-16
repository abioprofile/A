import NavBar from "@/components/partials/NavBar";
import Footer from "@/components/partials/Footer";
    

export default function VisitorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <div className="flex-1 ">
                {children}
            </div>
            {/* <Footer /> */}
        </div>
    );
}
