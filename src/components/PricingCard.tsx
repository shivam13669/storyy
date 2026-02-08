import { useEffect, useState } from "react";
import { Calendar, ChevronDown, Phone, Search } from "lucide-react";
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AdvancedDatePicker } from "@/components/AdvancedDatePicker";
import { useCurrency, parsePrice } from "@/context/CurrencyContext";
import { formatDate, startOfDay } from "date-fns";

// EmailJS Credentials
const EMAILJS_SERVICE_ID = 'storiesbyfoot';
const EMAILJS_TEMPLATE_ID = 'template_5tfzp06';
const EMAILJS_PUBLIC_KEY = 'JH95W_X6r4YZ6I_-0';

interface PricingCardProps {
  showForm?: boolean;
  title?: string;
  price?: string;
  oldPrice?: string;
  saving?: string;
  rating?: number;
  reviews?: number;
  itineraryUrl?: string;
  packageName?: string;
}

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
  { code: "SL", name: "Sri Lanka", dial: "+94" },
  { code: "NP", name: "Nepal", dial: "+977" },
];

const COUNTRY_DIGIT_REQUIREMENTS: Record<string, { min: number; max: number }> = {
  IN: { min: 10, max: 10 },
  US: { min: 10, max: 10 },
  GB: { min: 10, max: 11 },
  CA: { min: 10, max: 10 },
  AU: { min: 9, max: 9 },
  DE: { min: 10, max: 11 },
  FR: { min: 9, max: 9 },
  IT: { min: 10, max: 10 },
  ES: { min: 9, max: 9 },
  JP: { min: 10, max: 11 },
  CN: { min: 11, max: 11 },
  SG: { min: 8, max: 8 },
  MY: { min: 9, max: 10 },
  TH: { min: 9, max: 10 },
  PH: { min: 10, max: 10 },
  ID: { min: 9, max: 12 },
  SL: { min: 9, max: 9 },
  NP: { min: 10, max: 10 },
};

