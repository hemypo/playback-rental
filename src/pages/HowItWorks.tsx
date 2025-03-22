
import { CalendarIcon, CameraIcon, CheckSquareIcon, ClockIcon, MapPinIcon, PackageIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="heading-1 mb-6">How Our Rental Service Works</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Renting professional equipment has never been easier. Follow our simple process to get the gear you need for your next project.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12">
              {[
                {
                  step: 1,
                  title: "Browse Our Catalog",
                  description: "Explore our extensive collection of professional equipment. Filter by category or search for specific items.",
                  icon: <PackageIcon className="h-10 w-10 text-primary" />,
                },
                {
                  step: 2,
                  title: "Check Availability",
                  description: "View the availability calendar for your selected equipment to ensure it's available during your desired rental period.",
                  icon: <CalendarIcon className="h-10 w-10 text-primary" />,
                },
                {
                  step: 3,
                  title: "Select Rental Period",
                  description: "Choose your rental period with our flexible options: 4 hours, 1 day, 3 days, or 5+ days. Enjoy discounts on longer rentals.",
                  icon: <ClockIcon className="h-10 w-10 text-primary" />,
                },
                {
                  step: 4,
                  title: "Complete Booking",
                  description: "Provide your details and complete the booking process. You'll receive a confirmation email with all the information.",
                  icon: <UserIcon className="h-10 w-10 text-primary" />,
                },
                {
                  step: 5,
                  title: "Pickup Equipment",
                  description: "Visit our location to pick up your equipment. Our staff will help you get set up and answer any questions.",
                  icon: <MapPinIcon className="h-10 w-10 text-primary" />,
                },
                {
                  step: 6,
                  title: "Create Your Project",
                  description: "Use our professional equipment for your project with confidence. We provide technical support if needed.",
                  icon: <CameraIcon className="h-10 w-10 text-primary" />,
                },
                {
                  step: 7,
                  title: "Return Equipment",
                  description: "Return the equipment at the end of your rental period. Our staff will check it and complete the process.",
                  icon: <CheckSquareIcon className="h-10 w-10 text-primary" />,
                },
              ].map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                        {step.step}
                      </div>
                      <h3 className="text-xl font-medium">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Information */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Our Rental Pricing</h2>
            <p className="body-text max-w-2xl mx-auto">
              We offer flexible rental periods with competitive pricing. Enjoy discounts on longer rentals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                period: "4 Hours",
                description: "Perfect for short shoots and quick projects",
                price: "70% of daily rate",
                feature: "Same-day rental"
              },
              {
                period: "1 Day",
                description: "Our standard rental period for most projects",
                price: "Base daily rate",
                feature: "24-hour rental period"
              },
              {
                period: "3 Days",
                description: "Ideal for weekend projects and events",
                price: "10% discount per day",
                feature: "Extended shooting time"
              },
              {
                period: "5+ Days",
                description: "For longer productions and special projects",
                price: "30% discount per day",
                feature: "Maximum savings"
              }
            ].map((option, index) => (
              <Card key={index} className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{option.period}</h3>
                <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                <div className="bg-primary/10 rounded-lg py-3 px-4 mb-4">
                  <p className="font-medium text-primary">{option.price}</p>
                </div>
                <p className="text-sm flex items-center justify-center">
                  <CheckSquareIcon className="h-4 w-4 mr-2 text-green-500" />
                  {option.feature}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Frequently Asked Questions</h2>
            <p className="body-text max-w-2xl mx-auto">
              Have questions about our rental process? Find answers to common questions below.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Do you require a deposit for equipment rental?",
                answer: "Yes, we require a security deposit that is fully refundable upon return of the equipment in good condition. The deposit amount varies depending on the equipment value."
              },
              {
                question: "What happens if I return the equipment late?",
                answer: "Late returns are charged at the daily rate. We recommend contacting us in advance if you need to extend your rental period, as this may be accommodated at a discounted rate."
              },
              {
                question: "Do you offer delivery services?",
                answer: "Yes, we offer delivery for an additional fee based on distance. Please contact us for a quote on delivery to your location."
              },
              {
                question: "What identification is required for rental?",
                answer: "We require a valid government-issued photo ID and a credit card in the same name. For businesses, we may require additional documentation."
              },
              {
                question: "Is rental insurance required?",
                answer: "We offer equipment protection plans that cover accidental damage. While not mandatory, we strongly recommend this coverage for peace of mind."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 rounded-xl glass-card">
                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-2 mb-6">Ready to Rent Equipment?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our catalog now to find the perfect equipment for your next project.
          </p>
          <Button size="lg" variant="default" asChild className="bg-white text-primary hover:bg-white/90">
            <Link to="/catalog">Browse Equipment Catalog</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
