
import './styles/globals.css';
import { Footer, Sidebar, TopMenu } from '@/components';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen relative">
      <TopMenu />
      <Sidebar />
      <div className="px-0 sm:px-10 relative z-10">
        {children}
      </div>
      <Footer />
    </main>
  );
}