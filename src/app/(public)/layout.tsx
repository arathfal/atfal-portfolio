import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed top-4 left-4 z-[100] -translate-y-24 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground transition-transform focus:translate-y-0"
      >
        Skip to Main Content
      </a>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div
          id="main-content"
          tabIndex={-1}
          className="flex-1 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
        >
          {children}
        </div>
        <Footer />
      </div>
    </>
  );
}
