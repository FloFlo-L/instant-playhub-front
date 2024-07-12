import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const LayoutMain = ({ children }: LayoutProps) => {
  return (
    <>
      <Sidebar />
      <div className='sm:pl-14'>
        {children}
          <Footer />
      </div>
    </>
  );
}

export default LayoutMain;
