"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Button, ScrollShadow } from "@heroui/react";

export const OpenClose = ({
  children,
  toggleSideBar,
}: {
  children: React.ReactNode;
  toggleSideBar: () => void;
}) => {
  return (
    <div className="w-full flex-1 flex-col p-4">
      <header className="flex items-center gap-3 rounded-medium border-small border-divider p-4">
        <Button isIconOnly size="sm" variant="light" onPress={toggleSideBar}>
          <Icon
            className="text-default-500"
            height={24}
            icon="solar:sidebar-minimalistic-outline"
            width={24}
          />
        </Button>
        <h2 className="text-medium font-medium text-default-700">Overview</h2>
      </header>
      <main className="mt-4 w-full h-[90%] max-h-[90%]">
        <div className="flex w-full h-full flex-col gap-4 rounded-medium border-small border-divider">
          <ScrollShadow className=" h-full">{children}</ScrollShadow>
        </div>
      </main>
    </div>
  );
};
