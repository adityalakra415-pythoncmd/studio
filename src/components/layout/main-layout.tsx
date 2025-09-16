"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  BookOpenCheck,
  LayoutDashboard,
  LogOut,
  FileQuestion,
  Settings,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/icons/logo';
import { Header } from '@/components/dashboard/header';
import { Footer } from '@/components/layout/footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex flex-1">
          {isClient && (
            <Sidebar className="border-r bg-sidebar">
              <SidebarHeader>
                <div className="flex items-center gap-2.5">
                  <Logo className="w-8 h-8 text-primary" />
                  <h1 className="text-xl font-bold">DragonAI</h1>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <Link href="/">
                      <SidebarMenuButton isActive={pathname === '/'}>
                        <LayoutDashboard />
                        <span>{t('sidebar').dashboard}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/study-plan">
                      <SidebarMenuButton isActive={pathname === '/study-plan'}>
                        <BookOpenCheck />
                        <span>{t('sidebar').studyPlan}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/quizzes">
                      <SidebarMenuButton isActive={pathname === '/quizzes'}>
                        <FileQuestion />
                        <span>{t('sidebar').quizzes}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="justify-start w-full gap-2 p-2 h-14"
                    >
                      <Avatar>
                        {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" data-ai-hint={userAvatar.imageHint} />}
                        <AvatarFallback>S</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="font-semibold">{t('sidebar').student}</p>
                        <p className="text-xs text-muted-foreground">
                          student@email.com
                        </p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mb-2 w-56">
                    <DropdownMenuItem>
                      <User className="w-4 h-4 mr-2" />
                      {t('sidebar').profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      {t('sidebar').settings}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('sidebar').logOut}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarFooter>
            </Sidebar>
          )}
          <SidebarInset>
            <Header />
            {children}
          </SidebarInset>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
}
