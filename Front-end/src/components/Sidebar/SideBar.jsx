import React, { useState } from 'react';
import {
  BadgeCheck,
  Bell,
  LandPlot,
  ChevronRight,
  ChevronsUpDown,
  Command,
  CreditCard,
  LogOut,
  Sparkles,
  Users,
  Shield,
  Grid,
  User,
  Package,
  Layers,
  Database,
  Truck
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { useUserContext } from '../../context/UserContext';

const SideBar = () => {
  const { logout, user } = useUserContext();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Gestion des utilisateurs",
        icon: Users,
        isActive: true,
        items: [
          { 
            title: "Utilisateurs",
            icon: User,
            url: "/dash/Create-User",
          },
          { 
            title: "Rôles",
            icon: Shield,
            url:'/dash/Gestion-des-roles'
          }
        ],
      },
      {
        title: "Gestion des Espaces",
        icon: Layers,
        isActive: true,
        items: [
          { 
            title: "Zones",
            icon: LandPlot,
            url: "/dash/zones",
          },
          { 
            title: "Tables",
            icon: Grid,
            url:'#'
          },
          
        ],
      },
      {
        title: "Gestion des Stocks",
        icon: Package,
        isActive: true,
        items: [
          { 
            title: "Stockage",
            icon: Database,
            url: "/dash/Storage",
          },
          { 
            title: "Fournisseurs",
            icon: Truck,
            url:'/dash/Supliers'
          },
          
        ],
      },
    ],
    
  }

  // Function to handle navigation
  const handleNavigation = (url, e) => {
    if (url) {
      e.stopPropagation(); // Prevent collapsible from toggling when clicking a link
      window.location.href = url;
    }
  };

  // Recursive function to render menu items
  const renderMenuItem = (item) => {
    const [isOpen, setIsOpen] = useState(item.isActive);
    const hasSubMenu = (item.items?.length > 0 || item.subItems?.length > 0);

    return (
      <Collapsible 
        key={item.title} 
        asChild 
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SidebarMenuItem>
          <div className="flex w-full items-center">
            <SidebarMenuButton 
              asChild={!!item.url}
              tooltip={item.title}
              className="flex-1"
              onClick={(e) => {
                if (item.url) {
                  handleNavigation(item.url, e);
                } else if (hasSubMenu) {
                  setIsOpen(!isOpen);
                }
              }}
            >
              {item.url ? (
                <a href={item.url}>
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                </a>
              ) : (
                <div className="flex items-center">
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  <span>{item.title}</span>
                </div>
              )}
            </SidebarMenuButton>
            
            {hasSubMenu && (
              <CollapsibleTrigger asChild>
                <SidebarMenuAction 
                  className={`transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <ChevronRight />
                  <span className="sr-only">Toggle</span>
                </SidebarMenuAction>
              </CollapsibleTrigger>
            )}
          </div>

          {hasSubMenu && (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items?.map((subItem) => renderMenuItem(subItem))}
                {item.subItems?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton 
                      asChild
                      onClick={(e) => handleNavigation(subItem.url, e)}
                    >
                      <a href={subItem.url}>
                        {subItem.icon && <subItem.icon className="h-4 w-4" />}
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Ayoub-Alae</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => renderMenuItem(item))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">user.username</span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={data.user.avatar} alt={data.user.name} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">user.username</span>
                      <span className="truncate text-xs">{data.user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Sparkles />
                    Upgrade to Pro
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <BadgeCheck />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default SideBar