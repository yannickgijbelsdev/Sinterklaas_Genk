import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { LiveEditor } from '../components/LiveEditor';
import { contactInfo } from '../data/mock';
import { useContent, getContentValue } from '../hooks/useApi';

export default function Contact() {
  const { data: contentData } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  // Get dynamic content with fallbacks
  const pageTitle = getContentValue(contentData, 'contact', 'title', 'Contact');
  const pageSubtitle = getContentValue(contentData, 'contact', 'subtitle', 'Heb je vragen over onze Sinterklaas show? We helpen je graag! Neem contact met ons op via onderstaande mogelijkheden.');
  const formTitle = getContentValue(contentData, 'contact', 'form_title', 'Stuur Ons Een Bericht');
  const formSubtitle = getContentValue(contentData, 'contact', 'form_subtitle', 'Vul het formulier in en we nemen zo snel mogelijk contact met je op.');
  const contactInfoTitle = getContentValue(contentData, 'contact', 'contact_info_title', 'Contactgegevens');
  const hoursTitle = getContentValue(contentData, 'contact', 'hours_title', 'Openingstijden');
  const faqTitle = getContentValue(contentData, 'contact', 'faq_title', 'Veelgestelde Vragen');
  const faqSubtitle = getContentValue(contentData, 'contact', 'faq_subtitle', 'Misschien staat je vraag er al tussen!');
  const emergencyTitle = getContentValue(contentData, 'contact', 'emergency_title', 'Urgente Vragen?');
  const emergencySubtitle = getContentValue(contentData, 'contact', 'emergency_subtitle', 'Voor urgente vragen op show dagen kun je ons direct bereiken op:');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    toast.success('Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <LiveEditor pageKey="contact">
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              className="text-5xl font-bold text-gray-900 mb-6"
              data-editable-text="title"
              data-section="contact"
              data-key="title"
            >
              {pageTitle}
            </h1>
            <p 
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-editable-text="subtitle"
              data-section="contact"
              data-key="subtitle"
            >
              {pageSubtitle}
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle 
                    className="text-2xl font-bold text-gray-900 flex items-center"
                    data-editable-text="form_title"
                    data-section="contact"
                    data-key="form_title"
                  >
                    <MessageCircle className="mr-3 text-red-600" size={28} />
                    {formTitle}
                  </CardTitle>
                  <p 
                    className="text-gray-600"
                    data-editable-text="form_subtitle"
                    data-section="contact"
                    data-key="form_subtitle"
                  >
                    {formSubtitle}
                  </p>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Naam *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Je volledige naam"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefoonnummer</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="Je telefoonnummer"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">E-mailadres *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="je@email.nl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Onderwerp *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="Waar gaat je vraag over?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Bericht *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="mt-1 min-h-[120px]"
                        placeholder="Vertel ons meer over je vraag..."
                      />
                    </div>

                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                      <Send className="mr-2" size={16} />
                      Verstuur Bericht
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="p-6">
                  <CardContent className="pt-0">
                    <h3 
                      className="text-2xl font-bold text-gray-900 mb-6"
                      data-editable-text="contact_info_title"
                      data-section="contact"
                      data-key="contact_info_title"
                    >
                      {contactInfoTitle}
                    </h3>
                    
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <Mail className="text-red-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">E-mail</h4>
                          <a 
                            href={`mailto:${contactInfo.email}`}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                            data-editable-text="contact_email"
                            data-section="contact"
                            data-key="contact_email"
                          >
                            {contactInfo.email}
                          </a>
                          <p 
                            className="text-sm text-gray-500 mt-1"
                            data-editable-text="contact_email_description"
                            data-section="contact"
                            data-key="contact_email_description"
                          >
                            Voor algemene vragen en informatie
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <Phone className="text-green-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Telefoon</h4>
                          <a 
                            href={`tel:${contactInfo.phone}`}
                            className="text-green-600 hover:text-green-700 transition-colors duration-200"
                            data-editable-text="contact_phone"
                            data-section="contact"
                            data-key="contact_phone"
                          >
                            {contactInfo.phone}
                          </a>
                          <p 
                            className="text-sm text-gray-500 mt-1"
                            data-editable-text="contact_phone_description"
                            data-section="contact"
                            data-key="contact_phone_description"
                          >
                            Maandag t/m vrijdag 9:00 - 17:00
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-lg">
                          <MapPin className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Adres</h4>
                          <div className="text-gray-600">
                            <p
                              data-editable-text="contact_address_street"
                              data-section="contact"
                              data-key="contact_address_street"
                            >
                              {contactInfo.address.street}
                            </p>
                            <p
                              data-editable-text="contact_address_city"
                              data-section="contact"
                              data-key="contact_address_city"
                            >
                              {contactInfo.address.city}
                            </p>
                            <p
                              data-editable-text="contact_address_country"
                              data-section="contact"
                              data-key="contact_address_country"
                            >
                              {contactInfo.address.country}
                            </p>
                          </div>
                          <p 
                            className="text-sm text-gray-500 mt-1"
                            data-editable-text="contact_address_description"
                            data-section="contact"
                            data-key="contact_address_description"
                          >
                            Bezoek op afspraak
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="pt-0">
                    <h3 
                      className="text-xl font-bold text-gray-900 mb-4 flex items-center"
                      data-editable-text="hours_title"
                      data-section="contact"
                      data-key="hours_title"
                    >
                      <Clock className="mr-2 text-blue-600" size={24} />
                      {hoursTitle}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span>Maandag - Vrijdag</span>
                        <span className="font-medium">9:00 - 17:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zaterdag</span>
                        <span className="font-medium">10:00 - 16:00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zondag</span>
                        <span className="font-medium text-red-600">Gesloten</span>
                      </div>
                    </div>
                    <p 
                      className="text-sm text-gray-500 mt-4"
                      data-editable-text="hours_description"
                      data-section="contact"
                      data-key="hours_description"
                    >
                      In december zijn we ook beschikbaar in de weekenden voor show-gerelateerde vragen.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                data-editable-text="faq_title"
                data-section="contact"
                data-key="faq_title"
              >
                {faqTitle}
              </h2>
              <p 
                className="text-xl text-gray-600"
                data-editable-text="faq_subtitle"
                data-section="contact"
                data-key="faq_subtitle"
              >
                {faqSubtitle}
              </p>
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 
                  className="text-lg font-bold text-gray-900 mb-2"
                  data-editable-text="faq_1_question"
                  data-section="contact"
                  data-key="faq_1_question"
                >
                  Kan ik mijn tickets omruilen?
                </h3>
                <p 
                  className="text-gray-600"
                  data-editable-text="faq_1_answer"
                  data-section="contact"
                  data-key="faq_1_answer"
                >
                  Ja, tickets kunnen tot 24 uur voor de voorstelling worden omgeruild naar een andere datum, 
                  mits er nog plaatsen beschikbaar zijn.
                </p>
              </Card>

              <Card className="p-6">
                <h3 
                  className="text-lg font-bold text-gray-900 mb-2"
                  data-editable-text="faq_2_question"
                  data-section="contact"
                  data-key="faq_2_question"
                >
                  Is er een groepskorting?
                </h3>
                <p 
                  className="text-gray-600"
                  data-editable-text="faq_2_answer"
                  data-section="contact"
                  data-key="faq_2_answer"
                >
                  Voor groepen vanaf 10 personen bieden wij een aantrekkelijke groepskorting. 
                  Neem contact met ons op voor de mogelijkheden en tarieven.
                </p>
              </Card>

              <Card className="p-6">
                <h3 
                  className="text-lg font-bold text-gray-900 mb-2"
                  data-editable-text="faq_3_question"
                  data-section="contact"
                  data-key="faq_3_question"
                >
                  Zijn er speciale arrangementen?
                </h3>
                <p 
                  className="text-gray-600"
                  data-editable-text="faq_3_answer"
                  data-section="contact"
                  data-key="faq_3_answer"
                >
                  We bieden verschillende arrangementen aan, zoals combi-deals met een restaurant bezoek 
                  of speciale verjaardag pakketten. Vraag naar de mogelijkheden!
                </p>
              </Card>

              <Card className="p-6">
                <h3 
                  className="text-lg font-bold text-gray-900 mb-2"
                  data-editable-text="faq_4_question"
                  data-section="contact"
                  data-key="faq_4_question"
                >
                  Hoe vroeg moet ik er zijn?
                </h3>
                <p 
                  className="text-gray-600"
                  data-editable-text="faq_4_answer"
                  data-section="contact"
                  data-key="faq_4_answer"
                >
                  We adviseren om 30 minuten voor aanvang aanwezig te zijn. Dit geeft je tijd om 
                  te parkeren, je jas op te hangen en eventueel foto's te maken in de foyer.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Map Section (Mock) */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 
                className="text-4xl font-bold text-gray-900 mb-4"
                data-editable-text="map_title"
                data-section="contact"
                data-key="map_title"
              >
                Vind Ons
              </h2>
              <p 
                className="text-xl text-gray-600"
                data-editable-text="map_subtitle"
                data-section="contact"
                data-key="map_subtitle"
              >
                Ons kantoor in het hart van Amsterdam
              </p>
            </div>

            <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin size={48} className="mx-auto mb-4" />
                <p 
                  className="text-lg font-medium"
                  data-editable-text="map_placeholder_title"
                  data-section="contact"
                  data-key="map_placeholder_title"
                >
                  Interactieve kaart komt hier
                </p>
                <p 
                  className="text-sm"
                  data-editable-text="map_placeholder_subtitle"
                  data-section="contact"
                  data-key="map_placeholder_subtitle"
                >
                  Google Maps integratie
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 
              className="text-4xl font-bold mb-4"
              data-editable-text="emergency_title"
              data-section="contact"
              data-key="emergency_title"
            >
              {emergencyTitle}
            </h2>
            <p 
              className="text-xl mb-8 opacity-90"
              data-editable-text="emergency_subtitle"
              data-section="contact"
              data-key="emergency_subtitle"
            >
              {emergencySubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`tel:${contactInfo.phone}`}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
              >
                <Phone className="mr-2" size={20} />
                {contactInfo.phone}
              </a>
              <span className="text-white/70">of</span>
              <a
                href={`mailto:${contactInfo.email}`}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors duration-200 inline-flex items-center"
              >
                <Mail className="mr-2" size={20} />
                E-mail Ons
              </a>
            </div>
          </div>
        </section>
      </div>
    </LiveEditor>
  );
}