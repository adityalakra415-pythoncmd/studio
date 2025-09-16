
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
  LogIn
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
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { useAuth } from '@/context/auth-context';
import { signInWithGoogle, signOut } from '@/lib/auth';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const UserProfile = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="justify-start w-full gap-2 p-2 h-14"
            >
              <Avatar>
                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                <AvatarFallback>{user.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-left group-data-[collapsible=icon]:hidden">
                <p className="font-semibold">{user.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {user.email}
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
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              {t('sidebar').logOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Button onClick={signInWithGoogle} variant="outline" className="w-full">
        <LogIn className="w-4 h-4 mr-2" />
        Sign in with Google
      </Button>
    )
  }

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
                      <SidebarMenuButton tooltip={t('sidebar').dashboard} isActive={pathname === '/'}>
                        <LayoutDashboard />
                        <span>{t('sidebar').dashboard}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/study-plan">
                      <SidebarMenuButton tooltip={t('sidebar').studyPlan} isActive={pathname === '/study-plan' || pathname.startsWith('/study/')}>
                        <BookOpenCheck />
                        <span>{t('sidebar').studyPlan}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Link href="/quizzes">
                      <SidebarMenuButton tooltip={t('sidebar').quizzes} isActive={pathname === '/quizzes'}>
                        <FileQuestion />
                        <span>{t('sidebar').quizzes}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                <UserProfile />
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
