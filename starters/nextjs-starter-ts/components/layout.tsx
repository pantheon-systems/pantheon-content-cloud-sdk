import Footer from "./footer";
import Header from "./header";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden min-w-screen max-w-screen">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
}
