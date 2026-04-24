import Navigation from "@/components/Navigation";

const sections = [
  "Information We Collect",
  "Use of Collected Information",
  "Cookies and Tracking Technologies",
  "Sharing and Disclosure of Information",
  "Data Storage and Security",
  "Your Rights and Choices",
  "Data Retention",
  "Third-Party Links",
  "Children's Privacy",
  "International Users",
  "Changes to this Privacy Policy",
  "Contact Information",
  "Disclaimer"
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ scrollBehavior: "smooth" }}>
      <Navigation />
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              How we collect, use, and protect your personal information
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
              <section className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Welcome to Stories by Foot ("we," "our," or "us"). This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit or use our website <a href="https://storiesbyfoot.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">https://storiesbyfoot.com</a> (the "Website") and any related features, services, or content (collectively, the "Services"). By using our Website, you consent to the practices described in this Privacy Policy. If you do not agree with any part of this Policy, please discontinue using our Services.
                </p>
                <p className="text-slate-700 leading-relaxed text-lg">
                  Stories by Foot, together with its trusted service partners, manages and safeguards personal information collected through this Website in accordance with this Privacy Policy and the Terms and Conditions.
                </p>
              </section>

              {/* Section 1 */}
              <section id="information-we-collect" className="space-y-6 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">1. Information We Collect</h2>
                <p className="text-slate-700 leading-relaxed">
                  We collect personal and non-personal information from you in several ways, including:
                </p>

                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3">1.1. Information You Provide Voluntarily</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">When you:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Register an account or subscribe to our newsletter</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Make a booking or submit a travel inquiry</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Contact us via email or chat</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Submit reviews, stories, or images</span>
                      </li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-4 mb-2">The information you provide may include:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Full name</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Email address</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Contact number</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Payment or billing details (processed via secure gateways)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Travel preferences and booking details</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Any content you share (such as reviews, photos, or stories)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">1.2. Information Collected Automatically</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">When you visit our Website, we may automatically collect:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>IP address and browser type</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Device information (mobile/desktop, OS)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Pages visited, time spent, and referring URLs</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Cookie data and analytics identifiers</span>
                      </li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">We use this data for website optimization, analytics, and personalized user experiences.</p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="use-of-collected-information" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">2. Use of Collected Information</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We use your information for legitimate business purposes, including:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>To process bookings, payments, and confirmations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>To communicate with you about inquiries, trips, or offers</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>To personalize your website experience and show relevant destinations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>To send newsletters, travel updates, or promotional materials (you may opt out anytime)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>To improve our Website, security, and services</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>To comply with legal or regulatory obligations</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  We do not sell or rent your personal data to any third parties. We process personal information based on your consent, contractual necessity (to provide booked services), or legitimate business interests such as service improvement and fraud prevention.
                </p>
              </section>

              {/* Section 3 */}
              <section id="cookies-and-tracking-technologies" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">3. Cookies and Tracking Technologies</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Our Website uses cookies and similar tracking tools to:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Enable core functionality (e.g., login sessions, preferences)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Analyze visitor interactions using tools like Google Analytics</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Provide personalized recommendations and advertisements</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  You can manage or disable cookies in your browser settings, though some features of the Website may not function properly if cookies are disabled. By using this Website, you acknowledge that you have read and agreed to the complete Cookie Policy and consent to the use of cookies and related technologies as described therein.
                </p>
              </section>

              {/* Section 4 */}
              <section id="sharing-and-disclosure-of-information" className="space-y-6 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">4. Sharing and Disclosure of Information</h2>
                <p className="text-slate-700 leading-relaxed">
                  We may share your information in the following situations:
                </p>

                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.1. With Service Providers and Partners</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">To fulfill your bookings and provide travel services, we may share limited necessary information with trusted partners, such as:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Hotels, airlines, and tour operators</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Payment processors and verification services</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>IT and customer support providers</span>
                      </li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">All such partners are bound by confidentiality and data protection obligations.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-3">4.2. Legal Obligations</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">We may disclose your information if required by law, court order, or government authority to:</p>
                    <ul className="space-y-2 text-slate-700 leading-relaxed">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Comply with legal requirements</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Protect our rights or prevent fraud</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold min-w-fit">•</span>
                        <span>Respond to legitimate law enforcement requests</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">4.3. Business Transfers</h3>
                    <p className="text-slate-700 leading-relaxed">If Stories by Foot undergoes a merger, acquisition, or reorganization, your data may be transferred as part of that transaction, but your privacy rights will remain protected.</p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="data-storage-and-security" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">5. Data Storage and Security</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We employ reasonable administrative, technical, and physical safeguards to protect your information from unauthorized access, loss, misuse, or alteration. Sensitive information (like payment details) is processed through secure, PCI-DSS compliant payment gateways.
                </p>
                <p className="text-slate-700 leading-relaxed pt-3 border-t border-slate-200">
                  While we strive to protect your data, no online platform can guarantee absolute security. You use our Website at your own risk.
                </p>
              </section>

              {/* Section 6 */}
              <section id="your-rights-and-choices" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">6. Your Rights and Choices</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Depending on your jurisdiction, you may have the right to:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Access, correct, or delete your personal data</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Withdraw consent for marketing communications</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Request details on how your information is used</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  You can exercise these rights by emailing us at <a href="mailto:storiesbyfoot@gmail.com" className="text-primary hover:underline font-semibold">storiesbyfoot@gmail.com</a>.
                </p>
              </section>

              {/* Section 7 */}
              <section id="data-retention" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">7. Data Retention</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We retain your information only for as long as necessary to:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Provide our services and process transactions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Fulfill legal, tax, or accounting obligations</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Resolve disputes and enforce our Terms</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  Once no longer needed, data is securely deleted or anonymized.
                </p>
              </section>

              {/* Section 8 */}
              <section id="third-party-links" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">8. Third-Party Links</h2>
                <p className="text-slate-700 leading-relaxed">
                  Our Website may contain links to external websites (e.g., hotel partners, tourism boards). Stories by Foot is not responsible for the privacy practices or content of such third-party sites. We encourage you to review their policies before interacting or sharing information.
                </p>
              </section>

              {/* Section 9 */}
              <section id="childrens-privacy" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">9. Children's Privacy</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Our Services are primarily intended for individuals who are 18 years of age or older. If you are under 18 years of age, you may use our Services only under the supervision and consent of a parent or legal guardian.
                </p>
                <p className="text-slate-700 leading-relaxed pt-3 border-t border-slate-200">
                  We do not knowingly collect or store personal information from minors. If we become aware that data from a child has been collected without appropriate consent, we will delete such information promptly and take reasonable steps to ensure compliance with our prevailing privacy standards.
                </p>
              </section>

              {/* Section 10 */}
              <section id="international-users" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">10. International Users</h2>
                <p className="text-slate-700 leading-relaxed">
                  If you are accessing our Website from outside India, please note that your information may be transferred to and processed in India, where data protection laws may differ from your jurisdiction. By using our Website, you consent to such transfers.
                </p>
              </section>

              {/* Section 11 */}
              <section id="changes-to-this-privacy-policy" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">11. Changes to this Privacy Policy</h2>
                <p className="text-slate-700 leading-relaxed">
                  Stories by Foot reserves the right to modify or update this Privacy Policy at any time. All changes will be posted on this page with an updated "Last Updated" date. Your continued use of the Website after changes signifies acceptance of the revised Policy.
                </p>
              </section>

              {/* Section 12 */}
              <section id="contact-information" className="space-y-4 pb-8 border-b border-slate-200" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">12. Contact Information</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  For any queries, complaints, or support, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-slate-700 leading-relaxed">
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
              <section className="space-y-4 pt-8" style={{ scrollMarginTop: "120px" }}>
                <h2 className="text-3xl font-bold text-slate-900">Disclaimer</h2>
                <p className="text-slate-700 leading-relaxed">
                  Stories by Foot values your trust and takes your privacy seriously. While we adopt best practices to protect your information, no electronic storage or transmission method is completely secure. Use of our Website implies your acceptance of this inherent risk.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
