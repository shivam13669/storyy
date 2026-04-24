import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuestData } from "@/pages/BookingPage";

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGuest: (guest: GuestData) => void;
}

const AddGuestModal = ({ isOpen, onClose, onAddGuest }: AddGuestModalProps) => {
  const [guestName, setGuestName] = useState("");
  const [guestAadhaar, setGuestAadhaar] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const truncated = digitsOnly.slice(0, 12);
    setGuestAadhaar(truncated);
    if (validationError) setValidationError("");
  };

  const handleSubmit = () => {
    if (!guestName.trim()) {
      setValidationError("Please enter guest name");
      return;
    }

    if (!guestAadhaar.trim()) {
      setValidationError("Please enter Aadhaar number");
      return;
    }

    if (guestAadhaar.length !== 12) {
      setValidationError("Aadhaar number must be exactly 12 digits");
      return;
    }

    onAddGuest({
      name: guestName,
      aadhaarNumber: guestAadhaar,
    });

    // Reset form
    setGuestName("");
    setGuestAadhaar("");
    setValidationError("");
    onClose();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setGuestName("");
      setGuestAadhaar("");
      setValidationError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-2xl font-bold text-gray-900">Add Co-Traveler</DialogTitle>
        <DialogDescription className="text-gray-600">
          Enter details of another person traveling with you.
        </DialogDescription>

        <div className="space-y-5 py-6">
          {/* Guest Name */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">
              Full Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="As per ID proof"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="h-12 text-base border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Guest Aadhaar */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-2 block">
              Aadhaar Number <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="XXXX XXXX XXXX"
              value={guestAadhaar}
              onChange={handleAadhaarChange}
              inputMode="numeric"
              className="h-12 text-base tracking-widest border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
            {validationError && (
              <p className="text-red-500 text-sm mt-2">{validationError}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-11 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Add Co-Traveler
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuestModal;
