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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Bell, X } from "lucide-react"; 

  
export default function MainLayout({ children }) {
    const navigate = useNavigate();
    const isHomePath = location.pathname === '/dash/Home';
    const { user } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);

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

                    <div className="flex items-center gap-2 ml-auto px-5">
                        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <div className="relative">
                                        <Bell className="h-5 w-5 text-gray-600" />
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                                            2
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 mr-7 p-0">
                                <div className="bg-[#2d3748] p-4 flex justify-between items-center">
                                    <h3 className="text-md text-white font-semibold ">Notifications</h3>
                                    <X className="w-4 h-4 text-white" onClick={() => setIsOpen(false)} />
                                </div>
                                <div className="px-2 py-5">
                                    <div className="space-y-2">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <p className="text-sm">You have a new message from John Doe.</p>
                                        </div>
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <p className="text-sm">Your order has been shipped.</p>
                                        </div>
                                    </div>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>




                </header>
                <div className={`flex flex-1 flex-col gap-4 p-4 pt-0 ${isHomePath ? 'bg-[#f9f9f8]' : ''}`}>
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}