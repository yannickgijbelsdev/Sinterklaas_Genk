import React, { useState } from 'react';
import { X, ZoomIn, Download, Share } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { gallery } from '../data/mock';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Foto Galerij</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bekijk de mooiste momenten van onze Sinterklaas shows. Van vrolijke gezichten 
            tot magische momenten - hier vind je de herinneringen die families koesteren.
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
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ZoomIn className="text-white" size={32} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                    <p className="text-gray-200 text-sm">{image.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Foto's Maken Tijdens De Show</h2>
            <p className="text-xl text-gray-600">Tips voor de mooiste herinneringen</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Foto Momenten</h3>
              <p className="text-gray-600">
                Er zijn speciale momenten in de show waar foto's maken is toegestaan. 
                Let op de aanwijzingen van onze crew.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Meet & Greet</h3>
              <p className="text-gray-600">
                Na de show is er gelegenheid voor foto's met Sinterklaas en zijn helpers 
                in de foyer van het theater.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sociale Media</h3>
              <p className="text-gray-600">
                Deel je foto's met #SinterklaaShowNL en wij delen de mooiste foto's 
                op onze sociale media kanalen!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Maak Jouw Eigen Herinneringen</h2>
          <p className="text-xl mb-8 opacity-90">
            Boek nu je tickets en creëer onvergetelijke momenten met jouw familie tijdens onze magische show!
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
              Stel Een Vraag
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
              onClick={closeLightbox}
            >
              <X size={24} />
            </Button>
            
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-white text-xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-200">{selectedImage.description}</p>
              
              <div className="flex space-x-2 mt-4">
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-gray-300">
                  <Share size={16} className="mr-2" />
                  Delen
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}