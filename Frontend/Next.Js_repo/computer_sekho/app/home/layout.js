// components/Layout.jsx
import Footer from "../footer/components/Footer";
import Navcomponent from "./components/Navcomponent";



const Layout = ({ children }) => {
  return (
    <>
      <Navcomponent />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
