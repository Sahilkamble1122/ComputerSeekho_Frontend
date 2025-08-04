import Coursecard from "../courses/components/Coursecard";
import OurRecruiters from "./components/OurRecruiters";
import Gallery from "../upcomingevents/components/Gallery";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhychooseUs";

const page = () => {
  return (
    <div className="flex flex-col overflow-x-hidden min-h-screen">
      <HeroSection />
      <Coursecard />
      <Gallery />
      <OurRecruiters />
      <WhyChooseUs />
    </div>
  );
};

export default page;
