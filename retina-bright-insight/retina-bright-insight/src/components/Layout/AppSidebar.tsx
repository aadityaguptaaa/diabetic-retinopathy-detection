import { useState } from "react";
import { 
  Home, 
  Upload, 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  Eye,
  LogOut 
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const patientItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Upload Image", url: "/upload", icon: Upload },
    { title: "My Reports", url: "/reports", icon: FileText },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const clinicianItems = [
    { title: "Dashboard", url: "/clinician-dashboard", icon: Home },
    { title: "Patients", url: "/patients", icon: Users },
    { title: "Batch Upload", url: "/batch-upload", icon: Upload },
    { title: "Reports", url: "/clinician-reports", icon: FileText },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/admin-dashboard", icon: Home },
    { title: "Users", url: "/admin-users", icon: Users },
    { title: "Analytics", url: "/admin-analytics", icon: BarChart3 },
    { title: "System", url: "/admin-system", icon: Settings },
  ];

  const getItems = () => {
    switch (user?.role) {
      case 'clinician':
        return clinicianItems;
      case 'admin':
        return adminItems;
      default:
        return patientItems;
    }
  };

  const items = getItems();

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-gradient-card">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                RetinaAI
              </span>
            )}
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? "bg-primary text-primary-foreground shadow-sm" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-3'}`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}