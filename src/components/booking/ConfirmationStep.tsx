import { CheckCircle2 } from "lucide-react";
import { BookingFormData, GuestData } from "@/pages/BookingPage";
import { DestinationPackage, BikeOption, Destination } from "@/data/destinations";
import { Coupon } from "@/utils/couponUtils";
import { parsePrice, useCurrency } from "@/context/CurrencyContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ConfirmationStepProps {
  formData: BookingFormData;
  travelPackage: DestinationPackage;
  destination: Destination;
  selectedBike: BikeOption | undefined;
  finalPrice: number;
  baseTotal: number;
  appliedCoupon: Coupon | null;
  couponCode: string;
  couponError: string;
  discountAmount: number;
  onApplyCoupon: () => void | Promise<void>;
  onRemoveCoupon: () => void;
  onCouponCodeChange: (code: string) => void;
  couponValidating?: boolean;
}

const ConfirmationStep = ({
  formData,
  travelPackage,
  destination,
  selectedBike,
  finalPrice,
  baseTotal,
  appliedCoupon,
  couponCode,
  couponError,
  discountAmount,
  onApplyCoupon,
  onRemoveCoupon,
  onCouponCodeChange,
  couponValidating = false,
}: ConfirmationStepProps) => {
  const { formatPrice } = useCurrency();
  const packageBasePrice = parsePrice(travelPackage.price) || 0;
  const formatSignedPrice = (amount: number, sign: "+" | "-" = "+") => `${sign}${formatPrice(amount)}`;
  const travelDateObj = new Date(formData.travelDate);
  const formattedDate = travelDateObj.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      {/* All Booking Details - Single Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all overflow-hidden">
        {/* Success Message Section */}
        <div className="bg-green-50 border-b-2 border-green-200 p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            Review Your Booking
          </h2>
          <p className="text-green-800">
            Please verify all details before confirming your booking
          </p>
        </div>

        {/* All Other Sections */}
        <div className="p-4 sm:p-8 space-y-6">
          {/* Trip Details Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              Trip Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Destination</p>
                <p className="text-lg font-bold text-gray-900">{destination.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Package</p>
                <p className="text-lg font-bold text-gray-900">{travelPackage.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-bold text-gray-900">{travelPackage.duration}</p>
              </div>
            </div>
          </div>

          {/* Travel Information Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              Travel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Travel Date</p>
                <p className="text-lg font-bold text-gray-900">{formattedDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Number of Travelers</p>
                <p className="text-lg font-bold text-gray-900">
                  {1 + formData.guests.length} {1 + formData.guests.length === 1 ? "person" : "people"}
                </p>
              </div>
            </div>
          </div>

          {/* Primary Traveler Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              Primary Traveler
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Name</p>
                <p className="font-semibold text-gray-900">{formData.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="font-semibold text-gray-900 break-all text-sm">{formData.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Phone</p>
                <p className="font-semibold text-gray-900">
                  {formData.countryCode} {formData.phoneNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Aadhaar</p>
                <p className="font-semibold text-gray-900">{formData.aadhaarNumber}</p>
              </div>
            </div>
          </div>

          {/* Bike Selection Section */}
          {selectedBike && (
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
                Bike Selected
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Model</p>
                  <p className="text-lg font-bold text-gray-900">{selectedBike.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Engine</p>
                  <p className="text-lg font-bold text-gray-900">{selectedBike.cc}</p>
                </div>
              </div>
            </div>
          )}

          {/* Co-Travelers Section */}
          {formData.guests.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
                Co-Travelers ({formData.guests.length})
              </h3>
              <div className="space-y-2">
                {formData.guests.map((guest: GuestData, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-semibold text-gray-900">{guest.name}</p>
                      <p className="text-sm text-gray-600">Aadhaar: {guest.aadhaarNumber}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      Guest {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coupon Code Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              Apply Discount Coupon
            </h3>

            {couponError && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{couponError}</AlertDescription>
              </Alert>
            )}

            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-900">Coupon Applied</p>
                    <p className="text-lg font-bold text-green-700 mt-1">{appliedCoupon.code}</p>
                    <p className="text-sm text-green-600 mt-1">
                      Discount: {formatPrice(discountAmount)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onRemoveCoupon}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => onCouponCodeChange(e.target.value.toUpperCase())}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !couponValidating) {
                      onApplyCoupon();
                    }
                  }}
                  className="text-sm"
                  disabled={couponValidating}
                />
                <Button
                  type="button"
                  onClick={onApplyCoupon}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={couponValidating}
                >
                  {couponValidating ? "Validating..." : "Apply"}
                </Button>
              </div>
            )}
          </div>

          {/* Price Breakdown Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              Fare Summary
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">Base Price (per person)</span>
                <span className="font-semibold text-gray-900">
                  {formatPrice(packageBasePrice)}
                </span>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-700">
                  Co-Travelers ({formData.guests.length} {formData.guests.length === 1 ? 'person' : 'people'})
                </span>
                <span className="font-semibold text-gray-900">
                  {formData.guests.length > 0
                    ? formatSignedPrice(packageBasePrice * formData.guests.length)
                    : formatPrice(0)}
                </span>
              </div>

              {selectedBike && selectedBike.priceMultiplier !== 1.0 && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700">
                    {selectedBike.name} Upgrade ({Math.round((selectedBike.priceMultiplier - 1) * 100)}%)
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatSignedPrice(
                      packageBasePrice * (selectedBike.priceMultiplier - 1) * (1 + formData.guests.length)
                    )}
                  </span>
                </div>
              )}

              {appliedCoupon && (
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-700 font-medium">
                    Discount ({appliedCoupon.code})
                  </span>
                  <span className="font-semibold text-green-600">
                    {formatSignedPrice(discountAmount, "-")}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3">
                <span className="text-lg font-bold text-gray-900">Total Price</span>
                <span className={`text-3xl font-bold ${appliedCoupon ? "text-green-600" : "text-blue-600"}`}>
                  {formatPrice(finalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Info and Confirmation - Separate Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-8 shadow-md hover:shadow-lg transition-all space-y-6">
        {/* Important Information Section */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Important Information</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-gray-600 font-bold mt-0.5">•</span>
              <span>Your booking is tentative until confirmed. We'll send confirmation within 24 hours.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 font-bold mt-0.5">•</span>
              <span>Payment details will be shared via email and SMS.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 font-bold mt-0.5">•</span>
              <span>Cancellation: 30+ days before = 25% fee, Less than 30 days = 100% fee</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600 font-bold mt-0.5">•</span>
              <span>All travelers must carry valid government ID proof.</span>
            </li>
          </ul>
        </div>

        {/* Confirmation Section */}
        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            By confirming this booking, you agree to our <a href="#" className="text-blue-600 hover:underline font-semibold">terms and conditions</a> and <a href="#" className="text-blue-600 hover:underline font-semibold">privacy policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
