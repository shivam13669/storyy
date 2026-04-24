import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { deleteTestimonial } from "@/lib/api";
import { Trash2, Star } from "lucide-react";

interface Testimonial {
  id: number;
  userId: number;
  userName: string;
  email: string;
  tripName: string;
  quote: string;
  rating: number;
  role?: string;
  location?: string;
  highlight?: string;
  submittedDate: string;
  isVisible: boolean;
}

interface AdminTestimonialsViewProps {
  testimonials: Testimonial[];
  onDataChange: () => void;
}

export function AdminTestimonialsView({
  testimonials,
  onDataChange,
}: AdminTestimonialsViewProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleDeleteTestimonial = async (testimonialId: number) => {
    setLoading(true);
    try {
      await deleteTestimonial(testimonialId);
      toast({ title: "Success", description: "Testimonial removed successfully" });
      onDataChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove testimonial",
      });
    } finally {
      setLoading(false);
      setDeleteConfirmId(null);
    }
  };

  const publicTestimonials = testimonials.filter((t) => t.isVisible);
  const hiddenTestimonials = testimonials.filter((t) => !t.isVisible);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Testimonials Management</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage all user reviews and testimonials
        </p>
      </div>

      {/* Public Testimonials */}
      <Card className="border-0 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Published Reviews
          </CardTitle>
          <CardDescription>
            {publicTestimonials.length} testimonials visible to public
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publicTestimonials.length > 0 ? (
              publicTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.userName}</h4>
                        <Badge className="bg-green-100 text-green-800">Public</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(testimonial.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{testimonial.quote}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {testimonial.rating} Stars | {testimonial.tripName}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-6">No published testimonials yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden Testimonials */}
      {hiddenTestimonials.length > 0 && (
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle>Hidden Reviews</CardTitle>
            <CardDescription>
              {hiddenTestimonials.length} testimonials hidden from public
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hiddenTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors opacity-75"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{testimonial.userName}</h4>
                        <Badge variant="secondary">Hidden</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{testimonial.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(testimonial.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{testimonial.quote}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {testimonial.rating} Stars | {testimonial.tripName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Testimonial</AlertDialogTitle>
            <AlertDialogDescription>
              This testimonial will be permanently deleted and removed from the website immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteConfirmId && handleDeleteTestimonial(deleteConfirmId)}
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
