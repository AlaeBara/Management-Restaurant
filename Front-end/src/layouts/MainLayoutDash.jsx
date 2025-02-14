import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SideBar from "../components/Sidebar/SideBar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
  
export default function MainLayout({ children }) {
    const navigate = useNavigate();
    const isHomePath = location.pathname === '/dash/Home';
    const { user } = useUserContext();

    return (
        <SidebarProvider>
            <SideBar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#"></BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage></BreadcrumbPage>
                            </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-2 ml-auto px-5 cursor-pointer" onClick={() => {
                        navigate('/dash/profile');
                    }}>
                        <span className="text-sm font-medium">{user.username}</span>
                        <Avatar>    
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                </header>
                <div className={`flex flex-1 flex-col gap-4 p-4 pt-0 ${isHomePath ? 'bg-[#f9f9f8]' : ''}`}>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}