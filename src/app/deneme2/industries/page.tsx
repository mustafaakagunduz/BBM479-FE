// app/admin/industries/page.tsx
"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from 'lucide-react';

export default function IndustriesPage() {
    const [newIndustry, setNewIndustry] = useState('');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Endüstri Yönetimi</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <Label htmlFor="industry">Yeni Endüstri</Label>
                            <Input
                                id="industry"
                                value={newIndustry}
                                onChange={(e) => setNewIndustry(e.target.value)}
                                placeholder="Endüstri adı giriniz"
                            />
                        </div>
                        <Button className="mt-6">
                            <Plus className="mr-2 h-4 w-4" />
                            Ekle
                        </Button>
                    </div>
                    <div className="border rounded-lg p-4">
                        <p className="text-gray-500">Henüz endüstri eklenmemiş</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}