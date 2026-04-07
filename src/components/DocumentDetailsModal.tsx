import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { FileText } from "lucide-react";

interface User {
  id: number;
  fullName: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  passportIssuingCountry?: string;
  panCardNumber?: string;
  aadhaarCardNo?: string;
  documents?: string | null;
}

interface DocumentDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}

export function DocumentDetailsModal({
  isOpen,
  user,
  onClose,
}: DocumentDetailsModalProps) {
  if (!user) return null;

  const parseDocuments = (documentsData?: string | null) => {
    if (!documentsData) return [];
    try {
      const parsed = typeof documentsData === 'string' ? JSON.parse(documentsData) : documentsData;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const customDocuments = parseDocuments(user.documents);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Document Details</DialogTitle>
          <DialogDescription>
            Documents for {user.fullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Passport Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Passport Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Passport Number</p>
                <p className="text-base font-medium text-gray-900">
                  {user.passportNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Issuing Country</p>
                <p className="text-base font-medium text-gray-900">
                  {user.passportIssuingCountry || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Expiry Date</p>
                <p className="text-base font-medium text-gray-900">
                  {user.passportExpiryDate ? format(new Date(user.passportExpiryDate), "dd/MM/yyyy") : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* PAN Card Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">PAN Card</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">PAN Card Number</p>
              <p className="text-base font-medium text-gray-900">
                {user.panCardNumber || "-"}
              </p>
            </div>
          </div>

          {/* Aadhaar Details */}
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Aadhaar Card</h3>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Aadhaar Card Number</p>
              <p className="text-base font-medium text-gray-900">
                {user.aadhaarCardNo || "-"}
              </p>
            </div>
          </div>

          {/* Custom Documents */}
          {customDocuments.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Additional Documents</h3>
              </div>
              <div className="space-y-4">
                {customDocuments.map((doc: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Document Type</p>
                        <p className="text-base font-medium text-gray-900">
                          {doc.type || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Document Number</p>
                        <p className="text-base font-medium text-gray-900">
                          {doc.number || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Documents Message */}
          {customDocuments.length === 0 &&
            !user.passportNumber &&
            !user.panCardNumber &&
            !user.aadhaarCardNo && (
              <div className="text-center py-8 text-gray-600">
                <p>No documents added by this user</p>
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
