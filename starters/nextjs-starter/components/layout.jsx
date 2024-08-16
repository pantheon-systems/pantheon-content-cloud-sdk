import Footer from "./footer";
import Header from "./header";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden min-w-screen max-w-screen">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
}
