import React, { useState } from "react";
import { Phone, ChevronDown, Search, Loader } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "sonner";
import { updateUser } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddPhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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

const validateInternationalMobile = (mobile: string, countryCode: string): boolean => {
  const digitCount = mobile.replace(/\D/g, '').length;
  const requirements = COUNTRY_DIGIT_REQUIREMENTS[countryCode];

  if (!requirements) {
    return false;
  }

  if (digitCount < requirements.min || digitCount > requirements.max) {
    return false;
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(mobile, countryCode as any);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
};

export const AddPhoneNumberModal = ({ isOpen, onClose, onSuccess }: AddPhoneNumberModalProps) => {
  const { user, refreshUser } = useAuth();
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [countrySearch, setCountrySearch] = useState("");
  const [openCountryPopover, setOpenCountryPopover] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.dial.includes(countrySearch)
  );

  const handleClose = () => {
    setMobileNumber("");
    setMobileNumberError("");
    setCountrySearch("");
    setSelectedCountry(COUNTRIES[0]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMobileNumberError("");

    if (!mobileNumber.trim()) {
      setMobileNumberError("Mobile number is required");
      return;
    }

    if (!validateInternationalMobile(mobileNumber, selectedCountry.code)) {
      setMobileNumberError("Please enter a valid mobile number for the selected country");
      toast.error("Please enter a valid mobile number for the selected country");
      return;
    }

    if (!user?.id) {
      toast.error("User not found");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUser(user.id, {
        mobileNumber,
        countryCode: selectedCountry.code,
      });

      toast.success("Phone number added successfully!");
      
      // Refresh user data
      await refreshUser();
      
      if (onSuccess) {
        onSuccess();
      }
      
      handleClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add phone number';
      toast.error(errorMessage);
      setMobileNumberError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md p-0">
        <div className="p-7 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Add Phone Number
            </h2>
            <p className="text-sm text-gray-600">
              Complete your profile by adding your mobile number
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mobile Number with Country Code */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Mobile Number
              </label>
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
                      className="px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 hover:bg-gray-100 transition-all flex items-center gap-2 min-w-fit focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <span className="text-sm font-medium">{selectedCountry.dial}</span>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-0" align="start">
                    <div className="flex flex-col">
                      {/* Search Input */}
                      <div className="sticky top-0 z-10 p-3 border-b border-gray-200 bg-white">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-gray-50"
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
                              onClick={() => {
                                setSelectedCountry(country);
                                setOpenCountryPopover(false);
                                setCountrySearch("");
                              }}
                              className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex justify-between items-center ${
                                selectedCountry.code === country.code ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                              }`}
                            >
                              <span>{country.name}</span>
                              <span className="text-xs font-medium">{country.dial}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-500 text-center">
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Phone Number Input */}
                <div className="flex-1 relative group">
                  <Phone className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      setMobileNumberError("");
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 bg-gray-50/50 transition-all ${
                      mobileNumberError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500'
                    }`}
                  />
                </div>
              </div>
              {mobileNumberError && (
                <p className="text-xs text-red-500 font-medium">{mobileNumberError}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Adding..." : "Add Phone Number"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
