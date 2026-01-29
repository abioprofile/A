import NavBar from "@/components/partials/NavBar";
export default function VisitorLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            {/* <NavBar /> */}
            <div className=" ">
                {children}
            </div>
        </div>
    );
}
