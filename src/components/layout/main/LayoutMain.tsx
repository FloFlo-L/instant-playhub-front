import React, { ReactNode, useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import Footer from './Footer';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SwitchTheme } from '@/components/switch-theme';

interface LayoutProps {
  children: ReactNode;
}

const LayoutMain = ({ children }: LayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarRef = useRef<any>(null);

  const toggleCollapse = () => {
    if (isCollapsed) {
      sidebarRef.current?.expand();
    } else {
      sidebarRef.current?.collapse();
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup direction="horizontal" className='h-full'>
        <ResizablePanel
          ref={sidebarRef}
          defaultSize={20}
          minSize={13}
          maxSize={20}
          collapsible={true}
          collapsedSize={4}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
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
        <ResizablePanel defaultSize={80}>
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
