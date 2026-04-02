import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GuestDetailsStep from "@/components/booking/GuestDetailsStep";
import BikeSelectionStep from "@/components/booking/BikeSelectionStep";
import ConfirmationStep from "@/components/booking/ConfirmationStep";
import CompletionStep from "@/components/booking/CompletionStep";
import {
  findPackageAcrossDestinations,
  BikeOption,
  DestinationPackage,
  Destination
} from "@/data/destinations";
import { parsePrice, useCurrency } from "@/context/CurrencyContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { validateCouponFromAPI, calculateDiscount, Coupon, incrementCouponUsageFromAPI } from "@/utils/couponUtils";

// Email validation function
const validateEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// EmailJS Credentials for Booking Confirmation
const EMAILJS_SERVICE_ID = 'sbf2nd';
const EMAILJS_TEMPLATE_ID = 'template_edqs96c';
const EMAILJS_PUBLIC_KEY = 'VtBo89KCEBX6sQEKy';

export type GuestData = {
  name: string;
  aadhaarNumber: string;
};

export type BookingFormData = {
  // Step 1: Guest Details
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  travelDate: string;
  aadhaarNumber: string;
  guests: GuestData[];

  // Step 2: Bike Selection
  selectedBikeId: string;
  seatingPreference?: "solo" | "dual-sharing" | "seat-in-backup";
};

type BookingStep = 1 | 2 | 3 | 4;

