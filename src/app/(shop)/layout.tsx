import Image from 'next/image';
import { Footer, Sidebar, TopMenu } from '@/components';
import { Menu } from '@/app/(shop)/menu/MenuDay';

export default function ShopLayout({ children }: { children: React.ReactNode; }) {
  return (
    <main className="min-h-screen relative">
      {/* Imagen de fondo */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Image
          src="/imgs/marmol-background.jpg"
          alt="Starman"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>

      {/* Contenido */}
      <TopMenu />
      <Sidebar />
      <div className="px-0 sm:px-10 relative z-10">
        {children}
      </div>
  
      <Footer />

  
    </main>
    
  );
}