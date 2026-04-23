import Navigation from "@/components/Navigation";
import { useRef } from "react";

const Index = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-white flex flex-col pt-16">
      <Navigation />

      <iframe
        ref={iframeRef}
        src="/cliffhanger/index.html"
        className="w-full flex-1 border-none block"
        title="Cliffhanger Home"
      />
    </div>
  );
};

export default Index;