const BookingPage = () => {
  const { packageSlug } = useParams<{ packageSlug: string }>();
  const [validationError, setValidationError] = useState<string>("");
  const { formatPrice, currency } = useCurrency();

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // Get storage key for this booking
  const storageKey = `booking_${packageSlug}`;
  const stepStorageKey = `booking_step_${packageSlug}`;
  const packageStorageKey = `booking_package_${packageSlug}`;

  // Initialize form data from localStorage or use defaults
  const [formData, setFormData] = useState<BookingFormData>(() => {
    if (typeof window !== 'undefined') {
      // Check if this is the same booking package (not navigated away)
      const savedPackage = localStorage.getItem(packageStorageKey);
      if (savedPackage === packageSlug) {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch (e) {
            console.error("Failed to parse saved form data");
          }
        }
      } else {
        // User navigated away and came back, or went to different package - clear all data
        localStorage.removeItem(storageKey);
        localStorage.removeItem(stepStorageKey);
      }
    }
    return {
      fullName: "",
      email: "",
      countryCode: "+91",
      phoneNumber: "",
      travelDate: "",
      aadhaarNumber: "",
      guests: [],
      selectedBikeId: "",
      seatingPreference: "solo",
    };
  });

  // Initialize current step from localStorage or use default
  const [currentStep, setCurrentStep] = useState<BookingStep>(() => {
    if (typeof window !== 'undefined') {
      const savedPackage = localStorage.getItem(packageStorageKey);
      if (savedPackage === packageSlug) {
        const saved = localStorage.getItem(stepStorageKey);
        if (saved) {
          const step = parseInt(saved) as BookingStep;
          if (step === 1 || step === 2 || step === 3) {
            return step;
          }
        }
      }
    }
    return 1;
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponValidating, setCouponValidating] = useState(false);

  // Find package data
  let destination: Destination | undefined;
  let travelPackage: DestinationPackage | undefined;

  if (packageSlug) {
    const result = findPackageAcrossDestinations(packageSlug);
    if (result) {
      destination = result.destination;
      travelPackage = result.travelPackage;
    }
  }

  if (!travelPackage || !destination) {
    return <Navigate to="/destinations" replace />;
  }


  // Calculate price
  const basePrice = parsePrice(travelPackage.price) || 0;
  const selectedBike = travelPackage.bikes?.find(b => b.id === formData.selectedBikeId);
  const isTransHimalayan = travelPackage.slug === "trans-himalayan-ride";

  // Determine bike price based on seating preference for trans-himalayan or backup vehicles, or use multiplier for others
  let bikePrice = basePrice;
  if (selectedBike) {
    // Use seating prices if available (for trans-himalayan or backup vehicles)
    if (selectedBike.seatingPrices && formData.seatingPreference) {
      bikePrice = selectedBike.seatingPrices[formData.seatingPreference] || basePrice;
    } else if (selectedBike.priceMultiplier) {
      // Otherwise use price multiplier if available
      bikePrice = basePrice * selectedBike.priceMultiplier;
    }
    // If neither seatingPrices nor priceMultiplier exist, keep basePrice
  }

  const totalTravelers = 1 + formData.guests.length; // Primary traveler + co-travelers
  const baseTotal = Math.round(bikePrice * totalTravelers);

  // Calculate discount from coupon
  const discountAmount = appliedCoupon ? calculateDiscount(appliedCoupon, baseTotal) : 0;
  const finalPrice = Math.max(0, baseTotal - discountAmount);

  // Handle coupon application
  const handleApplyCoupon = async () => {
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponValidating(true);
    const validation = await validateCouponFromAPI(couponCode, packageSlug || "");
    setCouponValidating(false);

    if (!validation.valid) {
      setCouponError(validation.error || "Invalid coupon code");
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(validation.coupon!);
    setCouponCode("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleStepChange = (step: BookingStep) => {
    setCurrentStep(step);
  };

  const handleFormDataChange = (data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setValidationError("");
  };

  const handleNextStep = () => {
    setValidationError("");

    if (currentStep === 1) {
      // Validate step 1
      if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.travelDate || !formData.aadhaarNumber) {
        setValidationError("Please fill in all required fields");
        return;
      }

      // Validate email format
      if (!validateEmail(formData.email)) {
        setValidationError("Please enter a valid email address (e.g., you@example.com)");
        return;
      }

      // Validate mobile number is exactly 10 digits
      if (formData.phoneNumber.length !== 10) {
        setValidationError("Mobile number must be exactly 10 digits");
        return;
      }

      // Validate Aadhaar number is exactly 12 digits
      if (formData.aadhaarNumber.length !== 12) {
        setValidationError("Aadhaar number must be exactly 12 digits");
        return;
      }

      // Step 1 validated, save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(formData));
        localStorage.setItem(packageStorageKey, packageSlug || "");
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.selectedBikeId) {
        setValidationError("Please select a bike");
        return;
      }
      // Step 2 validated, save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(formData));
        localStorage.setItem(packageStorageKey, packageSlug || "");
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as BookingStep);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      // Format co-travelers for email
      const coTravelersList = formData.guests
        .map((guest, index) => `${index + 1}. ${guest.name} (Aadhaar: ${guest.aadhaarNumber})`)
        .join('\n');

      // Format travel date
      const travelDateObj = new Date(formData.travelDate);
      const formattedTravelDate = travelDateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Prepare booking data for email
      const totalTravelers = 1 + formData.guests.length;
      const bookingData = {
        packageName: travelPackage.name,
        destination: destination.name,
        duration: travelPackage.duration,
        travelDate: formattedTravelDate,
        travelerCount: `${totalTravelers} ${totalTravelers === 1 ? 'person' : 'people'}`,
        primaryName: formData.fullName,
        primaryEmail: formData.email,
        primaryPhone: `${formData.countryCode} ${formData.phoneNumber}`,
        primaryAadhaar: formData.aadhaarNumber,
        bikeModel: selectedBike?.name || 'Not selected',
        engine: selectedBike?.cc || 'N/A',
        coTravelerName: coTravelersList || 'No co-travelers',
        coTravelerAadhaar: coTravelersList || 'No co-travelers',
        coTravelerCount: formData.guests.length,
        basePrice: formatPrice(Math.round(basePrice), { fromCurrency: "INR" }),
        coTravelerPrice: formData.guests.length > 0
          ? `+${formatPrice(Math.round(basePrice * formData.guests.length), { fromCurrency: "INR" })}`
          : formatPrice(0, { fromCurrency: "INR" }),
        pricePerTraveler: formatPrice(Math.round(bikePrice), { fromCurrency: "INR" }),
        travelersPrice: `${formatPrice(Math.round(bikePrice), { fromCurrency: "INR" })} × ${totalTravelers}`,
        couponCode: appliedCoupon ? appliedCoupon.code : 'None',
        couponDiscount: appliedCoupon ? formatPrice(discountAmount, { fromCurrency: "INR" }) : formatPrice(0, { fromCurrency: "INR" }),
        totalPrice: formatPrice(finalPrice, { fromCurrency: "INR" }),
      };

      // Increment coupon usage if applied
      if (appliedCoupon) {
        await incrementCouponUsageFromAPI(appliedCoupon.id);
      }

      // Send email via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        bookingData
      );

      // Move to step 4
      setCurrentStep(4);

      // Clear saved booking data
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
        localStorage.removeItem(stepStorageKey);
        localStorage.removeItem(packageStorageKey);
      }
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
      setValidationError("Booking received but email failed. Our team will contact you soon.");
      setCurrentStep(4);
    }
  };

  // Save currentStep to localStorage whenever it changes (only steps 2 and 3 mean validated data)
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStep > 1) {
      localStorage.setItem(stepStorageKey, currentStep.toString());
    }
  }, [currentStep, stepStorageKey]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentStep]);

  // Set default bike selection when moving to step 2
  useEffect(() => {
    if (currentStep === 2 && !formData.selectedBikeId && travelPackage.bikes && travelPackage.bikes.length > 0) {
      setFormData(prev => ({ ...prev, selectedBikeId: travelPackage.bikes![0].id }));
    }
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-2 sm:px-4 py-4 mt-16">
        {/* Centered Step Indicator */}
        <div className="mb-12 flex justify-center w-full py-2">
          <div className="flex items-center gap-1 sm:gap-4 w-full max-w-2xl justify-between sm:justify-center px-2">
            {[1, 2, 3, 4].map((step, idx) => (
              <div key={step} className="flex items-center gap-1 sm:gap-4">
                <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                      step === currentStep
                        ? "bg-blue-600 text-white shadow-lg scale-110"
                        : step < currentStep
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {step < currentStep ? "✓" : step}
                  </div>
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-2 text-center leading-tight">
                    {step === 1 ? "Travel Info" : step === 2 ? "Select Bike" : step === 3 ? "Review" : "Complete"}
                  </p>
                </div>
                {idx < 3 && (
                  <div
                    className={`w-4 sm:w-8 h-0.5 sm:h-1 transition-all ${
                      step < currentStep ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Checkout Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
          {/* Left side - Form content */}
          <div className={`${currentStep === 4 ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-0`}>
            {currentStep === 1 && (
              <GuestDetailsStep
                formData={formData}
                travelPackage={travelPackage}
                onFormDataChange={handleFormDataChange}
              />
            )}

            {currentStep === 2 && (
              <BikeSelectionStep
                formData={formData}
                travelPackage={travelPackage}
                basePrice={basePrice}
                onFormDataChange={handleFormDataChange}
              />
            )}

            {currentStep === 3 && (
              <ConfirmationStep
                formData={formData}
                travelPackage={travelPackage}
                destination={destination}
                selectedBike={selectedBike}
                finalPrice={finalPrice}
                baseTotal={baseTotal}
                appliedCoupon={appliedCoupon}
                couponCode={couponCode}
                couponError={couponError}
                discountAmount={discountAmount}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                onCouponCodeChange={setCouponCode}
                couponValidating={couponValidating}
              />
            )}

            {currentStep === 4 && (
              <CompletionStep
                formData={formData}
                travelPackage={travelPackage}
                destination={destination}
              />
            )}

            {/* Validation Error Message */}
            {validationError && (
              <div className="bg-red-50 border-l-4 border-red-600 p-4 mt-8 mb-6 rounded-r-lg">
                <p className="text-red-700 font-medium text-sm">{validationError}</p>
              </div>
            )}

            {/* Navigation Buttons - Hidden on Step 4 */}
            {currentStep < 4 && (
              <div className="border-t border-gray-200 pt-8 mt-8 flex gap-4">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 h-12 text-base font-semibold bg-white border border-gray-200 rounded-lg text-gray-700 shadow-md hover:shadow-lg hover:border-gray-300 transition-all"
                  >
                    {currentStep === 3 ? "Edit Details" : "Previous Step"}
                  </button>
                )}
                {currentStep < 3 && (
                  <button
                    onClick={handleNextStep}
                    className="flex-1 h-12 text-base font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all"
                  >
                    Next Step
                  </button>
                )}
                {currentStep === 3 && (
                  <button
                    onClick={handleConfirmBooking}
                    className="flex-1 h-12 text-base font-semibold bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-green-700 transition-all"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right side - Booking Summary (Checkout Style) - Hidden on Step 4 */}
          {currentStep < 4 && (
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Booking Card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Package Header with Image */}
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={travelPackage.image || "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1600&q=80"}
                    alt={travelPackage.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 text-white p-4">
                    <h3 className="text-sm font-bold">Booking Summary</h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Title Section */}
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      {travelPackage.name}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {travelPackage.duration}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Details Section */}
                  <div className="space-y-3">
                    {/* Travel Date - Always show (selected or not selected) */}
                    {formData.travelDate ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Travel Date</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(formData.travelDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center opacity-50">
                        <span className="text-sm text-gray-600">Travel Date</span>
                        <span className="text-sm text-gray-500">Not selected</span>
                      </div>
                    )}

                    {/* Your Bike - Always show (selected or not selected) */}
                    {selectedBike ? (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Your Bike</span>
                        <span className="text-sm font-semibold text-gray-900 text-right">
                          {selectedBike.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center opacity-50">
                        <span className="text-sm text-gray-600">Your Bike</span>
                        <span className="text-sm text-gray-500">Not selected</span>
                      </div>
                    )}

                    {/* Co-Travelers */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Co-Travelers</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formData.guests.length} {formData.guests.length === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Price Section */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Price per Traveler</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(Math.round(bikePrice), { fromCurrency: "INR" })}
                      </span>
                    </div>

                    {selectedBike && ((isTransHimalayan && selectedBike.seatingPrices) || (!isTransHimalayan && selectedBike.priceMultiplier !== 1.0)) ? (
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-green-600 uppercase tracking-wide text-xs">EARLY BIRD OFFER!</span>
                        <span className="font-semibold text-green-600">
                          ✓ Best Price
                        </span>
                      </div>
                    ) : null}

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">Travelers</span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(Math.round(bikePrice), { fromCurrency: "INR" })} × {totalTravelers}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200" />

                  {/* Total Price */}
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mb-2">Total Amount</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {formatPrice(finalPrice, { fromCurrency: "INR" })}
                    </p>
                  </div>

                  {/* Action Button */}
                  {currentStep === 3 && (
                    <div className="pt-2 space-y-3">
                      <button onClick={handleConfirmBooking} className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                        🔒 Confirm Booking
                      </button>
                      <p className="text-xs text-gray-600 text-center">
                        Secure checkout • Encrypted payments
                      </p>
                    </div>
                  )}

                  {currentStep < 3 && (
                    <div className="pt-2 text-center">
                      <p className="text-xs text-gray-600">
                        {currentStep === 1 ? '✓ 2 more steps to book' : '✓ 1 more step to book'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
