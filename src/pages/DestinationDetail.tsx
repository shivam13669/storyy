import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ImageGallery from "@/components/ImageGallery";
import journeyConcludes from "@/assets/journey-concludes.png";
import PackageInfo from "@/components/PackageInfo";
import PricingCard from "@/components/PricingCard";
import TripHighlights from "@/components/TripHighlights";
import TabNavigation from "@/components/TabNavigation";
import ItinerarySection from "@/components/ItinerarySection";
import PackageInclusions from "@/components/PackageInclusions";
import PolicyAccordion from "@/components/PolicyAccordion";
import PromoBanners from "@/components/PromoBanners";
import TrustBadges from "@/components/TrustBadges";
import SummarisedView from "@/components/destinationDetail/SummarisedView";
import ActivitiesView from "@/components/destinationDetail/ActivitiesView";
import FlightsView from "@/components/destinationDetail/FlightsView";
import StayView from "@/components/destinationDetail/StayView";
import TransfersView from "@/components/destinationDetail/TransfersView";
import {
  Destination,
  DestinationPackage,
  findPackageAcrossDestinations,
  getDestinationBySlug,
  getPackageBySlug,
} from "@/data/destinations";
import "@/styles/destination-detail.css";

const DestinationDetail = () => {
  const { slug, packageSlug } = useParams<{ slug: string; packageSlug?: string }>();
  const [activeTab, setActiveTab] = useState("itinerary");

  let destination = slug ? getDestinationBySlug(slug) : undefined;
  let travelPackage =
    destination && packageSlug
      ? getPackageBySlug(destination.slug, packageSlug)
      : undefined;

  if ((!destination || !travelPackage) && packageSlug) {
    const fallback = findPackageAcrossDestinations(packageSlug);
    if (fallback) {
      destination = fallback.destination;
      travelPackage = fallback.travelPackage;
    }
  }

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  if (!travelPackage) {
    travelPackage = destination.packages[0];
  }

  const galleryImages = buildGalleryImages(destination, travelPackage);
  const dayCount = getDayCount(travelPackage);

  return (
    <div className="destination-detail-page min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-6 mt-16">
        <ImageGallery images={galleryImages} destinationName={destination.name} />

        {/* Two Column Layout - Only until End of Trip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <PackageInfo duration={travelPackage.duration} title={travelPackage.name} itinerary={travelPackage.itinerary} />
            <TripHighlights highlights={travelPackage.highlights} />
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "itinerary" && (
              <ItinerarySection images={galleryImages} days={dayCount} itinerary={travelPackage.itinerary} />
            )}

            {activeTab === "summarised" && (
              <SummarisedView
                itinerary={travelPackage.itinerary}
                highlights={travelPackage.highlights}
                duration={travelPackage.duration}
              />
            )}

            {activeTab === "activities" && (
              <ActivitiesView itinerary={travelPackage.itinerary} />
            )}

            {activeTab === "flights" && (
              <FlightsView itinerary={travelPackage.itinerary} />
            )}

            {activeTab === "stay" && (
              <StayView itinerary={travelPackage.itinerary} />
            )}

            {activeTab === "transfers" && (
              <TransfersView itinerary={travelPackage.itinerary} />
            )}
          </div>

          {/* Right Sidebar - Pricing Card (sticky, ends at End of Trip) */}
          <div className="lg:col-span-1">
            <PricingCard
              showForm={true}
              title={travelPackage.name}
              packageName={travelPackage.name}
              price={travelPackage.price}
              oldPrice={travelPackage.oldPrice}
              saving={
                travelPackage.oldPrice && travelPackage.price
                  ? `SAVE INR ${parseInt(travelPackage.oldPrice.replace(/\D/g, "")) - parseInt(travelPackage.price.replace(/\D/g, ""))}`
                  : undefined
              }
              itineraryUrl={travelPackage.itineraryUrl}
            />
          </div>
        </div>

        {/* The Journey Concludes - Full Width */}
        <div className="flex items-center justify-center py-12 mt-8">
          <img
            src={journeyConcludes}
            alt="The Journey Concludes"
            className="max-w-2xl w-full h-auto"
          />
        </div>

        {/* Full Width Content - After End of Trip */}
        <div>
          <PackageInclusions
            inclusions={travelPackage.inclusions}
            exclusions={travelPackage.exclusions}
          />

          {/* Policy Sections */}
          <PolicyAccordion title="Know Before You Go" defaultOpen={true}>
            <ul className="space-y-2 list-disc pl-5">
              <li>All Indian nationals are required to carry a valid Government ID proof.</li>
              <li>All foreign nationals are requested to carry their passports with them during the tours.</li>
              <li>All hotels rooms will be standard by default unless the customer specifies to receive a different category of rooms before booking.</li>
              <li>All expenses of a personal nature will be borne by the tourists themselves.</li>
              <li>International flights are not included as a part of the package.</li>
            </ul>
          </PolicyAccordion>

          <PromoBanners />

          <TrustBadges />

          <PolicyAccordion title={`More On ${destination.name} Tourism`} defaultOpen={true}>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors border-r border-border pr-4">{destination.name} Tour Packages</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors border-r border-border pr-4">Things to do in {destination.name}</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Places to visit in {destination.name}</a>
            </div>
          </PolicyAccordion>

          <PolicyAccordion title="Confirmation Policy">
            <p>The booking confirmation will be sent within 24 hours of receiving full payment.</p>
          </PolicyAccordion>

          <PolicyAccordion title="Refund Policy">
            <p>Refund will be processed within 7-10 business days after cancellation approval.</p>
          </PolicyAccordion>

          <PolicyAccordion title="Cancellation Policy" defaultOpen={true}>
            <ul className="space-y-2 list-disc pl-5">
              <li>If cancellation is made 30 days or more before the date of travel, 30.0% of total booking cost will be charged as cancellation fees.</li>
              <li>If cancellation is made within 30 days before the date of travel, total booking cost will be charged as cancellation fees.</li>
              <li>In the event of unforeseen weather conditions, union issues, government restrictions, or any other circumstances beyond human control, certain trips or activities may be cancelled. In such cases, alternate feasible options will be provided. However, a cash refund will not be availa</li>
            </ul>
          </PolicyAccordion>

          <PolicyAccordion title="Payment Policy" defaultOpen={true}>
            <ul className="space-y-2 list-disc pl-5">
              <li>100.0% of total tour cost will have to be paid 0 days before the date of booking</li>
            </ul>
          </PolicyAccordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const destinationGalleryMap: Record<string, string[]> = {
  ladakh: [
    "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1600&q=80",
    "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2Fc56e32ac67b5429a8298412d2fca44d4?format=webp&width=1600&height=2400",
    "https://cdn.builder.io/api/v1/image/assets%2F9e2929517ee44d719568aadc2e96dcef%2F5f64937e077a45aba0193adf7a79d744?format=webp&width=1600&height=2400",
    "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
  ],
  tawang: [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1558180079-7f0f7180a5ec?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1509098681029-b45e9c845022?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=1600&q=80",
  ],
  bhutan: [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1559112094-4137e19ff3a5?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1494475673543-6a6a27143b22?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?auto=format&fit=crop&w=1600&q=80",
  ],
  meghalaya: [
    "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1545652711-491a01fb5d28?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80",
  ],
  nepal: [
    "https://images.unsplash.com/photo-1509644851169-51ebdcca9864?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1563144760-3da8c746b16c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1460522324493-a0e90ff22a91?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1549989476-69a92fa57c4e?auto=format&fit=crop&w=1600&q=80",
  ],
  zanskar: [
    "https://images.unsplash.com/photo-1512238701577-f182d9ef8af7?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1493815793585-d94ccbc86df0?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1516131206008-dd041a9764fd?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1542401886-65d27afda266?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1486870591958-9b9d7d1dda99?auto=format&fit=crop&w=1600&q=80",
  ],
};

const buildGalleryImages = (destination: Destination, travelPackage: DestinationPackage) => {
  // Check if package has custom gallery images
  if (travelPackage.galleryImages && travelPackage.galleryImages.length > 0) {
    return travelPackage.galleryImages;
  }

  const additionalImages = destinationGalleryMap[destination.slug] ?? [];
  const baseImages = [travelPackage.image, destination.heroImage, ...additionalImages].filter(
    (image): image is string => Boolean(image)
  );

  return Array.from(new Set(baseImages));
};

const getDayCount = (travelPackage: DestinationPackage) => {
  const duration = (travelPackage.duration || "").toUpperCase();

  // Pattern like "5N/6D" -> return days (6)
  const nd = duration.match(/(\d+)\s*N\s*\/?\s*(\d+)\s*D/);
  if (nd) {
    const days = Number(nd[2]);
    if (!Number.isNaN(days) && days > 0) return days;
  }

  // Pattern like "6D" or "6 DAYS"
  const dOnly = duration.match(/(\d+)\s*D(AYS)?/);
  if (dOnly) {
    const days = Number(dOnly[1]);
    if (!Number.isNaN(days) && days > 0) return days;
  }

  // Pattern like "5N" -> assume days = nights + 1
  const nOnly = duration.match(/(\d+)\s*N(IGHTS)?/);
  if (nOnly) {
    const nights = Number(nOnly[1]);
    const days = nights + 1;
    if (!Number.isNaN(days) && days > 0) return days;
  }

  // Fallback based on highlights
  return Math.max(4, travelPackage.highlights.length + 2);
};

export default DestinationDetail;
