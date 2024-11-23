// app/admin/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function AdminPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl mb-4">Admin Paneline Hoş Geldiniz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mt-8" >
                <p className="text-lg">Bu panelde yapabilecekleriniz:</p>
                <ul className="space-y-2 list-disc pl-6">
                    <li><span className="font-medium">Endüstriler:</span> Sistem için yeni endüstriler ekleyebilir ve mevcut endüstrileri yönetebilirsiniz.</li>
                    <li><span className="font-medium">Yetenekler:</span> Kullanıcıların seçebileceği yetenekleri ekleyebilir ve düzenleyebilirsiniz.</li>
                    <li><span className="font-medium">Meslekler:</span> Sistemdeki meslekleri tanımlayabilir ve yönetebilirsiniz.</li>
                    <li><span className="font-medium">Anketler:</span> Yeni anketler oluşturabilir ve mevcut anketleri düzenleyebilirsiniz.</li>
                    <li><span className="font-medium">Yetkiler:</span> Kullanıcı yetkilerini belirleyebilir ve yönetebilirsiniz.</li>
                </ul>
                <p className="mt-4 text-gray-600">Başlamak için soldaki menüden bir bölüm seçin.</p>
            </CardContent>
        </Card>
    );
}