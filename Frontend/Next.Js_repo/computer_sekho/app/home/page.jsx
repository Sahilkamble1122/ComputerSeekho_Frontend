import OurRecruiters from "./components/OurRecruiters";
import Gallery from "../upcomingevents/components/Gallery";
import HeroSection from "./components/HeroSection";
import WhyChooseUs from "./components/WhychooseUs";
import CoursesSection from "./components/CoursesSection";
import HomeGallerySection from "./components/HomeGallerySection";

const page = () => {
  return (
    <div className="flex flex-col overflow-x-hidden min-h-screen">
      <HeroSection />
      <CoursesSection />
      <HomeGallerySection />
      <OurRecruiters />
      <WhyChooseUs />
    </div>
  );
};

export default page;
