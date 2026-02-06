import { Mail as MailIcon, Phone as PhoneIcon, Search, ChevronDown } from "lucide-react";
import emailjs from '@emailjs/browser';
import WhatsAppIcon from "./icons/WhatsAppIcon";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
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
    <section id="contact" className="pt-24 py-20 relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 scroll-mt-24">
      <div className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-sky-200 to-teal-300 rounded-full opacity-30 filter blur-3xl transform rotate-45 -z-10 pointer-events-none"></div>
      <div className="absolute -bottom-28 -right-28 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-emerald-200 to-sky-200 rounded-full opacity-25 filter blur-3xl transform rotate-12 -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="relative text-center mb-4">
            <span className="text-4xl font-bold tracking-tight sm:text-5xl text-slate-900">
              Contact Us
            </span>
            <span className="block mx-auto mt-3 h-1 w-28 rounded-full bg-emerald-900"></span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to plan your next adventure? Send us a message and we’ll reach out.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex gap-2">
                    {/* Country Code Selector */}
                    <Popover open={openCountryPopover} onOpenChange={(open) => {
                      setOpenCountryPopover(open);
                      if (!open) {
                        setCountrySearch("");
                      }
                    }}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="px-3 py-2.5 border border-border rounded-md bg-background hover:bg-muted transition-all flex items-center gap-2 min-w-fit focus:outline-none focus:ring-1 focus:ring-primary h-10"
                        >
                          <span className="text-sm font-medium text-foreground">{selectedCountry.dial}</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0" align="start">
                        <div className="flex flex-col">
                          {/* Search Input */}
                          <div className="sticky top-0 z-10 p-3 border-b border-border bg-card">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-background"
                                autoFocus
                              />
                            </div>
                          </div>

                          {/* Countries List */}
                          <div className="max-h-64 overflow-y-auto" onWheel={(e) => e.stopPropagation()}>
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => handleCountrySelect(country)}
                                  className={`w-full text-left px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors flex items-center justify-between ${
                                    selectedCountry.code === country.code ? "bg-primary/20 font-semibold text-primary" : "text-foreground"
                                  }`}
                                >
                                  <span>
                                    <span className="font-medium">{country.dial}</span>
                                    <span className="text-muted-foreground ml-2">
                                      {country.name}
                                    </span>
                                  </span>
                                  {selectedCountry.code === country.code && (
                                    <span className="text-primary">✓</span>
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-3 py-8 text-sm text-muted-foreground text-center">
                                No countries found
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Phone Number Input */}
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="9876543210"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" placeholder="Tell us about your plans…" className="min-h-32" required />
                </div>
                <Button type="submit" variant="contact" className="w-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-md border border-border shadow-sm">
            <div className="mb-4">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">Reach us directly</h3>
              <p className="text-muted-foreground mt-2">Prefer WhatsApp, call, or email? Get in touch using the details below.</p>
            </div>

            <div className="space-y-3">
              <a href="tel:+916205129118" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-white/5 to-white/3 border border-white/5 hover:shadow-lg transition">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span className="font-medium">+91 62051 29118</span>
                <span className="ml-auto text-sm text-muted-foreground">Call</span>
              </a>

              <a href="tel:+916283620764" className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-white/5 to-white/3 border border-white/5 hover:shadow-lg transition">
                <PhoneIcon className="h-5 w-5 text-primary" />
                <span className="font-medium">+91 62836 20764</span>
                <span className="ml-auto text-sm text-muted-foreground">Call</span>
              </a>

              <a href="https://wa.me/916205129118" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/30 hover:bg-emerald-50/40 transition border border-emerald-200/10">
                <WhatsAppIcon className="h-5 w-5 text-green-500" />
                <span className="font-medium">WhatsApp Support</span>
                <span className="ml-auto text-sm text-muted-foreground">Replies fast</span>
              </a>

              <a href="mailto:contact@storiesbyfoot.com" className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-white/5 to-white/3 border border-white/5 hover:shadow-lg transition">
                <MailIcon className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="font-medium">contact@storiesbyfoot.com</div>
                  <div className="text-sm text-muted-foreground">General inquiries</div>
                </div>
              </a>

              <a href="mailto:storiesbyfoot@gmail.com" className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-white/5 to-white/3 border border-white/5 hover:shadow-lg transition">
                <MailIcon className="h-5 w-5 text-primary mt-1" />
                <div>
                  <div className="font-medium">storiesbyfoot@gmail.com</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </a>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">Our team typically replies within a few hours.</div>
          </div>
        </div>
      </div>

      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md text-center">
          <DialogTitle className="sr-only">Thank You</DialogTitle>
          <div className="py-12 px-4">
            <div className="mb-6 text-6xl">✨</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-12">Thank You!</h2>
            <p className="text-lg text-gray-600 mb-8">
              We will reach out to you shortly!
            </p>
            <Button
              onClick={() => setShowThankYou(false)}
              className="w-full"
              variant="default"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Contact;
