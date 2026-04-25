import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsVisible(false);
  }, [location.pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, [location.pathname]);

  const getAnimClass = (slideDirection: string) => {
    if (!isVisible) return "opacity-0";
    return `animate-in fade-in ${slideDirection} duration-1000 fill-mode-both`;
  };

  return (
    <>
      <style>{`
        .social-icon {
          position: relative;
          text-align: center;
          width: 46px;
          height: 46px;
          font-size: 20px;
          line-height: 46px;
          border-radius: 50%;
          box-shadow: inset 0 0 0 4px #3a3e43;
          transition: color .3s;
          z-index: 1;
          color: rgba(255, 255, 255, 0.3);
          display: inline-block;
        }
        .social-icon:focus, .social-icon:active {
          color: #ffffff;
        }
        .social-icon:hover {
          color: #01b3a7;
          background: transparent;
          transition-duration: 0s;
          transition-delay: .3s;
        }
        .social-icon::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 2px;
          border-radius: 50%;
          background: #3a3e43;
          pointer-events: none;
          transition: transform 0.2s, opacity 0.3s;
          z-index: -1;
        }
        .social-icon:hover::after {
          opacity: 0;
          transform: scale(1.3);
        }
      `}</style>
      
      <footer ref={footerRef} className="bg-[#162e44] text-white/80 font-['Poppins',sans-serif] text-[14px] overflow-hidden leading-[1.72]">
        <div className="py-[60px] lg:py-[90px]">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 justify-between">
              
              {/* Contact Us - slideInRight */}
              <div className={`lg:col-span-4 lg:pr-8 ${getAnimClass('slide-in-from-right-8')}`}>
                <h6 className="font-['Montserrat',sans-serif] text-[16px] tracking-[0.05em] font-medium uppercase mb-[27px] text-white">Contact us</h6>
                <ul className="space-y-[15px]">
                  <li>
                    <div className="flex items-center">
                      <div className="mr-4"><span className="fa fa-phone text-[#01b3a7] text-[24px] align-middle min-w-[21px]"></span></div>
                      <div className="flex-1">
                        <a href="tel:+916205129118" className="text-[14px] leading-[1.72] tracking-[0.025em] text-white/80 hover:text-[#01b3a7] transition-colors">+91 6205129118</a>
                        <br />
                        <a href="tel:+916283620764" className="text-[14px] leading-[1.72] tracking-[0.025em] text-white/80 hover:text-[#01b3a7] transition-colors">+91 6283620764</a>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <div className="mr-4"><span className="fa fa-envelope text-[#01b3a7] text-[24px] align-middle min-w-[21px]"></span></div>
                      <div className="flex-1"><a href="mailto:#" className="text-[14px] leading-[1.72] tracking-[0.025em] text-white/80 hover:text-[#01b3a7] transition-colors">contact@storiesbyfoot.com</a></div>
                    </div>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <div className="mr-4"><span className="fa fa-location-arrow text-[#01b3a7] text-[24px] align-middle min-w-[21px]"></span></div>
                      <div className="flex-1"><a href="#" className="text-[14px] leading-[1.72] tracking-[0.025em] text-white/80 hover:text-[#01b3a7] transition-colors max-w-[192px] block">91, GK Crystal Home, KL Highway,
SAS Nagar, Punjab - 140307, India</a></div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Popular News - slideInDown */}
              <div className={`lg:col-span-4 lg:px-4 ${getAnimClass('slide-in-from-top-8')}`}>
                <h6 className="font-['Montserrat',sans-serif] text-[16px] tracking-[0.05em] font-medium uppercase mb-[27px] text-white">Popular news</h6>
                <div className="space-y-[26px]">
                  <article className="max-w-[220px]">
                    <p className="mb-0">
                      <a href="#" className="text-[#01b3a7] hover:text-[#ffffff] transition-colors font-normal text-[14px] leading-[1.6]">
                        Your Personal Guide to 5 Best Places to Visit on Earth
                      </a>
                    </p>
                    <div className="text-[12px] leading-[1] font-normal tracking-[0.075em] font-['Montserrat',sans-serif] text-white/25 mt-[10px]">
                      <time dateTime="2019-05-04">May 04, 2019</time>
                    </div>
                  </article>
                  <article className="max-w-[220px]">
                    <p className="mb-0">
                      <a href="#" className="text-[#01b3a7] hover:text-[#ffffff] transition-colors font-normal text-[14px] leading-[1.6]">
                        Top 10 Hotels: Rating by Stories by Foot Travel Experts
                      </a>
                    </p>
                    <div className="text-[12px] leading-[1] font-normal tracking-[0.075em] font-['Montserrat',sans-serif] text-white/25 mt-[10px]">
                      <time dateTime="2019-05-04">May 04, 2019</time>
                    </div>
                  </article>
                </div>
              </div>

              {/* Quick Links - slideInLeft */}
              <div className={`lg:col-span-4 lg:pl-8 ${getAnimClass('slide-in-from-left-8')}`}>
                <h6 className="font-['Montserrat',sans-serif] text-[16px] tracking-[0.05em] font-medium uppercase mb-[27px] text-white">Quick links</h6>
                <ul className="space-y-[6px] mb-8">
                  <li className="flex items-center">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#01b3a7] mr-3"></span>
                    <Link to="/about" className="text-[14px] leading-[1.72] text-white/80 hover:text-[#01b3a7] transition-colors">About us</Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#01b3a7] mr-3"></span>
                    <Link to="/destinations" className="text-[14px] leading-[1.72] text-white/80 hover:text-[#01b3a7] transition-colors">Our Tours</Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#01b3a7] mr-3"></span>
                    <Link to="/contact" className="text-[14px] leading-[1.72] text-white/80 hover:text-[#01b3a7] transition-colors">Our Team</Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#01b3a7] mr-3"></span>
                    <Link to="#" className="text-[14px] leading-[1.72] text-white/80 hover:text-[#01b3a7] transition-colors">Gallery</Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#01b3a7] mr-3"></span>
                    <Link to="/blog" className="text-[14px] leading-[1.72] text-white/80 hover:text-[#01b3a7] transition-colors">Blog</Link>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link 
                    to="/contact"
                    className="group relative z-0 inline-flex items-center justify-center overflow-hidden bg-[#01b3a7] text-white hover:text-[#ffffff] px-[36px] py-[16px] font-normal uppercase tracking-[0.05em] text-[14px] transition-colors [transition-duration:400ms] [transition-timing-function:cubic-bezier(0.2,1,0.3,1)] rounded-[4px] border border-transparent hover:border-[#01b3a7]"
                  >
                    <span className="absolute inset-0 z-[-1] w-[101%] h-[101%] bg-white opacity-0 scale-x-[0.7] transition-all [transition-duration:420ms] [transition-timing-function:cubic-bezier(0.2,1,0.3,1)] group-hover:opacity-100 group-hover:scale-x-100 origin-center rounded-[4px]"></span>
                    <span className="relative z-10 group-hover:text-[#01b3a7] transition-colors duration-200">Get in touch</span>
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="bg-[#11263a] py-[30px] relative">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-[10px]">
              
              {/* Copyright - Left */}
              <div className="md:w-1/3 order-3 md:order-1 text-center md:text-left text-[14px] text-white/30 font-['Poppins',sans-serif] tracking-[0.025em]">
  <div className="mb-0 leading-[1.7]">
    <p>
      © {new Date().getFullYear()} Stories by Foot. All Rights Reserved.
    </p>

    <p className="mt-1">
      Design by{" "}
      <a
        href="https://www.khoobneek.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[#01b3a7] transition-colors"
      >
        khoobneek.com
      </a>
    </p>
  </div>
</div>
              
              {/* Socials - Center */}
              <div className="md:w-1/3 order-1 md:order-2 flex justify-center">
                <ul className="flex space-x-[10px]">
                  <li><a className="social-icon fa fa-facebook" href="https://www.facebook.com/planyortrip/" target="_blank" rel="noopener noreferrer"></a></li>
                  <li><a className="social-icon fa fa-linkedin" href="https://www.linkedin.com/company/plan-yor-trip/" target="_blank" rel="noopener noreferrer"></a></li>
                  <li><a className="social-icon fa fa-google-plus" href="https://share.google/LWFZFPIkxRY04QnTp" target="_blank" rel="noopener noreferrer"></a></li>
                  <li><a className="social-icon fa fa-instagram" href="https://www.instagram.com/storiesbyfoot/" target="_blank" rel="noopener noreferrer"></a></li>
                </ul>
              </div>

              {/* Privacy Policy - Right */}
              <div className="md:w-1/3 order-2 md:order-3 text-center md:text-right text-[14px] text-white/30 font-['Poppins',sans-serif] tracking-[0.025em]">
                <p className="mb-0"><a href="#" className="hover:text-[#01b3a7] transition-colors">Privacy Policy</a></p>
              </div>
              
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
