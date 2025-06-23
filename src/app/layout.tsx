import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'IdeaFlowAI',
  description: 'Transform your idea into a complete, LLM-driven application development workflow.',
  openGraph: {
    images: ['https://firebasestorage.googleapis.com/v0/b/ideaflow-ai-tt5i0.firebasestorage.app/o/ideaflow_ai_thumbnai.jpeg?alt=media&token=c18ef116-ef64-4947-b199-28f55fb1a9aa'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="font-body antialiased">
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
