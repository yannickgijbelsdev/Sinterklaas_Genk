import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { LiveEditor } from '../components/LiveEditor';
import { characters } from '../data/mock';
import { useContent, getContentValue } from '../hooks/useApi';

export default function Characters() {
  const { data: contentData } = useContent();

  // Get dynamic content with fallbacks
  const pageTitle = getContentValue(contentData, 'characters', 'title', 'Ontmoet De Karakters');
  const pageSubtitle = getContentValue(contentData, 'characters', 'subtitle', 'Maak kennis met alle geweldige karakters die onze Sinterklaas show tot leven brengen. Elk karakter heeft zijn eigen persoonlijkheid en bijzondere talenten!');
  const behindScenesTitle = getContentValue(contentData, 'characters', 'behind_scenes_title', 'Achter De Schermen');
  const behindScenesSubtitle = getContentValue(contentData, 'characters', 'behind_scenes_subtitle', 'Ontdek hoe onze karakters tot leven komen');
  const funFactsTitle = getContentValue(contentData, 'characters', 'fun_facts_title', 'Wist Je Dat?');
  const funFactsSubtitle = getContentValue(contentData, 'characters', 'fun_facts_subtitle', 'Leuke weetjes over onze karakters');

  return (
    <LiveEditor pageKey="characters">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-5xl font-bold text-gray-900 mb-6"
              data-editable-text="title"
              data-section="characters"
              data-key="title"
            >
              {pageTitle}
            </h1>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-editable-text="subtitle"
              data-section="characters"
              data-key="subtitle"
            >
              {pageSubtitle}
            </p>
          </div>
        </section>

        {/* Characters Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {characters.map((character, index) => (
                <div key={character.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="relative group">
                      <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-editable-image={`character_${character.id}_image`}
                          data-section="characters"
                          data-key={`character_${character.id}_image`}
                          key={character.image}
                        />
                      </div>
                      <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
                        <div className="text-2xl">✨</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div>
                      <h2 
                        className="text-4xl font-bold text-gray-900 mb-4"
                        data-editable-text={`character_${character.id}_name`}
                        data-section="characters"
                        data-key={`character_${character.id}_name`}
                      >
                        {character.name}
                      </h2>
                      <p 
                        className="text-lg text-gray-600 leading-relaxed mb-6"
                        data-editable-text={`character_${character.id}_description`}
                        data-section="characters"
                        data-key={`character_${character.id}_description`}
                      >
                        {character.description}
                      </p>
                    </div>

                    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
                          <span className="mr-2">💡</span>
                          Leuk Weetje
                        </h3>
                        <p 
                          className="text-yellow-700"
                          data-editable-text={`character_${character.id}_fun_fact`}
                          data-section="characters"
                          data-key={`character_${character.id}_fun_fact`}
                        >
                          {character.funFact}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Character Traits */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-2xl mb-2">❤️</div>
                        <div className="text-sm font-semibold text-red-800">Favoriet</div>
                        <div className="text-xs text-red-600">
                          {character.name === 'Sinterklaas' ? 'Pepernoten' : 
                           character.name === 'Zwarte Piet' ? 'Dansen' : 'Wortels'}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl mb-2">⭐</div>
                        <div className="text-sm font-semibold text-blue-800">Talent</div>
                        <div className="text-xs text-blue-600">
                          {character.name === 'Sinterklaas' ? 'Cadeautjes' : 
                           character.name === 'Zwarte Piet' ? 'Muziek' : 'Springen'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Behind the Scenes */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                data-editable-text="behind_scenes_title"
                data-section="characters"
                data-key="behind_scenes_title"
              >
                {behindScenesTitle}
              </h2>
              <p 
                className="text-xl text-gray-600"
                data-editable-text="behind_scenes_subtitle"
                data-section="characters"
                data-key="behind_scenes_subtitle"
              >
                {behindScenesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="behind_actors_title"
                    data-section="characters"
                    data-key="behind_actors_title"
                  >
                    Professionele Acteurs
                  </h3>
                  <p 
                    className="text-gray-600"
                    data-editable-text="behind_actors_description"
                    data-section="characters"
                    data-key="behind_actors_description"
                  >
                    Onze karakters worden gespeeld door ervaren theater acteurs die gespecialiseerd zijn in kindervoorstellingen.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">👗</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="behind_costumes_title"
                    data-section="characters"
                    data-key="behind_costumes_title"
                  >
                    Authentieke Kostuums
                  </h3>
                  <p 
                    className="text-gray-600"
                    data-editable-text="behind_costumes_description"
                    data-section="characters"
                    data-key="behind_costumes_description"
                  >
                    Alle kostuums zijn handgemaakt en traditioneel, maar met moderne details voor extra comfort tijdens de show.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">🎵</div>
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-3"
                    data-editable-text="behind_music_title"
                    data-section="characters"
                    data-key="behind_music_title"
                  >
                    Live Muziek
                  </h3>
                  <p 
                    className="text-gray-600"
                    data-editable-text="behind_music_description"
                    data-section="characters"
                    data-key="behind_music_description"
                  >
                    Onze karakters zingen en dansen op live muziek, gespeeld door een professioneel orkest.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Fun Facts */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold mb-4"
                data-editable-text="fun_facts_title"
                data-section="characters"
                data-key="fun_facts_title"
              >
                {funFactsTitle}
              </h2>
              <p 
                className="text-xl opacity-90"
                data-editable-text="fun_facts_subtitle"
                data-section="characters"
                data-key="fun_facts_subtitle"
              >
                {funFactsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">📚</div>
                <h3 
                  className="text-xl font-bold mb-2"
                  data-editable-text="fun_fact_1_title"
                  data-section="characters"
                  data-key="fun_fact_1_title"
                >
                  Het Grote Boek
                </h3>
                <p 
                  className="opacity-90"
                  data-editable-text="fun_fact_1_description"
                  data-section="characters"
                  data-key="fun_fact_1_description"
                >
                  Sinterklaas heeft écht een groot boek waarin staat wie braaf is geweest. 
                  Maar maak je geen zorgen - in onze show zijn alle kinderen braaf!
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <div className="text-3xl mb-3">🐴</div>
                <h3 
                  className="text-xl font-bold mb-2"
                  data-editable-text="fun_fact_2_title"
                  data-section="characters"
                  data-key="fun_fact_2_title"
                >
                  Amerigo's Snelheid
                </h3>
                <p 
                  className="opacity-90"
                  data-editable-text="fun_fact_2_description"
                  data-section="characters"
                  data-key="fun_fact_2_description"
                >
                  Amerigo kan zo snel rennen dat hij in één nacht alle daken van Nederland kan bezoeken. 
                  Dat is meer dan 500 kilometer per uur!
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LiveEditor>
  );
}