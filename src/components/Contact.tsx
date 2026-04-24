import { Mail as MailIcon, Phone as PhoneIcon, Search, ChevronDown, MessageSquare, MapPin, Clock, Send, Globe } from "lucide-react";
import emailjs from '@emailjs/browser';
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { FormEvent, useState, useEffect } from "react";

// EmailJS Credentials
const EMAILJS_SERVICE_ID = 'storiesbyfoot';
const EMAILJS_TEMPLATE_ID = 'template_57tfwsw';
const EMAILJS_PUBLIC_KEY = 'JH95W_X6r4YZ6I_-0';

const COUNTRIES = [
  { code: "IN", name: "India", dial: "+91" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "SL", name: "Sri Lanka", dial: "+94" },
  { code: "NP", name: "Nepal", dial: "+977" },
];

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countrySearch, setCountrySearch] = useState("");
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dial.includes(countrySearch) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    setOpenCountryPopover(false);
    setCountrySearch("");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const message = String(formData.get("message") || "");

    // Validation
    if (!name || !email || !phone || !message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);

    const fullPhoneNumber = selectedCountry.dial + phone;

    const contactData = {
      fullName: name,
      email: email,
      phone: fullPhoneNumber,
      message: message,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        contactData
      );

      setShowThankYou(true);
      form.reset();
      setSelectedCountry(COUNTRIES[0]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Luxury Hero Header */}
      <section className="relative h-[35vh] md:h-[45vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2Fad2d7d0632944f2a99e3df5568d6e82b%2F0a7a70bdabaa42b59defe24592c1de02?format=webp')`,
          }}
        >
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>

        <div className="relative z-10 text-center px-4 animate-fade-in max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Get in <span className="text-secondary">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-2xl mx-auto">
            Our team of travel experts is ready to craft your perfect adventure. Reach out with any questions.
          </p>
        </div>

        {/* Subtle Decorative Line */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
      </section>

      {/* Main Content Area - Luxury */}
      <section className="py-12 md:py-24 bg-gradient-to-b from-background via-background to-slate-50 relative px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left Side: Form */}
            <div className="lg:col-span-7">
              <Card className="border border-gray-200/50 shadow-2xl bg-white overflow-hidden rounded-2xl hover:shadow-3xl transition-shadow duration-300">
                <div className="h-1 bg-gradient-to-r from-secondary via-secondary to-transparent w-full"></div>
                <CardContent className="px-8 md:px-12 pt-10 md:pt-12 pb-10 md:pb-12 space-y-8">
                  <div className="space-y-3 text-center lg:text-left">
                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Send a Message</h3>
                    <p className="text-slate-600 font-light text-base">We'll respond within 24 hours with personalized recommendations for your journey.</p>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          required
                          className="bg-slate-50 border border-slate-200 focus-visible:ring-secondary focus-visible:border-secondary h-12 rounded-lg text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          className="bg-slate-50 border border-slate-200 focus-visible:ring-secondary focus-visible:border-secondary h-12 rounded-lg text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                      <div className="flex gap-3">
                        <Popover open={openCountryPopover} onOpenChange={(open) => {
                          setOpenCountryPopover(open);
                          if (!open) setCountrySearch("");
                        }}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-[100px] h-12 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 flex items-center justify-between text-slate-900"
                            >
                              <span className="font-medium">{selectedCountry.dial}</span>
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-0 rounded-xl shadow-xl border-none" align="start">
                            <div className="p-2 bg-popover">
                              <div className="relative mb-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-lg focus:outline-none"
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-60 overflow-y-auto scrollbar-hide">
                                {filteredCountries.map((country) => (
                                  <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center justify-between group"
                                  >
                                    <span>{country.name}</span>
                                    <span className="text-muted-foreground group-hover:text-white/80">{country.dial}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="9876543210"
                          className="flex-1 bg-slate-50 border border-slate-200 focus-visible:ring-secondary focus-visible:border-secondary h-12 rounded-lg text-slate-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="text-sm font-semibold text-slate-700">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about the dream adventure you're planning..."
                        required
                        className="bg-slate-50 border border-slate-200 focus-visible:ring-secondary focus-visible:border-secondary min-h-[160px] rounded-lg resize-none p-4 text-slate-900 placeholder:text-slate-400"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full h-14 rounded-lg text-base font-bold group transition-all duration-300 mt-4 bg-gradient-to-r from-secondary via-orange-500 to-orange-600 hover:from-orange-600 hover:via-orange-600 hover:to-orange-700 shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-95 text-white uppercase tracking-wide"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <span>Send Message</span>
                          <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Side: Contact Info & Support */}
            <div className="lg:col-span-5 space-y-10 text-center lg:text-left">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Talk to our Experts</h2>
                <p className="text-slate-600 leading-relaxed font-light text-base">
                  Whether you have questions about a specific destination or need help with a custom itinerary, we're here to provide expert guidance.
                </p>
                <div className="h-1 w-16 bg-gradient-to-r from-secondary to-orange-400 rounded mt-4 mx-auto lg:mx-0"></div>
              </div>

              {/* Contact Method Cards - Luxury */}
              <div className="grid gap-5">
                <Card className="group border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-lg hover:border-secondary/50">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <WhatsAppIcon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">WhatsApp</p>
                      <a href="https://wa.me/916205129118" target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-slate-900 hover:text-secondary transition-colors">Chat with us now</a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-lg hover:border-secondary/50">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <PhoneIcon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Call Us</p>
                      <div className="space-y-0.5">
                        <a href="tel:+916205129118" className="block text-base font-semibold text-slate-900 hover:text-secondary transition-colors">+91 62051 29118</a>
                        <a href="tel:+916283620764" className="block text-base font-semibold text-slate-900 hover:text-secondary transition-colors">+91 62836 20764</a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-lg hover:border-secondary/50">
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <MailIcon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Email</p>
                      <div className="space-y-0.5">
                        <a href="mailto:contact@storiesbyfoot.com" className="block text-base font-semibold text-slate-900 hover:text-secondary transition-colors">contact@storiesbyfoot.com</a>
                        <a href="mailto:storiesbyfoot@gmail.com" className="block text-base font-semibold text-slate-900 hover:text-secondary transition-colors">storiesbyfoot@gmail.com</a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Extra Info - Luxury */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-gray-200/50">
                <div className="flex flex-col items-center sm:items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Available</h4>
                    <p className="text-sm text-slate-600 font-light">24*7</p>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Global Support</h4>
                    <p className="text-sm text-slate-600 font-light">Multilingual help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location - Luxury */}
      <section className="py-24 bg-white border-t border-gray-200/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <p className="text-secondary font-semibold text-sm tracking-widest uppercase">Visit Us</p>
            <h2 className="text-4xl font-bold text-slate-900">Our Base Camp</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-light">Drop by for a coffee and let's talk about your next destination.</p>
          </div>

          <div className="flex justify-center">
            <Card className="max-w-md w-full border border-gray-200/50 shadow-2xl hover:shadow-3xl transition-shadow bg-white rounded-2xl overflow-hidden">
              <div className="p-10 flex flex-col items-center text-center space-y-5">
                <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <MapPin className="h-8 w-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900">Main Office</h3>
                  <p className="text-slate-600 font-light leading-relaxed">
                    91, GK Crystal Home, KL Highway,<br />
                    SAS Nagar, Punjab - 140307, India
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section - Luxury */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 font-light text-lg">Find answers to common questions about our tours and booking process.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="faq-1" className="border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-slate-900 font-semibold hover:text-secondary">
                What destinations do you offer?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-slate-600 font-light leading-relaxed">
                We offer curated adventures across India and international destinations including Ladakh, Northeast India, Rajasthan, Kerala, and more. Each itinerary is customizable based on your preferences and interests.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-slate-900 font-semibold hover:text-secondary">
                How do I book a tour?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-slate-600 font-light leading-relaxed">
                You can fill out our contact form, call us, or chat on WhatsApp. Our team will then provide personalized recommendations and assist with the entire booking process from start to finish.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-slate-900 font-semibold hover:text-secondary">
                What's included in the tour package?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-slate-600 font-light leading-relaxed">
                Most packages include accommodation, meals, guided tours, and transportation within the destination. Specific inclusions vary by package. We'll provide a detailed breakdown when discussing your itinerary.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-slate-900 font-semibold hover:text-secondary">
                Can I customize my itinerary?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-slate-600 font-light leading-relaxed">
                Absolutely! We specialize in custom itineraries. Whether you want to add activities, change destinations, or adjust dates, our experts will work with you to create your perfect journey.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-slate-900 font-semibold hover:text-secondary">
                What is your cancellation policy?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-slate-600 font-light leading-relaxed">
                Our cancellation policy is flexible and depends on the specific package and booking timeframe. Please contact us for detailed information about cancellation terms and refund policies.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border border-gray-200/50 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
              <AccordionTrigger className="px-6 py-5 hover:no-underline text-slate-900 font-semibold hover:text-secondary">
                How far in advance should I book?
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-5 text-slate-600 font-light leading-relaxed">
                We recommend booking at least 30-45 days in advance to ensure the best availability and pricing. However, we also accommodate last-minute bookings based on availability.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Thank You Modal - Luxury */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-2xl shadow-2xl">
          <DialogTitle className="sr-only">Message Sent Successfully</DialogTitle>
          <div className="relative h-40 bg-gradient-to-br from-secondary via-orange-400 to-secondary flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-2xl transform translate-y-10">
              <Send className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <div className="pt-20 pb-12 px-8 text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-slate-900">Message Sent!</h2>
              <p className="text-slate-600 leading-relaxed font-light">
                Thank you for reaching out. One of our adventure specialists will contact you shortly to help plan your journey.
              </p>
            </div>
            <Button
              onClick={() => setShowThankYou(false)}
              className="w-full h-12 rounded-lg font-semibold bg-gradient-to-r from-secondary to-orange-500 hover:from-orange-600 hover:to-orange-600 shadow-lg hover:shadow-xl"
              variant="default"
            >
              Excellent
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;
