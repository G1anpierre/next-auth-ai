// app/providers.tsx
"use client";

import {useRouter} from "next/navigation";
import { HeroUIProvider } from "@heroui/react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <SessionProvider>{children}</SessionProvider>
    </HeroUIProvider>
  );
}
