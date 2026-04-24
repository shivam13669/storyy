import Navigation from "@/components/Navigation";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("100vh");

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "resize-iframe") {
        setIframeHeight(`${event.data.height}px`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="w-full bg-white flex flex-col pt-16 min-h-screen">
      <Navigation />

      <iframe
        ref={iframeRef}
        src="/cliffhanger/index.html"
        style={{ height: iframeHeight }}
        className="w-full border-none block"
        scrolling="no"
        title="Cliffhanger Home"
      />
    </div>
  );
};

export default Index;
