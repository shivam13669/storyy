import { CheckCircle, Home, Mail } from "lucide-react";
import { BookingFormData } from "@/pages/BookingPage";
import { DestinationPackage, Destination } from "@/data/destinations";

interface CompletionStepProps {
  formData: BookingFormData;
  travelPackage: DestinationPackage;
  destination: Destination;
}

const CompletionStep = ({
  formData,
  travelPackage,
  destination,
}: CompletionStepProps) => {
  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      {/* Success Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        {/* Success Message Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200 p-6 sm:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-200 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
              <CheckCircle className="w-24 h-24 text-green-600 relative z-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-green-900 mb-3">
            Booking Completed!
          </h2>
          <p className="text-green-800 text-lg">
            Your booking has been successfully received.
          </p>
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-8 space-y-8">
          {/* Confirmation Message */}
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
            <p className="text-green-900 font-medium leading-relaxed">
              Thank you for booking with us! Our team will review your booking and send you a confirmation email shortly with payment details and further instructions.
            </p>
          </div>

          {/* Booking Summary */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              Booking Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Destination</p>
                <p className="text-lg font-bold text-gray-900">{destination.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Package</p>
                <p className="text-lg font-bold text-gray-900">{travelPackage.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Traveler</p>
                <p className="text-lg font-bold text-gray-900">{formData.fullName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Email</p>
                <p className="text-lg font-bold text-gray-900 break-all text-sm">{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 pb-3 border-b border-gray-200">
              What's Next?
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                    1
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Check Your Email</p>
                  <p className="text-sm text-gray-600 mt-1">
                    We'll send a confirmation email to <span className="font-medium">{formData.email}</span> within 2 hours with full booking details.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                    2
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Payment Information</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment details will be shared via email and SMS. You can complete the payment securely through multiple payment options.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                    3
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Booking Confirmation</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Once payment is received, we'll send your final confirmation with all travel details, itinerary, and support contact information.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="font-semibold text-gray-900 mb-3">Questions or Need Help?</p>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span>Email: <span className="font-medium">storiesbyfoot@gmail.com</span></span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-gray-600">📱</span>
                <span>WhatsApp: <span className="font-medium">+916205129118</span></span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Return Home Button */}
      <div className="flex gap-4">
        <a
          href="/"
          className="flex-1 h-12 text-base font-semibold bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default CompletionStep;
