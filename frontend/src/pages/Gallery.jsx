import React, { useState } from 'react';
import { X, ZoomIn, Download, Share } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LiveEditor } from '../components/LiveEditor';
import { gallery } from '../data/mock';
import { useContent, getContentValue } from '../hooks/useApi';

export default function Gallery() {
  const { data: contentData } = useContent();
  const [selectedImage, setSelectedImage] = useState(null);

  // Get dynamic content with fallbacks
  const pageTitle = getContentValue(contentData, 'gallery', 'title', 'Foto Galerij');
  const pageSubtitle = getContentValue(contentData, 'gallery', 'subtitle', 'Bekijk de mooiste momenten van onze Sinterklaas shows. Van vrolijke gezichten tot magische momenten - hier vind je de herinneringen die families koesteren.');
  const categoriesTitle = getContentValue(contentData, 'gallery', 'categories_title', 'Categorieën');
  const behindScenesTitle = getContentValue(contentData, 'gallery', 'behind_scenes_title', 'Achter de Schermen');
  const behindScenesSubtitle = getContentValue(contentData, 'gallery', 'behind_scenes_subtitle', 'Een kijkje achter de coulissen van onze magische shows');

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <LiveEditor pageKey="gallery">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-5xl font-bold text-gray-900 mb-6"
              data-editable-text="title"
              data-section="gallery"
              data-key="title"
            >
              {pageTitle}
            </h1>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-editable-text="subtitle"
              data-section="gallery"
              data-key="subtitle"
            >
              {pageSubtitle}
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((image) => (
                <Card 
                  key={image.id} 
                  className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={image.image}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      data-editable-image={`gallery_${image.id}_image`}
                      data-section="gallery"
                      data-key={`gallery_${image.id}_image`}
                      key={image.image}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn className="text-white" size={32} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 
                      className="text-lg font-bold text-gray-900 mb-2"
                      data-editable-text={`gallery_${image.id}_title`}
                      data-section="gallery"
                      data-key={`gallery_${image.id}_title`}
                    >
                      {image.title}
                    </h3>
                    <p 
                      className="text-gray-600 text-sm"
                      data-editable-text={`gallery_${image.id}_description`}
                      data-section="gallery"
                      data-key={`gallery_${image.id}_description`}
                    >
                      {image.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                data-editable-text="categories_title"
                data-section="gallery"
                data-key="categories_title"
              >
                {categoriesTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    data-editable-text="category_show_title"
                    data-section="gallery"
                    data-key="category_show_title"
                  >
                    Show Momenten
                  </h3>
                  <p 
                    className="text-gray-600 text-sm"
                    data-editable-text="category_show_description"
                    data-section="gallery"
                    data-key="category_show_description"
                  >
                    De mooiste momenten uit onze voorstellingen
                  </p>
                </div>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">😊</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    data-editable-text="category_audience_title"
                    data-section="gallery"
                    data-key="category_audience_title"
                  >
                    Publiek Reacties
                  </h3>
                  <p 
                    className="text-gray-600 text-sm"
                    data-editable-text="category_audience_description"
                    data-section="gallery"
                    data-key="category_audience_description"
                  >
                    Vrolijke gezichten van kinderen en ouders
                  </p>
                </div>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🎪</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    data-editable-text="category_backstage_title"
                    data-section="gallery"
                    data-key="category_backstage_title"
                  >
                    Backstage
                  </h3>
                  <p 
                    className="text-gray-600 text-sm"
                    data-editable-text="category_backstage_description"
                    data-section="gallery"
                    data-key="category_backstage_description"
                  >
                    Een kijkje achter de schermen
                  </p>
                </div>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2"
                    data-editable-text="category_special_title"
                    data-section="gallery"
                    data-key="category_special_title"
                  >
                    Speciale Momenten
                  </h3>
                  <p 
                    className="text-gray-600 text-sm"
                    data-editable-text="category_special_description"
                    data-section="gallery"
                    data-key="category_special_description"
                  >
                    Unieke en magische gebeurtenissen
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Behind the Scenes */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                data-editable-text="behind_scenes_title"
                data-section="gallery"
                data-key="behind_scenes_title"
              >
                {behindScenesTitle}
              </h2>
              <p 
                className="text-xl text-gray-600"
                data-editable-text="behind_scenes_subtitle"
                data-section="gallery"
                data-key="behind_scenes_subtitle"
              >
                {behindScenesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">📷</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="behind_photography_title"
                    data-section="gallery"
                    data-key="behind_photography_title"
                  >
                    Professionele Fotografie
                  </h3>
                  <p 
                    className="text-gray-600"
                    data-editable-text="behind_photography_description"
                    data-section="gallery"
                    data-key="behind_photography_description"
                  >
                    Alle foto's worden gemaakt door professionele fotografen die gespecialiseerd zijn in theaterproducties.
                  </p>
                </div>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">🖼️</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="behind_prints_title"
                    data-section="gallery"
                    data-key="behind_prints_title"
                  >
                    Foto's Bestellen
                  </h3>
                  <p 
                    className="text-gray-600"
                    data-editable-text="behind_prints_description"
                    data-section="gallery"
                    data-key="behind_prints_description"
                  >
                    Wil je een foto van jouw gezin tijdens de show? Neem contact met ons op voor de mogelijkheden.
                  </p>
                </div>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <div className="p-6 text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="behind_social_title"
                    data-section="gallery"
                    data-key="behind_social_title"
                  >
                    Deel Je Foto's
                  </h3>
                  <p 
                    className="text-gray-600"
                    data-editable-text="behind_social_description"
                    data-section="gallery"
                    data-key="behind_social_description"
                  >
                    Tag ons op social media! We delen graag jouw mooiste momenten met #SinterklaasShow.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-4xl font-bold mb-4"
              data-editable-text="cta_title"
              data-section="gallery"
              data-key="cta_title"
            >
              Wil Je Ook Op De Foto?
            </h2>
            <p 
              className="text-xl mb-8 opacity-90"
              data-editable-text="cta_subtitle"
              data-section="gallery"
              data-key="cta_subtitle"
            >
              Boek je tickets nu en maak deel uit van onze volgende fotogalerij!
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
                Foto Service
              </a>
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
            <div className="relative max-w-4xl max-h-full">
              <Button
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                size="sm"
                onClick={closeLightbox}
              >
                <X size={20} />
              </Button>
              
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur text-white p-4 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{selectedImage.title}</h3>
                <p className="text-gray-200">{selectedImage.description}</p>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                    <Share size={16} className="mr-2" />
                    Delen
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LiveEditor>
  );
}