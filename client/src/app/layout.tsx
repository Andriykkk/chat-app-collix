import { Toaster } from "@/components/ui/toaster";
import SessionProviderWrapper from "@/providers/session-provider-wrapper";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/providers/userProvider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Collix",
  description:
    "Beautiful and very usefull collaboration tool",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang='en'>
      <body className={font.className}>
        <SessionProviderWrapper session={session}>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
