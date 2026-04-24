import { useState } from "react";
import { Calendar, ChevronDown, Phone, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { AdvancedDatePicker } from "@/components/AdvancedDatePicker";
import { formatDate, startOfDay } from "date-fns";
import { BookingFormData, GuestData } from "@/pages/BookingPage";
import { DestinationPackage } from "@/data/destinations";
import AddGuestModal from "./AddGuestModal";

interface GuestDetailsStepProps {
  formData: BookingFormData;
  travelPackage: DestinationPackage;
  onFormDataChange: (data: Partial<BookingFormData>) => void;
}

const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

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
  NP: { min: 10, max: 10 },
};

const GuestDetailsStep = ({
  formData,
  travelPackage,
  onFormDataChange,
}: GuestDetailsStepProps) => {
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find(c => c.dial === formData.countryCode) || COUNTRIES[0]
  );
  const [countrySearch, setCountrySearch] = useState("");
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.travelDate ? new Date(formData.travelDate) : undefined
  );
  const [emailError, setEmailError] = useState("");

  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dial.includes(countrySearch) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country);
    onFormDataChange({ countryCode: country.dial });
    setOpenCountryPopover(false);
    setCountrySearch("");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onFormDataChange({ travelDate: formatDate(date, "yyyy-MM-dd") });
      setOpenDatePopover(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const maxDigits = COUNTRY_DIGIT_REQUIREMENTS[selectedCountry.code]?.max || 15;
    const truncated = digitsOnly.slice(0, maxDigits);
    onFormDataChange({ phoneNumber: truncated });
  };

  const handleInputChange = (field: keyof Omit<BookingFormData, 'guests' | 'selectedBikeId' | 'countryCode'>) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      onFormDataChange({ [field]: e.target.value });
    };
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onFormDataChange({ email: value });
    setEmailError("");
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const truncated = digitsOnly.slice(0, 12);
    onFormDataChange({ aadhaarNumber: truncated });
  };

  const handleAddGuest = (guest: GuestData) => {
    onFormDataChange({
      guests: [...formData.guests, guest],
    });
  };

  const handleRemoveGuest = (index: number) => {
    onFormDataChange({
      guests: formData.guests.filter((_, i) => i !== index),
    });
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    const dateOnly = startOfDay(date);
    
    if (dateOnly < today) return true;
    
    if (travelPackage.availableDates) {
      const dateStr = formatDate(date, "yyyy-MM-dd");
      return !travelPackage.availableDates.includes(dateStr);
    }
    
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Single Combined Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden">
        <div className="p-4 sm:p-6 space-y-6">
          {/* SECTION 1: Traveler Details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Traveler Details
            </h2>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="As per ID proof"
                  value={formData.fullName}
                  onChange={handleInputChange("fullName")}
                  className="h-11 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  className={`h-11 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg ${
                    emailError ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {emailError && (
                  <p className="text-xs text-red-500 font-medium mt-2">{emailError}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Popover open={openCountryPopover} onOpenChange={(open) => {
                    setOpenCountryPopover(open);
                    if (!open) setCountrySearch("");
                  }}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="px-3 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all flex items-center gap-2 min-w-fit h-11 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span className="font-semibold text-gray-900">{selectedCountry.dial}</span>
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-0" align="start">
                      <div className="flex flex-col max-h-96">
                        <div className="sticky top-0 z-10 p-3 border-b border-gray-200 bg-white">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                              autoFocus
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto">
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors flex items-center justify-between border-b border-gray-100 last:border-0 ${
                                selectedCountry.code === country.code
                                  ? "bg-blue-50 font-semibold text-blue-600"
                                  : "text-gray-700"
                              }`}
                            >
                              <span>{country.name}</span>
                              <span className="font-medium text-gray-600">{country.dial}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    className="flex-1 h-11 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  />
                </div>
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="XXXX XXXX XXXX"
                  value={formData.aadhaarNumber}
                  onChange={handleAadhaarChange}
                  inputMode="numeric"
                  className="h-11 text-base tracking-widest border-gray-300 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                />
                <p className="text-xs text-gray-600 mt-2">
                  Required for inner line permit and hotel bookings. Your data is secure and encrypted.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* SECTION 2: Travel Date */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              When will you travel?
            </h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Select Date <span className="text-red-500">*</span>
              </label>
              <Popover open={openDatePopover} onOpenChange={setOpenDatePopover}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full h-11 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className={formData.travelDate ? "text-gray-900 font-medium" : "text-gray-500"}>
                      {formData.travelDate
                        ? new Date(formData.travelDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Select a date"}
                    </span>
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <AdvancedDatePicker
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    availableDates={travelPackage.availableDates}
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-gray-600 mt-2">
                {travelPackage.availableDates?.length || 0} available dates
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* SECTION 3: Additional Guests */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Co-Travelers</h2>
              <Button
                onClick={() => setShowAddGuestModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                + Add
              </Button>
            </div>

            {formData.guests.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-gray-600 font-medium">No co-travelers added yet</p>
                <p className="text-sm text-gray-500 mt-1">Add family members or friends traveling with you</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData.guests.map((guest, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{guest.name}</p>
                      <p className="text-sm text-gray-600">Aadhaar: {guest.aadhaarNumber}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveGuest(index)}
                      className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Guest Modal */}
      <AddGuestModal
        isOpen={showAddGuestModal}
        onClose={() => setShowAddGuestModal(false)}
        onAddGuest={handleAddGuest}
      />
    </div>
  );
};

export default GuestDetailsStep;
