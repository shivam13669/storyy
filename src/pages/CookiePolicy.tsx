import Navigation from "@/components/Navigation";

const sections = [
  "Purpose of This Policy",
  "What Are Cookies",
  "Types of Cookies We Use",
  "How We Use Cookie Data",
  "Managing and Disabling Cookies",
  "Third-Party Tools and Services",
  "Data Protection and Privacy",
  "Updates to This Policy",
  "Contact Information",
  "Disclaimer"
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ scrollBehavior: "smooth" }}>
      <Navigation />
      <main className="pt-16">
        {/* Header Section */}
        <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 md:py-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-slate-600 mb-4">
              How we use cookies and similar tracking technologies
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
                  Welcome to Stories by Foot ("we," "our," or "us"). This Cookie Policy explains how we use cookies and similar tracking technologies on our website <a href="https://storiesbyfoot.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">https://storiesbyfoot.com</a> (the "Website") and related online services (collectively, the "Services").
                </p>
                <p className="text-slate-700 leading-relaxed text-lg">
                  By accessing or using our Website, you agree to the use of cookies in accordance with this Policy. If you do not agree, you may adjust your browser settings to disable cookies; however, some features of the Website may not function properly without them.
                </p>
              </section>

              {/* Section 1 */}
              <section id="purpose-of-this-policy" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">1. Purpose of This Policy</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  The purpose of this Cookie Policy is to inform you about:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>What cookies are</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>How and why Stories by Foot uses them</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>The types of cookies we use</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>How you can control or delete them.</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  This Policy should be read in conjunction with our Privacy Policy, which explains how we collect, use, and safeguard your personal information.
                </p>
              </section>

              {/* Section 2 */}
              <section id="what-are-cookies" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">2. What Are Cookies</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Cookies are small text files placed on your device when you visit a website. They are widely used to ensure websites function efficiently, remember user preferences, and provide analytics for improvement.
                </p>
                <p className="text-slate-700 leading-relaxed pt-3 border-t border-slate-200">
                  Cookies do not typically contain personally identifiable information, but may be linked to such information if you have provided it through our Website.
                </p>
              </section>

              {/* Section 3 */}
              <section id="types-of-cookies-we-use" className="space-y-6 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">3. Types of Cookies We Use</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Stories by Foot uses the following categories of cookies on its Website:
                </p>

                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.1. Essential Cookies</h3>
                    <p className="text-slate-700 leading-relaxed">These cookies are required for the Website to function correctly. They enable key features such as secure login, form submissions, and navigation. Disabling these cookies may affect the Website's core functionality.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.2. Performance and Analytics Cookies</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">These cookies help us understand how visitors interact with the Website — such as which pages are visited most often or if users encounter errors.</p>
                    <p className="text-slate-700 leading-relaxed mb-2">We use this data to enhance user experience and improve performance.</p>
                    <p className="text-slate-700 leading-relaxed">Analytics may be conducted using tools such as Google Analytics or similar trusted platforms.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.3. Functional Cookies</h3>
                    <p className="text-slate-700 leading-relaxed">These cookies allow the Website to remember your choices, such as language preference or location, providing a more personalized experience.</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-bold text-slate-900 text-lg mb-2">3.4. Advertising and Third-Party Cookies</h3>
                    <p className="text-slate-700 leading-relaxed mb-2">Some cookies may be placed by third-party service providers for marketing, advertising, or social media purposes. These cookies may track your browsing activity across different websites.</p>
                    <p className="text-slate-700 leading-relaxed">Stories by Foot does not control these third-party cookies and encourages you to review their respective privacy and cookie policies.</p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="how-we-use-cookie-data" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">4. How We Use Cookie Data</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  We use cookies to:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Ensure the Website functions smoothly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Analyze traffic and usage patterns</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Improve the design, content, and services offered</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Enhance your browsing experience by remembering preferences</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Deliver personalized content and recommendations.</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  Cookies are not used to collect sensitive personal data such as passwords or payment details.
                </p>
              </section>

              {/* Section 5 */}
              <section id="managing-and-disabling-cookies" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">5. Managing and Disabling Cookies</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Delete existing cookies from your device</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Block cookies from specific websites</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Configure your browser to alert you before storing cookies.</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-3 border-t border-slate-200 mt-3">
                  Instructions for managing cookies can be found on the browser's official support pages.
                </p>
                <p className="text-slate-700 leading-relaxed pt-3">
                  Please note that disabling cookies may limit certain features or functions of the Website.
                </p>
              </section>

              {/* Section 6 */}
              <section id="third-party-tools-and-services" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">6. Third-Party Tools and Services</h2>
                <p className="text-slate-700 leading-relaxed mb-3">
                  Stories by Foot may use trusted third-party tools, such as:
                </p>
                <ul className="space-y-3 text-slate-700 leading-relaxed ml-4">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Google Analytics (for usage tracking and performance insights)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold min-w-fit">•</span>
                    <span>Social Media Plugins (for content sharing and engagement).</span>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed pt-4 border-t border-slate-200 mt-4">
                  These third parties may use cookies in accordance with their own privacy policies.
                </p>
              </section>

              {/* Section 7 */}
              <section id="data-protection-and-privacy" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">7. Data Protection and Privacy</h2>
                <p className="text-slate-700 leading-relaxed mb-2">
                  All data collected through cookies is handled in accordance with our Privacy Policy.
                </p>
                <p className="text-slate-700 leading-relaxed mb-2">
                  We do not sell, rent, or disclose any cookie data for profit.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  You can review our full Privacy Policy at our website.
                </p>
              </section>

              {/* Section 8 */}
              <section id="updates-to-this-policy" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">8. Updates to This Policy</h2>
                <p className="text-slate-700 leading-relaxed mb-2">
                  We may revise or update this Cookie Policy from time to time to reflect changes in technology, legal requirements, or business operations.
                </p>
                <p className="text-slate-700 leading-relaxed mb-2">
                  Any updates will be posted on this page with a revised "Last Updated" date.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Your continued use of the Website following any changes constitutes acceptance of the updated Policy. This Cookie Policy is an integral part of our overall Privacy and Data Protection framework and should be read together with our Privacy Policy and Terms and Conditions.
                </p>
              </section>

              {/* Section 9 */}
              <section id="contact-information" className="space-y-4 pb-8 border-b border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900">9. Contact Information</h2>
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
              <section className="space-y-4 pt-8">
                <h2 className="text-3xl font-bold text-slate-900">Disclaimer</h2>
                <p className="text-slate-700 leading-relaxed">
                  Cookies help enhance your browsing experience and enable Stories by Foot to improve its content and services. While we take reasonable precautions to protect your data, we cannot guarantee complete security against unauthorized access resulting from factors beyond our control.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
