// components/Layout.jsx
import Footer from "../footer/components/Footer";
import Navcomponent from "./components/Navcomponent";



const Layout = ({ children }) => {
  return (
    <>
      <Navcomponent className="pt-[72px]"/>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
