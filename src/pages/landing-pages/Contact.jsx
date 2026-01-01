import { useState } from "react";
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import Bg from "../../assets/images/background/categories-background.webp";

const Contact = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I search for rental properties?",
      answer:
        "You can search for rental properties using our search bar on the home page. Simply enter your desired location, select property type, and specify the number of guests. Our advanced filtering options allow you to narrow down your search based on your specific requirements.",
    },
    {
      question: "Is there a fee to list my property?",
      answer:
        "Blue Haven Rentals offers flexible listing options. Basic listings are free, allowing you to showcase your property to thousands of potential renters. We also offer premium listing options with enhanced visibility and additional features for a small fee.",
    },
    {
      question: "How do I contact property owners?",
      answer:
        "Once you find a property you're interested in, click on the listing to view full details. You'll find contact information and a direct messaging feature to communicate with the property owner. All communications are secure and private.",
    },
    {
      question: "Are the properties verified?",
      answer:
        "Yes, all properties listed on Blue Haven Rentals go through a verification process. We verify ownership documentation and ensure that listings meet our quality standards. However, we always recommend visiting properties in person before making any commitments.",
    },
    {
      question: "What areas do you cover?",
      answer:
        "Blue Haven Rentals covers all major cities and districts across Sri Lanka, including Colombo, Kandy, Galle, Jaffna, and many more. You can use our location finder to explore available properties in your desired area.",
    },
    {
      question: "How do I report an issue with a listing?",
      answer:
        "If you encounter any issues with a listing or suspect fraudulent activity, please contact us immediately through our support email or phone. We take all reports seriously and will investigate promptly to maintain the integrity of our platform.",
    },
  ];

  return (
    <div id="contact" className="min-h-screen relative overflow-hidden mt-5">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={Bg}
          alt="Contact background"
          className="flex items-center justify-center object-cover w-full h-full opacity-100"
        />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden z-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/15 rounded-full blur-lg animate-bounce"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-20 px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16 animate-fadeInUp">
            <h1 className="Hugiller-font-style text-[48px] sm:text-[70px] md:text-[80px] lg:text-[80px] text-[#263D5D] leading-[1.1] mb-4">
              Get In
              <br />
              <span className="text-[#3ABBD0]">Touch</span> With Us
            </h1>
            <p className="font-montserrat text-base md:text-[17px] lg:text-[17px] text-[#303435] mb-6 opacity-80 rounded-full mx-auto max-w-5xl p-3">
              We're here to help you find your perfect haven. Reach out to us
              anytime!
            </p>
          </div>

          {/* Contact Information Section */}
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-12 animate-slideInLeft">
            {/* Email Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-white/30 group hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-[#3ABBD0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-[#3ABBD0]" />
                </div>
                <h3 className="Hugiller-font-style text-[28px] text-[#263D5D] mb-3">
                  Email Us
                </h3>
                <p className="text-sm md:text-base text-[#303435] mb-2">
                  Send us your questions anytime
                </p>
                <a
                  href="mailto:info@bluehavenrentals.lk"
                  className="text-[#3ABBD0] hover:text-[#2BA9C1] transition-colors duration-300 font-medium"
                >
                  info@bluehavenrentals.lk
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-white/30 group hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-[#3ABBD0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-[#3ABBD0]" />
                </div>
                <h3 className="Hugiller-font-style text-[28px] text-[#263D5D] mb-3">
                  Call Us
                </h3>
                <p className="text-sm md:text-base text-[#303435] mb-2">
                  Mon-Sat from 8am to 6pm
                </p>
                <a
                  href="tel:+94112345678"
                  className="text-[#3ABBD0] hover:text-[#2BA9C1] transition-colors duration-300 font-medium"
                >
                  +94 11 234 5678
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 relative border border-white/30 group hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-[#3ABBD0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[#3ABBD0]" />
                </div>
                <h3 className="Hugiller-font-style text-[28px] text-[#263D5D] mb-3">
                  Visit Us
                </h3>
                <p className="text-sm md:text-base text-[#303435]">
                  123 Galle Road, Colombo 03
                  <br />
                  Sri Lanka
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto animate-slideInRight">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 relative border border-white/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10">
                <h2 className="font-montserrat text-[30px]  font-bold text-[#263D5D] text-center mb-8">
                  Frequently Asked{" "}
                  <span className="text-[#3ABBD0]">Questions</span>
                </h2>

                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-[#3ABBD0]/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#3ABBD0]/40"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-5 text-left bg-white/50 hover:bg-white/70 transition-colors duration-300"
                      >
                        <span className="text-[#263D5D] font-medium text-base md:text-lg pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#3ABBD0] flex-shrink-0 transition-transform duration-300 ${
                            openFaqIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          openFaqIndex === index
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-5 pt-0 bg-white/30">
                          <p className="text-[#303435] text-sm md:text-base leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-12 text-center animate-fadeInUp">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 relative border border-white/30 max-w-3xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>

              <div className="relative z-10">
                <h3 className="Hugiller-font-style text-[32px] md:text-[40px] text-[#263D5D] mb-4">
                  Still Have <span className="text-[#3ABBD0]">Questions?</span>
                </h3>
                <p className="text-[#303435] text-base md:text-lg mb-6 max-w-2xl mx-auto">
                  Can't find the answer you're looking for? Our friendly team is
                  here to help. Feel free to reach out through any of the
                  channels above.
                </p>
                <a
                  href="mailto:info@bluehavenrentals.lk"
                  className="inline-block bg-gradient-to-r from-[#3ABBD0] to-[#2BA9C1] hover:from-[#2BA9C1] hover:to-[#3ABBD0] text-white font-medium px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
};

export default Contact;
