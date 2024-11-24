'use client'

import { usePathname } from 'next/navigation'

import { SearchForm } from "@/components/search-form"
import { VersionSwitcher } from "@/components/version-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.0"],
  navMain: [
    {
      title: "AI",
      url: "/",
      items: [
        {
          title: "Content Generator",
          url: "/ai/content-generator",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const path = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {
          data.navMain.map((item) => (

            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {
                    item.items.map((item) => (

                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={path === item.url}>
                          <a href={item.url}>
                            {item.title}
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                    ))
                  }
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

          ))
        }
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
