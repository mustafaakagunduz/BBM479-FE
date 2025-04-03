import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, GraduationCap, Award, Compass, Briefcase, Layout, PenTool, Star } from 'lucide-react';

interface ProfessionMatch {
    id: number;
    professionId: number;
    professionName: string;
    matchPercentage: number;
}

interface CareerRoadmapProps {
    professionMatches: ProfessionMatch[];
}

const CareerRoadmap: React.FC<CareerRoadmapProps> = ({ professionMatches }) => {
  const [selectedProfession, setSelectedProfession] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<any>(null);

  // En yüksek uyum oranına sahip mesleği varsayılan olarak seç
  useEffect(() => {
    if (professionMatches && professionMatches.length > 0) {
      const sortedMatches = [...professionMatches].sort((a, b) => b.matchPercentage - a.matchPercentage);
      setSelectedProfession(sortedMatches[0].professionId.toString());
    }
  }, [professionMatches]);

  // Meslek değiştiğinde roadmap'i güncelle
  useEffect(() => {
    if (selectedProfession) {
      generateRoadmap(selectedProfession);
    }
  }, [selectedProfession]);

  // Roadmap'i oluştur
  const generateRoadmap = (professionId: string) => {
    const profession = professionMatches.find(p => p.professionId.toString() === professionId);
    
    if (!profession) return;

    // Her meslek için özel roadmap verileri
    const roadmapData: Record<string | number, any> = {
      // Yazılım Geliştirme / Mühendislik rolleri
      1: {
        title: "Yazılım Geliştirici Gelişim Planı",
        icon: <Layout className="h-6 w-6 text-indigo-500" />,
        shortTerm: [
          "Temel programlama dillerinden birinde (JavaScript, Python, Java) uzmanlık kazanın",
          "Git ve GitHub ile versiyon kontrolü öğrenin",
          "Küçük uygulama projeleri geliştirip portfolyonuza ekleyin",
          "Hackerrank veya LeetCode'da algoritmik problem çözme becerilerinizi geliştirin"
        ],
        midTerm: [
          "Birden fazla programlama dili ve framework öğrenin (React, Node.js, Django vb.)",
          "CI/CD ve test güdümlü geliştirme pratiklerini öğrenin",
          "Açık kaynak projelere katkı sağlayın",
          "Yazılım mimarisi desenleri üzerine çalışın"
        ],
        longTerm: [
          "Sistemleri ölçeklendirme, performans optimizasyonu becerileri geliştirin",
          "Ekip liderliği veya teknik liderlik rolü için çalışın",
          "Büyük ölçekli yazılım projesi yönetin",
          "Yazılım konferanslarında konuşmacı olun"
        ],
        resources: [
          { name: "freeCodeCamp", url: "https://www.freecodecamp.org" },
          { name: "The Odin Project", url: "https://www.theodinproject.com" },
          { name: "CS50x Harvard", url: "https://cs50.harvard.edu/x" },
          { name: "Frontend Masters", url: "https://frontendmasters.com" }
        ]
      },
      // Veri Bilimi rolleri
      2: {
        title: "Veri Bilimci Gelişim Planı",
        icon: <PenTool className="h-6 w-6 text-blue-500" />,
        shortTerm: [
          "Python, R ve temel istatistik bilgilerinizi güçlendirin",
          "Pandas, NumPy, Matplotlib kütüphanelerini öğrenin",
          "Kaggle'da veri bilimi yarışmalarına katılın",
          "SQL ve veri tabanı yönetimi konusunda uzmanlaşın"
        ],
        midTerm: [
          "Makine öğrenmesi algoritmaları ve modelleri üzerine derinleşin",
          "Derin öğrenme temelleri ve TensorFlow/PyTorch öğrenin",
          "Gerçek dünya veri setleri üzerinde projeler geliştirin",
          "Veri görselleştirme ve iletişim becerilerinizi geliştirin"
        ],
        longTerm: [
          "NLP, bilgisayarlı görü gibi uzmanlık alanları geliştirin",
          "MLOps ve model dağıtımı konusunda uzmanlaşın",
          "Veri bilimi ekibi yönetin",
          "Araştırma makaleleri yayınlayın veya konferanslarda sunum yapın"
        ],
        resources: [
          { name: "DataCamp", url: "https://www.datacamp.com" },
          { name: "Coursera - Data Science Specialization", url: "https://www.coursera.org/specializations/jhu-data-science" },
          { name: "Fast.ai", url: "https://www.fast.ai" },
          { name: "Kaggle", url: "https://www.kaggle.com" }
        ]
      },
      // İş Analistliği rolleri
      3: {
        title: "İş Analisti Gelişim Planı",
        icon: <Briefcase className="h-6 w-6 text-green-500" />,
        shortTerm: [
          "Temel iş analizi metodolojilerini ve dokümantasyon tekniklerini öğrenin",
          "SQL ve veri analizi araçlarını (Excel, Tableau) geliştirin",
          "Kullanıcı hikayeleri yazma ve gereksinimleri derleme konusunda pratik yapın",
          "Çevik yöntemler ve Scrum konusunda sertifika alın"
        ],
        midTerm: [
          "İş süreçleri modelleme ve optimizasyon tekniklerini öğrenin",
          "Paydaş yönetimi ve iletişim becerilerinizi geliştirin",
          "Proje yönetimi metodolojileri konusunda uzmanlaşın",
          "Power BI, Looker gibi BI araçlarında uzmanlaşın"
        ],
        longTerm: [
          "İş stratejisi ve sistem mimarisi planlamasında rol alın",
          "Kurumsal iş analizi uygulamalarını yönetin",
          "Dijital dönüşüm projelerinde liderlik rolü üstlenin",
          "İş analistliği topluluklarında mentor veya konuşmacı olun"
        ],
        resources: [
          { name: "IIBA (Uluslararası İş Analizi Kurumu)", url: "https://www.iiba.org" },
          { name: "BA Times", url: "https://www.batimes.com" },
          { name: "Coursera - Google Data Analytics", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
          { name: "LinkedIn Learning - Business Analysis Courses", url: "https://www.linkedin.com/learning/topics/business-analysis" }
        ]
      },
      // UI/UX Tasarım rolleri
      4: {
        title: "UI/UX Tasarımcı Gelişim Planı",
        icon: <Layout className="h-6 w-6 text-purple-500" />,
        shortTerm: [
          "Figma, Sketch veya Adobe XD gibi bir tasarım aracını kapsamlı şekilde öğrenin",
          "Kullanıcı araştırması ve kullanılabilirlik test teknikleri üzerine çalışın",
          "Temel tipografi, renk teorisi ve görsel hiyerarşi ilkelerini geliştirin",
          "Kişisel UI/UX portfolyosu oluşturun"
        ],
        midTerm: [
          "Etkileşim tasarımı, bilgi mimarisi ve kullanıcı akışı optimizasyonu konularında derinleşin",
          "Prototipleme ve mikro-animasyon becerileri geliştirin",
          "Design sprint ve tasarım düşünce süreçleri konusunda uzmanlaşın",
          "Erişilebilirlik standartları ve uygulamaları hakkında bilgi edinin"
        ],
        longTerm: [
          "Tasarım sistemleri oluşturma ve yönetme becerileri geliştirin",
          "Ürün yönetimi ve stratejisi konularında kendinizi geliştirin",
          "Tasarım ekibi liderliği pozisyonu için hazırlanın",
          "Tasarım konferanslarında konuşma yapın veya makaleler yayınlayın"
        ],
        resources: [
          { name: "Interaction Design Foundation", url: "https://www.interaction-design.org" },
          { name: "Nielsen Norman Group", url: "https://www.nngroup.com" },
          { name: "Dribbble", url: "https://dribbble.com" },
          { name: "UX Collective", url: "https://uxdesign.cc" }
        ]
      },
      // Ürün Yönetimi rolleri
      5: {
        title: "Ürün Yöneticisi Gelişim Planı",
        icon: <Compass className="h-6 w-6 text-amber-500" />,
        shortTerm: [
          "Temel ürün yönetimi konseptlerini ve metodolojilerini öğrenin",
          "Kullanıcı hikayeleri, kabul kriterleri ve roadmap planlama pratikleri geliştirin",
          "Çevik yöntemler ve Scrum/Kanban konusunda sertifika alın",
          "Pazar araştırması ve kullanıcı görüşmesi teknikleri öğrenin"
        ],
        midTerm: [
          "Ürün keşfi, MVP tanımlama ve hipotez test etme konularında uzmanlaşın",
          "Analitik araçları kullanarak veri odaklı karar verme becerilerinizi geliştirin",
          "Etkili stakeholder yönetimi ve iletişim stratejileri geliştirin",
          "Fiyatlandırma, konumlandırma ve ürün lansman stratejileri öğrenin"
        ],
        longTerm: [
          "Ürün portföyü ve strateji yönetimi becerilerinizi geliştirin",
          "Büyüme ve gelir odaklı ürün yönetimi pratikleri geliştirin",
          "Ürün organizasyonu lideri olarak çalışın",
          "Ürün yönetimi topluluklarında mentorluk veya konuşmacılık yapın"
        ],
        resources: [
          { name: "Product School", url: "https://www.productschool.com" },
          { name: "Mind the Product", url: "https://www.mindtheproduct.com" },
          { name: "Product Management Exercises", url: "https://www.productmanagementexercises.com" },
          { name: "Reforge", url: "https://www.reforge.com" }
        ]
      },
      // Diğer roller için varsayılan roadmap
      default: {
        title: "Kariyer Gelişim Planı",
        icon: <Star className="h-6 w-6 text-yellow-500" />,
        shortTerm: [
          "Alandaki temel becerileri ve araçları öğrenin",
          "Alan ile ilgili sertifikalar edinin",
          "Deneyimli profesyonellerden mentorluk alın",
          "Portfolyonuzu geliştirecek projeler üzerine çalışın"
        ],
        midTerm: [
          "Uzmanlık alanınızı derinleştirin",
          "Sektördeki en iyi uygulamaları öğrenin",
          "Daha kapsamlı projeler yönetin",
          "Alanınızdaki topluluklara katılın ve network oluşturun"
        ],
        longTerm: [
          "Liderlik becerileri geliştirin",
          "Alan içinde bir niş bulun ve uzmanlaşın",
          "Bilginizi paylaşacak platformlar oluşturun",
          "Sektörde tanınan bir uzman olmak için çalışın"
        ],
        resources: [
          { name: "Coursera", url: "https://www.coursera.org" },
          { name: "LinkedIn Learning", url: "https://www.linkedin.com/learning" },
          { name: "Udemy", url: "https://www.udemy.com" },
          { name: "edX", url: "https://www.edx.org" }
        ]
      }
    };

    // Eğer meslek için özel roadmap varsa onu kullan, yoksa varsayılanı kullan
    const professionRoadmap = roadmapData[professionId] || roadmapData.default;
    
    // Meslek adını roadmap'e ekle
    setRoadmap({
      ...professionRoadmap,
      professionName: profession.professionName,
      matchPercentage: profession.matchPercentage
    });
  };

  if (!professionMatches || professionMatches.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Kariyer Gelişim Planı</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Henüz meslek eşleşmesi bulunamadı.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Kariyer Gelişim Planı
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
        <div>
  <label htmlFor="profession-select" className="block text-sm font-medium text-gray-700 mb-1">
    Meslek Seçin
  </label>
  <select
    id="profession-select"
    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    value={selectedProfession || ""}
    onChange={(e) => setSelectedProfession(e.target.value)}
  >
    <option value="" disabled>Meslek seçin</option>
    {professionMatches.map((profession) => (
      <option 
        key={profession.professionId} 
        value={profession.professionId.toString()}
      >
        {profession.professionName} ({profession.matchPercentage.toFixed(1)}% Uyum)
      </option>
    ))}
  </select>
</div>          {roadmap && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  {roadmap.icon}
                  <div>
                    <h3 className="font-bold text-lg">{roadmap.professionName}</h3>
                    <p className="text-gray-600">Uyum: {roadmap.matchPercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="short-term" className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="short-term" className="flex items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>Kısa Vade (0-1 Yıl)</span>
                  </TabsTrigger>
                  <TabsTrigger value="mid-term" className="flex items-center">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    <span>Orta Vade (1-3 Yıl)</span>
                  </TabsTrigger>
                  <TabsTrigger value="long-term" className="flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    <span>Uzun Vade (3+ Yıl)</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="short-term" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Kısa Vadeli Hedefler (0-1 Yıl)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {roadmap.shortTerm.map((goal: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="mid-term" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Orta Vadeli Hedefler (1-3 Yıl)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {roadmap.midTerm.map((goal: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="long-term" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Uzun Vadeli Hedefler (3+ Yıl)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {roadmap.longTerm.map((goal: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-2">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Önerilen Kaynaklar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {roadmap.resources.map((resource: {name: string, url: string}, index: number) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="mr-3 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{resource.name}</p>
                          <a 
                            href={resource.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            Kaynağa Git
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerRoadmap;