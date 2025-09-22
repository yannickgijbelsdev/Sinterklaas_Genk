import React from 'react';
import { Clock, Users, Star, Heart, Music, Gift } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { SparkleBackground } from '../components/SparkleBackground';
import { LiveEditor } from '../components/LiveEditor';
import { showInfo } from '../data/mock';
import { useContent, getContentValue } from '../hooks/useApi';

export default function About() {
  const { data: contentData } = useContent();

  // Get dynamic content with fallbacks
  const pageTitle = getContentValue(contentData, 'about', 'title', 'Over De Show');
  const pageSubtitle = getContentValue(contentData, 'about', 'subtitle', 'Ontdek waarom onze Sinterklaas show de meest magische ervaring van het jaar is. Een perfecte mix van traditie, muziek en plezier voor het hele gezin.');
  const storyTitle = getContentValue(contentData, 'about', 'story_title', 'Het Verhaal');
  const storyContent1 = getContentValue(contentData, 'about', 'story_content1', 'Elke december komt Sinterklaas vanuit Spanje naar Nederland om alle brave kinderen te bezoeken. Maar dit jaar heeft hij een extra verrassing: een spectaculaire theatershow vol muziek, dans en natuurlijk zijn trouwe helpers.');
  const storyContent2 = getContentValue(contentData, 'about', 'story_content2', 'Onze show vertelt het verhaal van hoe Sinterklaas en zijn Pieten zich voorbereiden op het Sinterklaasfeest. Van het inpakken van cadeautjes tot het oefenen van nieuwe liedjes - je bent getuige van alle voorbereidingen!');
  const storyContent3 = getContentValue(contentData, 'about', 'story_content3', 'Met prachtige kostuums, live muziek en interactieve momenten waar kinderen kunnen meedoen, wordt dit een onvergetelijke ervaring die het hele gezin zal koesteren.');
  const aboutImage = getContentValue(contentData, 'about', 'hero_image', showInfo.heroImage);
  
  const detailsTitle = getContentValue(contentData, 'about', 'details_title', 'Show Details');
  const detailsSubtitle = getContentValue(contentData, 'about', 'details_subtitle', 'Alles wat je moet weten over onze voorstelling');
  
  const featuresTitle = getContentValue(contentData, 'about', 'features_title', 'Wat Maakt Het Bijzonder?');
  const featuresSubtitle = getContentValue(contentData, 'about', 'features_subtitle', 'Ontdek waarom onze show zo geliefd is bij families');
  
  const ctaTitle = getContentValue(contentData, 'about', 'cta_title', 'Klaar Voor De Magie?');
  const ctaSubtitle = getContentValue(contentData, 'about', 'cta_subtitle', 'Boek nu je tickets en beleef samen met je familie de meest magische Sinterklaas show ooit!');

  const features = [
    {
      icon: <Music className="text-red-600" size={32} />,
      title: "Interactieve Liedjes",
      description: "Zing en dans mee met bekende Sinterklaasliedjes en nieuwe melodieën die speciaal voor onze show zijn geschreven."
    },
    {
      icon: <Gift className="text-green-600" size={32} />,
      title: "Verrassingen",
      description: "Vol met magische momenten, grappige sketches en natuurlijk de traditionele cadeautjesuitdeling."
    },
    {
      icon: <Heart className="text-pink-600" size={32} />,
      title: "Voor Het Hele Gezin",
      description: "Een show die ouders en kinderen samen kunnen genieten, vol warmte en gezelligheid."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Over De Show</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ontdek waarom onze Sinterklaas show de meest magische ervaring van het jaar is. 
              Een perfecte mix van traditie, muziek en plezier voor het hele gezin.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Het Verhaal</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Elke december komt Sinterklaas vanuit Spanje naar Nederland om alle brave kinderen 
                  te bezoeken. Maar dit jaar heeft hij een extra verrassing: een spectaculaire 
                  theatershow vol muziek, dans en natuurlijk zijn trouwe helpers.
                </p>
                <p>
                  Onze show vertelt het verhaal van hoe Sinterklaas en zijn Pieten zich voorbereiden 
                  op het Sinterklaasfeest. Van het inpakken van cadeautjes tot het oefenen van nieuwe 
                  liedjes - je bent getuige van alle voorbereidingen!
                </p>
                <p>
                  Met prachtige kostuums, live muziek en interactieve momenten waar kinderen kunnen 
                  meedoen, wordt dit een onvergetelijke ervaring die het hele gezin zal koesteren.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src={showInfo.heroImage}
                alt="Sinterklaas Show"
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-500" size={20} />
                  <span className="font-semibold text-gray-900">Familievriendelijk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Show Details</h2>
            <p className="text-xl text-gray-600">Alles wat je moet weten over onze voorstelling</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Clock className="mx-auto mb-4 text-red-600" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Duur</h3>
                <p className="text-gray-600">{showInfo.duration}</p>
                <p className="text-sm text-gray-500 mt-2">Inclusief 15 minuten pauze</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Users className="mx-auto mb-4 text-green-600" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Leeftijd</h3>
                <p className="text-gray-600">{showInfo.ageRange}</p>
                <p className="text-sm text-gray-500 mt-2">Perfect voor jonge gezinnen</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <Star className="mx-auto mb-4 text-yellow-600" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Taal</h3>
                <p className="text-gray-600">{showInfo.language}</p>
                <p className="text-sm text-gray-500 mt-2">Traditionele Nederlandse liedjes</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Wat Maakt Het Bijzonder?</h2>
            <p className="text-xl text-gray-600">Ontdek waarom onze show zo geliefd is bij families</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
        {/* Sparkles for CTA section */}
        <SparkleBackground density="light" animation="medium" />
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-bold mb-4">Klaar Voor De Magie?</h2>
          <p className="text-xl mb-8 opacity-90">
            Boek nu je tickets en beleef samen met je familie de meest magische Sinterklaas show ooit!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shows"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-block"
            >
              Bekijk Show Data
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-200 inline-block"
            >
              Contact Opnemen
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}