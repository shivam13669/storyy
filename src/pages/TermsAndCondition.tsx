import Navigation from "@/components/Navigation";

const sections = [
  "Overview",
  "Eligibility",
  "Bookings and Payments",
  "Cancellation and Refund Policy",
  "User Responsibilities",
  "Travel Documents and Compliance",
  "Third-Party Services",
  "Travel Insurance",
  "Intellectual Property",
  "Limitation of Liability",
  "Force Majeure",
  "Indemnification",
  "Privacy Policy",
  "Cookie Policy",
  "Changes to Terms",
  "Termination",
  "Governing Law and Jurisdiction",
  "Entire Agreement",
  "Contact Information",
  "Disclaimer"
];

export default function TermsAndConditionPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ scrollBehavior: "smooth" }}>
      <Navigation />
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              Governing your access to and use of Stories by Foot Services
            </p>
            <p className="text-sm text-slate-500">
              Last Updated: November 2025
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
          {/* Content */}
          <article className="text-justify">
            <div className="space-y-12">
              {/* Introduction */}
              <section className="space-y-4 pb-8 border-b border-slate-200">
                <p className="text-slate-700 leading-relaxed text-lg">
                  Welcome to Stories by Foot ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our website <a href="https://storiesbyfoot.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">https://storiesbyfoot.com</a> (the "Website") and all related features, services, and content provided by StoriesByFoot (collectively, the "Services").
                </p>
                <p className="text-slate-700 leading-relaxed text-lg">
                  By accessing or using our Website, you agree to comply with and be bound by these Terms. If you do not agree, please refrain from using our Website or Services.
                </p>
              </section>

              {/* Section 1 */}
              <section id="overview" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">1. Overview</h2>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Stories by Foot is a travel-based platform that provides destination information, travel inspiration, and booking assistance for tours, stays, and experiences.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Some services may be offered directly by Stories by Foot, while others are facilitated through verified third-party providers ("Vendors").</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>These Terms apply to all visitors, users, and registered members of Stories by Foot.</span>
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section id="eligibility" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">2. Eligibility</h2>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You must be at least 18 years old to access or use our Services. If you are under 18 years of age, you may only use our Services with the consent and supervision of a parent or legal guardian who accepts these Terms on your behalf.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>By using this Website, you represent that you have the legal capacity to enter into binding agreements.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>If you are accessing this Website on behalf of another person or organization, you confirm that you have full authority to do so.</span>
                  </li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="bookings-and-payments" className="space-y-6 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">3. Bookings and Payments</h2>
                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.1. Booking Confirmation</h3>
                    <p className="text-slate-700 leading-relaxed">All bookings made through Stories by Foot are subject to availability and confirmation. You will receive an email confirmation once a booking is successfully processed by the Vendor.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.2. Pricing and Currency</h3>
                    <p className="text-slate-700 leading-relaxed">All prices displayed on our Website are in Indian Rupees (INR) unless otherwise specified or selected. Prices are subject to change at any time without prior notice. Final prices will be confirmed before completing payment.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.3. Payment Policy</h3>
                    <p className="text-slate-700 leading-relaxed">Full or partial payment (as specified) must be made at the time of booking. Payments are processed securely through our authorized payment gateways.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.5. Amendments and Modifications</h3>
                    <p className="text-slate-700 leading-relaxed">Changes to bookings (e.g., travel dates, destination, or number of guests) are subject to availability, Vendor approval, and applicable modification charges.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.6. Right to Refuse or Cancel Bookings</h3>
                    <p className="text-slate-700 leading-relaxed">Stories by Foot reserves the right to refuse or cancel any booking at its discretion if fraud, payment issues, or misuse is suspected, or if the transaction violates applicable laws or our internal risk policies.</p>
                  </div>
                </div>
              </section>

              {/* Section 4 - Cancellation and Refund Policy */}
              <section id="cancellation-and-refund-policy" className="space-y-6 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">4. Cancellation and Refund Policy</h2>
                <div className="space-y-4 ml-4">
                  <ul className="space-y-3 text-slate-700 leading-relaxed">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold min-w-fit">•</span>
                      <span>Cancellations and refunds are subject to the terms and policies of the respective Vendor (e.g., hotels, tour operators, transport partners).</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold min-w-fit">•</span>
                      <span>Stories by Foot may charge a non-refundable service or convenience fee.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold min-w-fit">•</span>
                      <span>Refunds, if applicable, will be processed to the original mode of payment within 7–14 working days, subject to bank processing times.</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold min-w-fit">•</span>
                      <span>Some bookings (e.g., limited offers or last-minute deals) may be non-refundable.</span>
                    </li>
                  </ul>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.1. General Policy</h3>
                    <ul className="space-y-3 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Stories by Foot functions as a travel platform and intermediary between travelers and verified third-party service providers (such as hotels, tour operators, and transport partners).</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Each service provider has its own cancellation, amendment, and refund rules, which are binding on the user once a booking is confirmed. This policy applies to all bookings made directly through our Website or via official Stories by Foot representatives.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.2. Cancellations by the Traveler</h3>
                    <ul className="space-y-3 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Cancellations must be made in writing by emailing <a href="mailto:storiesbyfoot@gmail.com" className="text-primary hover:underline font-semibold">storiesbyfoot@gmail.com</a> with your booking details.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Cancellations are subject to the specific policy of the Vendor (hotel, tour operator, etc.) handling your booking.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Some bookings—such as last-minute deals, seasonal offers, or non-refundable packages—may not be eligible for cancellation or refund.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Refunds, if applicable, will exclude service or convenience fees charged.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Refund requests will be processed only after confirmation from the respective Vendor.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.3. Cancellations by Stories by Foot or Vendor</h3>
                    <p className="text-slate-700 leading-relaxed mb-3">Stories by Foot or the Vendor reserves the right to cancel a booking in cases of:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Fraud, payment failure, or technical errors</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Inaccurate or incomplete traveler details</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Force majeure events (natural disasters, strikes, political unrest, or pandemics)</span>
                      </li>
                    </ul>
                    <p className="leading-relaxed mb-3 mt-4 text-slate-700">In such cases, you will be offered:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>A refund (subject to and dependent on the Vendor's refund policy), or</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>The option to reschedule or receive a travel credit, depending on availability and Vendor policy.</span>
                      </li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-4">Stories by Foot will not be responsible for any indirect losses (such as flight costs, visa fees, or other expenses) arising from cancellations beyond our control.</p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.4. Amendments and Rescheduling</h3>
                    <ul className="space-y-3 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Changes to booking dates, names, or destinations are treated as amendments.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>All amendments are subject to availability, Vendor approval, and additional charges.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Rescheduling within 7 days of the travel date may incur a higher fee or may not be possible, depending on the Vendor's policy.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.5. Refund Process</h3>
                    <ul className="space-y-3 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Approved refunds will be processed to the original payment method used during booking.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Refunds are generally processed within 7–14 business days, depending on the Vendor and payment gateway timelines.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Refunds may be delayed due to bank holidays, technical issues, or incomplete information.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Stories by Foot will provide you with email confirmation once the refund has been initiated.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.6. Non-Refundable Circumstances</h3>
                    <p className="text-slate-700 leading-relaxed mb-3">Refunds will not be provided in the following cases:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>"No-show" or failure to arrive on time for a tour or activity</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Incomplete travel documents (passport, visa, permits, etc.)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Denied boarding or refusal of entry by authorities</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Personal emergencies, illness, or medical cancellations (unless covered by insurance)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Weather disruptions or force majeure events</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Services already utilized in part or full</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.7. Force Majeure</h3>
                    <p className="text-slate-700 leading-relaxed">In the event of unforeseen circumstances such as natural disasters, pandemics, war, or government restrictions, Stories by Foot and its Vendors will make reasonable efforts to provide rescheduling or travel credits. However, cash refunds may not be possible in such cases, depending on Vendor agreements.</p>
                  </div>
                </div>
              </section>

              {/* Remaining Sections */}
              <section id="user-responsibilities" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">5. User Responsibilities</h2>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You agree to provide accurate, current, and complete information when creating an account or making a booking.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You are responsible for maintaining the confidentiality of your account and login credentials.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You agree not to misuse our Website for illegal, fraudulent, or misleading activities; uploading harmful code, malware, or spam; or copying, scraping, or redistributing Website content without authorization.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Stories by Foot reserves the right to suspend or terminate accounts found violating these Terms or engaging in misuse.</span>
                  </li>
                </ul>
              </section>

              {/* Section 6 */}
              <section id="travel-documents-and-compliance" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">6. Travel Documents and Compliance</h2>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You are solely responsible for obtaining and carrying valid travel documents, such as passports, visas, identification, and insurance.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Stories by Foot is not responsible for losses caused by denied travel or entry due to missing or invalid documents.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You must comply with all applicable local laws, customs regulations, and travel advisories of your destination.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Certain experiences may require good physical fitness. You are responsible for ensuring your health condition is suitable for participation.</span>
                  </li>
                </ul>
              </section>

              {/* Section 7 */}
              <section id="third-party-services" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">7. Third-Party Services</h2>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Stories by Foot may include links, offers, or bookings from third-party providers such as airlines, hotels, and tour operators.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>We act only as an intermediary and are not responsible for the quality, safety, reliability, or performance of these third-party services.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Each booking is governed by the respective Vendor's Terms and Conditions. Please review them carefully before proceeding.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Any issues, delays, or service failures should be reported directly to the Vendor. Stories by Foot will provide assistance but does not assume liability.</span>
                  </li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="travel-insurance" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">8. Travel Insurance</h2>
                <p className="text-slate-700 leading-relaxed">
                  We strongly recommend that you purchase comprehensive travel insurance covering trip cancellations, medical emergencies, lost baggage, and other travel-related risks. Stories by Foot does not provide or sell insurance products directly.
                </p>
              </section>

              {/* Section 9 */}
              <section id="intellectual-property" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">9. Intellectual Property</h2>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>All content on this Website including text, images, graphics, videos, logos, and software is the exclusive property of Stories by Foot or its content partners and is protected under applicable copyright and trademark laws.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>You may not reproduce, distribute, modify, or republish any content without prior written consent from Stories by Foot.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Unauthorized use of our intellectual property may result in legal action.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>User-generated content (such as reviews, images, or stories) submitted to the platform grants Stories by Foot a non-exclusive, royalty-free license to use such content for promotional or editorial purposes.</span>
                  </li>
                </ul>
              </section>

              {/* Section 10 */}
              <section id="limitation-of-liability" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">10. Limitation of Liability</h2>
                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">10.1. Accuracy of Information</h3>
                    <p className="text-slate-700 leading-relaxed">Stories by Foot strives to provide accurate information but does not guarantee the completeness, accuracy, or reliability of all content.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3">10.2. We are not liable for:</h3>
                    <ul className="space-y-2 text-slate-700 leading-relaxed ml-4">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Delays, cancellations, or losses arising from third-party services</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Force majeure events (e.g., natural disasters, government restrictions, strikes, pandemics)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Any direct, indirect, or consequential losses including data loss, emotional distress, or financial damages</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>In no case shall our total liability exceed the total amount paid by you for the booking in question.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">10.3. Health, Safety, and Medical Conditions</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">Travel and adventure activities involve inherent risks, including but not limited to illness, injury, accidents, or other health-related issues.</p>
                    <p className="text-slate-700 leading-relaxed mb-2">By participating in any travel experience or using the services listed on Stories by Foot, you acknowledge and accept these risks.</p>
                    <p className="text-slate-700 leading-relaxed mb-2">Stories by Foot is not responsible for any injury, illness, loss of property, or anything that may occur during travel, tours, or activities arranged through third-party providers.</p>
                    <p className="text-slate-700 leading-relaxed mb-2">All travelers are strongly advised to obtain medical and travel insurance that covers health emergencies, evacuation, and trip cancellation.</p>
                    <p className="text-slate-700 leading-relaxed">Stories by Foot strives to ensure accuracy of content but does not warrant that descriptions, photos, or information on the Website are free of errors or omissions.</p>
                  </div>
                </div>
              </section>

              {/* Section 11 */}
              <section id="force-majeure" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">11. Force Majeure</h2>
                <p className="text-slate-700 leading-relaxed">
                  Stories by Foot and its partners shall not be liable for any delay or failure to perform obligations due to causes beyond reasonable control — including, but not limited to, natural disasters, war, pandemics, political unrest, or governmental actions. Refunds or credits in such cases will be subject to the Vendor's policy.
                </p>
              </section>

              {/* Section 12 */}
              <section id="indemnification" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">12. Indemnification</h2>
                <p className="text-slate-700 leading-relaxed mb-3">You agree to indemnify and hold harmless Stories by Foot, its founders, employees, and affiliates from any claims, damages, liabilities, or expenses (including legal fees) arising from your:</p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Violation of these Terms</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Misuse of the Website</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Infringement of third-party rights</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Actions causing loss or damage to other users or partners.</span>
                  </li>
                </ul>
              </section>

              {/* Section 13 */}
              <section id="privacy-policy" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">13. Privacy Policy</h2>
                <p className="text-slate-700 leading-relaxed">
                  Your privacy is important to us. The collection, storage, and use of your personal information are governed by our Privacy Policy, which is incorporated into these Terms by reference. By using this Website, you consent to our data practices as described in that policy. The complete Privacy Policy is published on our Website and shall be deemed an integral and binding part of these Terms and Conditions. By using this Website, you acknowledge that you have read and agreed to the complete Privacy Policy and consent to the data practices described therein.
                </p>
              </section>

              {/* Section 14 */}
              <section id="cookie-policy" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">14. Cookie Policy</h2>
                <p className="text-slate-700 leading-relaxed">
                  Our Website uses cookies and similar technologies to enhance your browsing experience, analyze website performance, and deliver personalized content. These cookies help us understand user preferences and improve our Services. The complete Cookie Policy is published on our Website and shall be deemed an integral and binding part of these Terms and Conditions. By using this Website, you acknowledge that you have read and agreed to the complete Cookie Policy and consent to the use of cookies and related technologies as described therein.
                </p>
              </section>

              {/* Section 15 */}
              <section id="changes-to-terms" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">15. Changes to Terms</h2>
                <p className="text-slate-700 leading-relaxed">
                  We may revise these Terms at any time without prior notice. The updated Terms will be effective immediately upon posting on this page. Your continued use of the Website after such updates constitutes your acceptance of the revised Terms.
                </p>
              </section>

              {/* Section 16 */}
              <section id="termination" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">16. Termination</h2>
                <p className="text-slate-700 leading-relaxed">
                  We reserve the right to suspend or terminate your access to the Website at our discretion, without prior notice, if we believe you have violated these Terms or engaged in misconduct. Any outstanding obligations or pending payments will survive termination.
                </p>
              </section>

              {/* Section 17 */}
              <section id="governing-law-and-jurisdiction" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">17. Governing Law and Jurisdiction</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.
                </p>
                <h3 className="font-bold text-slate-900 text-lg mb-2">17A. Severability</h3>
                <p className="text-slate-700 leading-relaxed">
                  If any provision of these Terms is held to be invalid or unenforceable under applicable law, the remaining provisions shall remain in full force and effect.
                </p>
              </section>

              {/* Section 18 */}
              <section id="entire-agreement" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">18. Entire Agreement</h2>
                <p className="text-slate-700 leading-relaxed">
                  These Terms and Conditions, along with our Privacy Policy and Cancellation & Refund Policy, constitute the entire agreement between you and Stories by Foot with respect to the Website and Services, superseding all prior communications, understandings, or agreements (whether oral or written).
                </p>
              </section>

              {/* Section 19 */}
              <section id="contact-information" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">19. Contact Information</h2>
                <div className="grid md:grid-cols-2 gap-6 text-slate-700 leading-relaxed mt-4">
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Email</p>
                    <p><a href="mailto:contact@storiesbyfoot.com" className="text-primary hover:underline">contact@storiesbyfoot.com</a></p>
                    <p><a href="mailto:storiesbyfoot@gmail.com" className="text-primary hover:underline">storiesbyfoot@gmail.com</a></p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Phone</p>
                    <p><a href="tel:+916205129118" className="text-primary hover:underline">+916205129118</a></p>
                    <p><a href="tel:+916283620764" className="text-primary hover:underline">+916283620764</a></p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Website</p>
                    <p><a href="https://storiesbyfoot.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://storiesbyfoot.com</a></p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Registered Office</p>
                    <p>91, GK Crystal Home, KL Highway, SAS Nagar, Punjab - 140307</p>
                  </div>
                </div>
              </section>

              {/* Disclaimer */}
              <section className="space-y-4 pt-8">
                <h2 className="text-3xl font-bold text-slate-900">Disclaimer</h2>
                <p className="text-slate-700 leading-relaxed">
                  All travel experiences, photos, and reviews featured on Stories by Foot are for informational and inspirational purposes only. Actual experiences may vary due to weather conditions, local regulations, or third-party operations. Stories by Foot does not guarantee any specific outcome, availability, or satisfaction level for services provided by third parties.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
