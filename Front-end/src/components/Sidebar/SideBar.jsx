import React, { useState, useEffect } from 'react';
import style from './SideBar.module.css'
import {
  ShoppingCart,
  SquareMenu ,
  Utensils,
  Tag,
  BadgeCheck,
  Bell,
  LandPlot,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Command,
  CreditCard,
  LogOut,
  Sparkles,
  Users,
  Cog,
  Shield,
  Grid,
  Gift,
  User,
  Package,
  Layers,
  Database,
  Truck,
  FolderOpen,
  Boxes,
  ShoppingBag,
  Component,
  ClipboardList,
  ArrowLeftRight,
  Wallet,
  DollarSign,
  Shuffle,
  Clock
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
} from "@/components/ui/sidebar";

import { useUserContext } from '../../context/UserContext';

const SideBar = () => {
  const { logout, user } = useUserContext();

  const data = {
    user: {
      name: user?.username || "User",
      email: user?.email || "user@example.com",
      avatar: user?.avatar || "/default-avatar.jpg",
    },
    navMain: [
      {
        title: "Comptes et Access",
        icon: Users,
        permissions: ["access-granted", "view-users", "view-roles"],
        items: [
          {
            title: "Personnels",
            icon: User,
            url: "/dash/Create-User",
            permissions: ["access-granted", "view-users"],
          },
          {
            title: "Rôles",
            icon: Shield,
            url: '/dash/Gestion-des-roles',
            permissions: ["access-granted", "view-roles"],
          }
        ],
      },
      {
        title: "Gestion des Espaces",
        icon: Layers,
        permissions: ["access-granted", "view-zones", "view-tables", "view-storages"],
        items: [
          {
            title: "Zones",
            icon: LandPlot,
            url: "/dash/zones",
            permissions: ["access-granted", "view-zones"],
          },
          {
            title: "Tableaux",
            icon: Grid,
            url: '/dash/Tables',
            permissions: ["access-granted", "view-tables"],
          },
          {
            title: "Places de Stock",
            icon: Database,
            url: "/dash/Storage",
            permissions: ["access-granted", "view-storages"],
          },
        ],
      },
      // {
      //   title: "Gestion Fournisseurs",
      //   icon: Package,
      //   permissions: ["access-granted", "view-suppliers"],
      //   items: [
      //     {
      //       title: "Fournisseurs",
      //       icon: Truck,
      //       url: '/dash/Supliers',
      //       permissions: ["access-granted", "view-suppliers"],
      //     },
      //   ],
      // },
      {
        title: "Gestion des Produits",
        icon: FolderOpen,
        permissions: ["access-granted", "view-products", "view-categories", "view-inventories"],
        items: [
          {
            title: "Categories",
            icon: Component,
            url: "/dash/categories-Produits",
            permissions: ["access-granted", "view-categories"],
          },
          {
            title: "Produits",
            icon: ShoppingBag,
            url: "/dash/Produits",
            permissions: ["access-granted", "view-products"],
          },
          {
            title: "Inventaires",
            icon: ClipboardList,
            url: "/dash/inventaires",
            permissions: ["access-granted", "view-inventories"],
          },
          {
            title: "Transfert",
            icon: ArrowLeftRight,
            url: "/dash/transfert",
            permissions: ["access-granted", "view-inventories"],
          },
        ],
      },
      {
        title: "Gestion des finances",
        icon: CreditCard,
        permissions: ["access-granted", "view-finance"],
        items: [
          {
            title: "Caisses",
            icon: Wallet,
            url: "/dash/caisses",
            permissions: ["access-granted", "view-funds"],
          },
          {
            title: "Opérations",
            icon: Shuffle,
            url: "/dash/opérations",
            permissions: ["access-granted", "view-funds-operations"],
          },
          {
            title: "Dépenses",
            icon: DollarSign,
            url: "/dash/dépenses",
            permissions: ["access-granted", "view-funds-operations"],
          },
          {
            title: "Transfert",
            icon: ArrowLeftRight,
            url: "/dash/transfert-operations",
            permissions: ["access-granted", "view-funds-operations"],
          },
        ],
      },
      {
        title: "Gestion des sessions",
        icon: Clock,
        permissions: ["access-granted","start-shift-by-waiter"],
        items: [
          {
            title: "sessions",
            icon: Clock,
            url: "/dash/quarts",
            permissions: ["access-granted","start-shift-by-waiter"],
          }
        ],
      },
      {
        title: "Paramètres",
        icon: Cog,
        permissions: ["access-granted","view-units"],
        items: [
          {
            title: "Unités",
            icon: Boxes,
            url: "/dash/Units",
            permissions: ["access-granted", "view-units"],
          },
        ],
      },
      {
        title: "Achats",
        icon:  ShoppingCart,
        permissions: ["access-granted","view-units"],
        items: [
          {
            title: "Fournisseurs",
            icon: Truck,
            url: '/dash/Supliers',
            permissions: ["access-granted", "view-suppliers"],
          },
          {
            title: "Bon Achats",
            icon:  FileText,
            url: "/dash/achats",
            permissions: ["access-granted", "view-units"],
          },
        ],
      },
      {
        title: "Gestion du Menu",
        icon:  SquareMenu,
        permissions: ["access-granted","view-units"],
        items: [
          {
            title: "Tags",
            icon:  Tag ,
            url: "/dash/tags",
            permissions: ["access-granted", "view-units"],
          },
          {
            title: "Code Promo",
            icon:  Gift,
            url: "/dash/code-promo",
            permissions: ["access-granted", "view-units"],
          },
          {
            title: "Produits du Menu",
            icon:  Utensils ,
            url: "/dash/produits-menu",
            permissions: ["access-granted", "view-units"],
          },
        ],
      },
    ],
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission);
  };

  const handleNavigation = (url, e) => {
    if (url) {
      e.stopPropagation();
      window.location.href = url;
    }
  };

  const renderMenuItem = (item) => {
    // Check main menu item permissions
    const hasMainPermission = !item.permissions ||
      item.permissions.some(permission => hasPermission(permission));

    // Filter sub-items based on permissions
    const filteredItems = item.items?.filter(subItem =>
      !subItem.permissions ||
      subItem.permissions.some(permission => hasPermission(permission))
    ) || [];

    // Don't render if no permissions or no sub-items
    if (!hasMainPermission || (item.items && filteredItems.length === 0)) {
      return null;
    }

    // Persistent menu state logic
    const isPersistentMenu = item.title.includes('Gestion');
    const [isOpen, setIsOpen] = useState(() => {
      if (isPersistentMenu) {
        const savedState = localStorage.getItem(`submenu-${item.title}`);
        return savedState ? JSON.parse(savedState) : false;
      }
      return false;
    });

    useEffect(() => {
      if (isPersistentMenu) {
        localStorage.setItem(`submenu-${item.title}`, JSON.stringify(isOpen));
      }
    }, [isOpen, item.title, isPersistentMenu]);

    const hasSubMenu = (filteredItems.length > 0);

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
                {filteredItems.map((subItem) => renderMenuItem(subItem))}
              </SidebarMenuSub>
            </CollapsibleContent>
          )}
        </SidebarMenuItem>
      </Collapsible>
    );
  };

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
      <SidebarContent className={style.addd}>
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
                    <AvatarFallback className="rounded-lg">
                      {data.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{data.user.name}</span>
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
                      <AvatarFallback className="rounded-lg">
                        {data.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{data.user.name}</span>
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
  );
};

export default SideBar;