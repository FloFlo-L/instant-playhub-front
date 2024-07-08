import { ReactNode, useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import Footer from './Footer';
import { ScrollArea } from "@/components/ui/scroll-area"
import { SwitchTheme } from '@/components/switch-theme';

interface LayoutProps {
  children: ReactNode;
}

const LayoutMain = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const savedCollapsed = localStorage.getItem('isCollapsed');
    return savedCollapsed ? JSON.parse(savedCollapsed) : false;
  });

  const [sidebarSize, setSidebarSize] = useState<number>(() => {
    const savedSize = localStorage.getItem('sidebarSize');
    return savedSize ? Number(savedSize) : 20;
  });

  const sidebarRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('isCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    localStorage.setItem('sidebarSize', sidebarSize.toString());
  }, [sidebarSize]);

  const toggleCollapse = () => {
    if (isCollapsed) {
      sidebarRef.current?.expand();
    } else {
      sidebarRef.current?.collapse();
    }
    setIsCollapsed(!isCollapsed);
  };

  const handleResize = (size: number) => {
    setSidebarSize(size);
  };

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal" className='h-full'>
        <ResizablePanel
          ref={sidebarRef}
          defaultSize={sidebarSize}
          minSize={13}
          maxSize={20}
          collapsible={true}
          collapsedSize={4}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          onResize={handleResize}
          className={cn(isCollapsed && "min-w-[60px]", "transition-all duration-300 ease-in-out")}
        >
          <div className='flex flex-col justify-between h-full pb-2'>
            <Sidebar isCollapsed={isCollapsed} />
            <div className='flex justify-center'>
              <SwitchTheme isCollapsed={isCollapsed} />
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle isCollapsed={isCollapsed} onToggle={toggleCollapse} />
        <ResizablePanel defaultSize={100 - sidebarSize}>
          <ScrollArea className='h-full'>
            <div className="">
              {children}
              <Footer />
            </div>
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default LayoutMain;
