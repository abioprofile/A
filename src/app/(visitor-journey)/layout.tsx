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
            <div className="flex-1 overflow-y-auto mt-5 lg:mt-28">
                {children}
            </div>
            <Footer />
        </div>
    );
}
