import Link from "next/link"

const Footer = () => {
  return (
   <footer className="bg-gray-100 pt-10 ">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-wrap justify-between gap-10">
      
    
      <div className="w-full sm:w-[250px]">
        <div className="flex items-center space-x-2 mb-4">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-blue-900">SMVITA</span>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          I must explain to you how all this mistaken idea of denoung pleure and praising pain was born and give you a coete account of the system.
        </p>
   
        <div className="flex space-x-4">
          <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">f</Link>
          <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">p</Link>
          <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">v</Link>
          <Link href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">t</Link>
        </div>
      </div>

     
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-bold mb-3 text-gray-800 uppercase">Information</h4>
        <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li><Link href="#">Admission</Link></li>
          <li><Link href="/placements">Placements</Link></li>
          <li><Link href="/faculty">Faculty</Link></li>
          <li><Link href="#">Hostel & Dinning</Link></li>
          <li><Link href="#">TimeTable</Link></li>
        </ul>
      </div>

      
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-bold mb-3 text-gray-800 uppercase">Useful Links</h4>
        <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li><Link href="/courses">Our Courses</Link></li>
          <li><Link href="/getintouch">About Us</Link></li>
          <li><Link href="/faculty">Teachers & Faculty</Link></li>
          <li><Link href="#">Teams & Conditions</Link></li>
          <li><Link href="#">Our Events</Link></li>
        </ul>
      </div>

    
      <div className="flex-1 min-w-[200px]">
        <h4 className="text-lg font-bold mb-3 text-gray-800 uppercase">Get In Touch</h4>
        <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
        <p className="text-gray-600 text-sm mb-2">
          5th Floor, Vidyanidhi Education Complex, Vidyanidhi Road, Juhu Scheme, Andheri (W), Mumbai 400 049 India
        </p>
        <p className="text-gray-600 text-sm mb-1"> 090294 35311</p>
        <p className="text-gray-600 text-sm mb-1"> 9324095272</p>
        <p className="text-gray-600 text-sm mb-1">training@vidyanidhi.com</p>
        <p className="text-gray-600 text-sm">www.vidhyanidhi.com</p>
      </div>
    </div>
  </div>

  
  <div className="bg-indigo-900 text-white mt-20 text-center py-4 text-sm w-full">
    Copyright © <span className="font-semibold">VidhyaNidhi SMVITA</span> 2025. All Right Reserved By 
    <span className="font-semibold">Education</span>.
  </div>
</footer>

  )
}

export default Footer
