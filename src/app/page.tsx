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
import { ProgressOverview } from '@/components/dashboard/progress-overview';
import { ContentUpload } from '@/components/dashboard/content-upload';
import { StudyPlan } from '@/components/dashboard/study-plan';
import { QuizSection } from '@/components/dashboard/quiz-section';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function DashboardPage() {
  const userAvatar = PlaceHolderImages.find((p) => p.id === 'user-avatar');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
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
                <SidebarMenuButton isActive>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <BookOpenCheck />
                  <span>Study Plan</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FileQuestion />
                  <span>Quizzes</span>
                </SidebarMenuButton>
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
                    <p className="font-semibold">Student</p>
                    <p className="text-xs text-muted-foreground">
                      student@email.com
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mb-2 w-56">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid w-full max-w-screen-xl grid-cols-1 gap-6 mx-auto lg:grid-cols-12">
              <div className="lg:col-span-8">
                <ProgressOverview />
              </div>
              <div className="lg:col-span-4">
                <ContentUpload />
              </div>
              <div className="lg:col-span-7">
                <StudyPlan />
              </div>
              <div className="lg:col-span-5">
                <QuizSection />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