const PricingCard = ({ showForm = false, title = "Scenic Iceland With Diamond Circle", price = "INR 2,30,206", oldPrice = "INR 3,06,106", saving = "SAVE INR 75,900", itineraryUrl, packageName }: PricingCardProps) => {
  const { formatPrice } = useCurrency();
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countrySearch, setCountrySearch] = useState("");
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [formData, setFormData] = useState({
    packageName: packageName || title || "",
    fullName: "",
    email: "",
    phoneNumber: "",
    travelDate: "",
    travelerCount: "",
    message: "",
  });

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        travelDate: formatDate(date, "dd/MM/yyyy"),
      });
      setOpenDatePopover(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '');
    const maxDigits = COUNTRY_DIGIT_REQUIREMENTS[selectedCountry.code]?.max || 15;
    const truncated = digitsOnly.slice(0, maxDigits);
    setFormData({
      ...formData,
      phoneNumber: truncated,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { placeholder, value } = e.target;
    if (placeholder === "Full Name") {
      setFormData({ ...formData, fullName: value });
    } else if (placeholder === "Email") {
      setFormData({ ...formData, email: value });
    } else if (placeholder === "Traveler Count") {
      setFormData({ ...formData, travelerCount: value });
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, message: e.target.value });
  };

  // Disable past dates
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    return date < today;
  };

  // Parse and format prices
  const formattedPrice = price ? formatPrice(parsePrice(price) ?? 0, { fromCurrency: "INR" }) : "";
  const formattedOldPrice = oldPrice ? formatPrice(parsePrice(oldPrice) ?? 0, { fromCurrency: "INR" }) : "";

  // Calculate savings if both prices exist
  let formattedSaving = saving;
  if (price && oldPrice) {
    const priceNum = parsePrice(price) ?? 0;
    const oldPriceNum = parsePrice(oldPrice) ?? 0;
    if (oldPriceNum > priceNum) {
      const savingAmount = oldPriceNum - priceNum;
      formattedSaving = `SAVE ${formatPrice(savingAmount, { fromCurrency: "INR" })}`;
    }
  }

  const handleDownloadItinerary = () => {
    if (itineraryUrl) {
      window.open(itineraryUrl, "_blank");
    }
  };

  const handleSendEnquiry = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.travelDate || !formData.travelerCount) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Combine country code with phone number
    const fullPhoneNumber = selectedCountry.dial + formData.phoneNumber;

    // Create the data object to send
    const enquiryData = {
      packageName: formData.packageName,
      fullName: formData.fullName,
      email: formData.email,
      phone: fullPhoneNumber, // +918709356155 format
      travelDate: formData.travelDate,
      travelerCount: formData.travelerCount,
      message: formData.message,
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        enquiryData
      );

      setShowThankYou(true);

      // Reset form
      setFormData({
        packageName: packageName || title || "",
        fullName: "",
        email: "",
        phoneNumber: "",
        travelDate: "",
        travelerCount: "",
        message: "",
      });
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error sending enquiry:', error);
      alert('Error sending enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 sticky top-20">
      {/* Card 1: Download Itinerary with Pricing */}
      <div className="card-shadow bg-card p-6 rounded-xl">
        {/* Package Title */}
        <div className="mb-4">
          <h3 className="text-base font-medium text-foreground">{title}</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-foreground">{formattedPrice}</span>
            {formattedOldPrice && (
              <span className="text-sm text-muted-foreground line-through">{formattedOldPrice}</span>
            )}
            {formattedSaving && (
              <span className="bg-sale text-primary-foreground text-xs px-2 py-0.5 rounded font-medium">
                {formattedSaving}
              </span>
            )}
          </div>
        </div>

        {/* Download Itinerary and Buy Now Buttons - Side by Side */}
        <div className="flex gap-3">
          <Button
            onClick={handleDownloadItinerary}
            disabled={!itineraryUrl}
            className="flex-1 btn-primary h-12 text-base font-semibold rounded-lg"
          >
            Download Itinerary
          </Button>
          <Button className="flex-1 btn-primary h-12 text-base font-semibold rounded-lg">
            Book Now
          </Button>
        </div>
      </div>

      {/* Card 2: Send Enquiry Form */}
      {showForm && (
        <div className="card-shadow bg-card p-6 rounded-xl">
          {/* Hidden Package Name Field - Sent with form but not visible to user */}
          <input
            type="hidden"
            name="packageName"
            value={formData.packageName}
          />

          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <Input
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-background border-border h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">*</span>
            </div>

            {/* Email */}
            <div className="relative">
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-background border-border h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">*</span>
            </div>

            {/* Phone */}
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
                    className="px-3 py-2.5 border border-border rounded-md bg-background hover:bg-muted transition-all flex items-center gap-2 min-w-fit focus:outline-none focus:ring-1 focus:ring-primary h-12"
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
              <div className="relative flex-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  className="bg-background border-border h-12 px-4 pl-10 focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">*</span>
              </div>
            </div>

            {/* Travel Date & Traveller Count */}
            <div className="grid grid-cols-2 gap-3">
              {/* Travel Date with Calendar Picker */}
              <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <Input
                      placeholder="Travel Date"
                      value={formData.travelDate}
                      readOnly
                      className="bg-background border-border h-12 px-4 cursor-pointer focus:border-primary focus:ring-1 focus:ring-primary pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-primary">*</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <AdvancedDatePicker
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                  />
                </PopoverContent>
              </Popover>

              {/* Traveller Count */}
              <div className="relative">
                <Input
                  placeholder="Traveler Count"
                  value={formData.travelerCount}
                  onChange={handleInputChange}
                  className="bg-background border-border h-12 px-4 focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary">*</span>
              </div>
            </div>

            {/* Message */}
            <Textarea
              placeholder="Message..."
              value={formData.message}
              onChange={handleMessageChange}
              className="bg-background border-border min-h-[100px] px-4 py-3 resize-none focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {/* Send Enquiry Button */}
            <Button
              onClick={handleSendEnquiry}
              disabled={loading}
              className="w-full btn-primary h-12 text-base font-semibold mt-5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Enquiry'}
            </Button>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="max-w-md text-center">
          <DialogTitle className="sr-only">Thank You</DialogTitle>
          <div className="py-12 px-4">
            <div className="mb-6 text-6xl">✨</div>
            <h2 className="text-2xl font-bold text-foreground mb-12">Thank You!</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We will reach out to you shortly!
            </p>
            <Button
              onClick={() => setShowThankYou(false)}
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingCard;
