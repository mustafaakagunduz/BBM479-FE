"use client"
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Factory, Brain, Briefcase, FileSpreadsheet, Shield } from 'lucide-react';

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === `/deneme2${path}`;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-purple-600 min-h-screen p-4">
                    <Button
                        variant={isActive('') ? "default" : "ghost"}  // ana sayfa için path boş
                        className="w-full justify-start text-white hover:text-purple-600 text-lg"
                        onClick={() => router.push('/deneme2')}
                    >
                        Survey Admin Panel
                    </Button>
                    <nav className="space-y-4 mt-8">
                        <Button
                            variant={isActive('/industries') ? "default" : "ghost"}
                            className="w-full justify-start text-white hover:text-purple-600 text-lg"
                            onClick={() => router.push('/deneme2/industries')}
                        >
                            <Factory className="mr-3 h-5 w-5" />
                            Endüstriler
                        </Button>
                        <Button
                            variant={isActive('/skills') ? "default" : "ghost"}
                            className="w-full justify-start text-white hover:text-purple-600 text-lg"
                            onClick={() => router.push('/deneme2/skills')}
                        >
                            <Brain className="mr-3 h-5 w-5" />
                            Yetenekler
                        </Button>
                        <Button
                            variant={isActive('/professions') ? "default" : "ghost"}
                            className="w-full justify-start text-white hover:text-purple-600 text-lg"
                            onClick={() => router.push('/deneme2/professions')}
                        >
                            <Briefcase className="mr-3 h-5 w-5" />
                            Meslekler
                        </Button>
                        <Button
                            variant={isActive('/surveys') ? "default" : "ghost"}
                            className="w-full justify-start text-white hover:text-purple-600 text-lg"
                            onClick={() => router.push('/deneme2/surveys')}
                        >
                            <FileSpreadsheet className="mr-3 h-5 w-5" />
                            Anketler
                        </Button>
                        <Button
                            variant={isActive('/permissions') ? "default" : "ghost"}
                            className="w-full justify-start text-white hover:text-purple-600 text-lg"
                            onClick={() => router.push('/deneme2/permissions')}
                        >
                            <Shield className="mr-3 h-5 w-5" />
                            Yetkiler
                        </Button>
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}