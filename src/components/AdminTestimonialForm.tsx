import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { createTestimonial } from "@/lib/db";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AdminTestimonialFormProps {
  userId: number;
  userName: string;
  userEmail: string;
  onSubmitSuccess?: () => void;
}

export function AdminTestimonialForm({
  userId,
  userName,
  userEmail,
  onSubmitSuccess,
}: AdminTestimonialFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    tripName: "",
    quote: "",
    rating: "5",
    role: "Traveler",
    location: "",
    highlight: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.tripName.trim()) {
      setError("Trip name is required");
      return;
    }

    if (!formData.quote.trim()) {
      setError("Review text is required");
      return;
    }

    if (formData.quote.length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      await createTestimonial({
        userId,
        userName,
        email: userEmail,
        tripName: formData.tripName,
        quote: formData.quote,
        rating: parseInt(formData.rating),
        role: formData.role || undefined,
        location: formData.location || undefined,
        highlight: formData.highlight || undefined,
        submittedDate: new Date().toISOString(),
        isVisible: true,
      });

      setSuccess(true);
      toast({ title: "Success", description: "Testimonial submitted successfully" });

      // Reset form
      setFormData({
        tripName: "",
        quote: "",
        rating: "5",
        role: "Traveler",
        location: "",
        highlight: "",
      });

      // Call callback
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-md rounded-2xl">
      <CardHeader>
        <CardTitle>Submit User Testimonial</CardTitle>
        <CardDescription>
          As admin, you can submit testimonials on behalf of users. The testimonial will be immediately visible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Testimonial submitted successfully and is now visible!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>User Name</Label>
            <Input value={userName} disabled className="mt-1" />
          </div>

          <div>
            <Label>User Email</Label>
            <Input value={userEmail} disabled className="mt-1" />
          </div>

          <div>
            <Label htmlFor="tripName" className="text-sm font-medium">
              Trip Name *
            </Label>
            <Input
              id="tripName"
              placeholder="e.g., Ladakh Adventure, Kerala Backwaters"
              value={formData.tripName}
              onChange={(e) => setFormData({ ...formData, tripName: e.target.value })}
              disabled={loading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="quote" className="text-sm font-medium">
              Review Text *
            </Label>
            <Textarea
              id="quote"
              placeholder="Share the user's experience and feedback about the trip..."
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              disabled={loading}
              className="mt-1 min-h-28"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating" className="text-sm font-medium">
                Rating
              </Label>
              <Select value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Stars - Excellent</SelectItem>
                  <SelectItem value="4">4 Stars - Very Good</SelectItem>
                  <SelectItem value="3">3 Stars - Good</SelectItem>
                  <SelectItem value="2">2 Stars - Fair</SelectItem>
                  <SelectItem value="1">1 Star - Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Input
                id="role"
                placeholder="e.g., Traveler, Adventure Seeker"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={loading}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location" className="text-sm font-medium">
                Location
              </Label>
              <Input
                id="location"
                placeholder="e.g., Delhi, Mumbai"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="highlight" className="text-sm font-medium">
                Highlight
              </Label>
              <Input
                id="highlight"
                placeholder="e.g., Best mountain experience"
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                disabled={loading}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
