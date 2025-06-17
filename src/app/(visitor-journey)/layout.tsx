import NavBar from "@/components/partials/NavBar";
import Footer from "@/components/partials/Footer";


export default function VisitorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main>
            <NavBar />
            <div className="mt-28">
                {children}
                <Footer />
            </div>
        </main>
    );
}
