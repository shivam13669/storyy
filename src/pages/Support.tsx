import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Support & FAQs</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions or reach out to our support team
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card>
              <CardHeader>
                <HelpCircle className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>FAQs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Browse frequently asked questions about bookings, cancellations, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Send us an email at support@storiesbyfoot.com and we'll get back to you within 24 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Chat with our support team for instant help (available 9 AM - 9 PM IST).
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How do I book a trip?</h3>
                <p className="text-muted-foreground text-sm">
                  Browse our destinations, select a package, and complete the booking form. You'll receive a confirmation email once your booking is processed.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Can I cancel my booking?</h3>
                <p className="text-muted-foreground text-sm">
                  Cancellation policies vary by package. Please check your booking confirmation or contact support for specific cancellation terms.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What should I bring on a trip?</h3>
                <p className="text-muted-foreground text-sm">
                  A detailed packing list will be sent to you via email after booking confirmation. It varies based on the destination and type of trip.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SupportPage;
