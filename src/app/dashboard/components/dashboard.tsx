"use client";

import React from "react";
import { Avatar, Button, ScrollShadow, Spacer } from "@heroui/react";
import { Icon } from "@iconify/react";
import { cn, Link } from "@heroui/react";

import { sectionItemsWithTeams } from "./sidebar-items";

import Sidebar from "./sidebar";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/sign-out";
import { Session } from "next-auth";
import { OpenClose } from "./open-close";

export const Dashboard = ({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) => {
  const [isHidden, setIsHidden] = React.useState(false);
  const pathname = usePathname();
  const currentPath = pathname.split("/")?.[1];

  const toggleSidebar = () => {
    setIsHidden(!isHidden);
  };

  return (
    <div className="flex w-full h-dvh">
      <div
        className={cn(
          "relative flex h-full w-72 max-w-[288px] flex-1 flex-col !border-r-small border-divider p-6 transition-[transform,opacity,margin] duration-250 ease-in-out",
          {
            "-ml-72 -translate-x-72": isHidden,
          }
        )}
      >
        <div className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground">
            <Icon className="text-background" icon="solar:wallet-line-duotone" width={24} />
          </div>
          <Link
            href="/"
            >
          <span className="text-small font-bold uppercase">Acme</span>
          </Link>
        </div>
        <Spacer y={8} />
        <div className="flex items-center gap-3 px-3">
          <Avatar isBordered size="sm" src={session?.user?.image || ""} />
          <div className="flex flex-col">
            <p className="text-small font-medium text-default-600">{session?.user?.name}</p>
            <p className="text-tiny text-default-400">{session?.user?.email}</p>
          </div>
        </div>
        <ScrollShadow className="-mr-6 h-full max-h-full py-6 pr-6">
          <Sidebar
            defaultSelectedKey="dashboard"
            items={sectionItemsWithTeams}
            selectedKeys={[currentPath]}
            onSelect={(key) => {
              console.log("key", key);
            }}
          />
        </ScrollShadow>
        <Spacer y={8} />
        <div className="mt-auto flex flex-col">
          <Button
            fullWidth
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={
              <Icon className="text-default-500" icon="solar:info-circle-line-duotone" width={24} />
            }
            variant="light"
          >
            Help & Information
          </Button>
          <Button
            className="justify-start text-default-500 data-[hover=true]:text-foreground"
            startContent={
              <Icon
                className="rotate-180 text-default-500"
                icon="solar:minus-circle-line-duotone"
                width={24}
              />
            }
            variant="light"
            onPress={async () => await signOut()}
          >
            Log Out
          </Button>
        </div>
      </div>
      <OpenClose toggleSideBar={toggleSidebar}>
        {children}
      </OpenClose>
    </div>
  );
};
