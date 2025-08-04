
const Footer = () => {
  return (
   <footer className="bg-gray-100 pt-10 ">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex flex-wrap justify-between gap-10">
      
    
      <div className="w-full sm:w-[250px]">
        <div className="flex items-center space-x-2 mb-4">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Logo" className="w-10 h-10" />
          <span className="text-2xl font-bold text-blue-900">EDUHOME</span>
        </div>
        <p className="text-gray-600 mb-6 text-sm">
          I must explain to you how all this mistaken idea of denoung pleure and praising pain was born and give you a coete account of the system.
        </p>
   
        <div className="flex space-x-4">
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">f</a>
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">p</a>
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">v</a>
          <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full border text-gray-600 hover:text-blue-600">t</a>
        </div>
      </div>

     
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-bold mb-3 text-gray-800 uppercase">Information</h4>
        <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li><a href="#">Addmission</a></li>
          <li><a href="#">Academic Calender</a></li>
          <li><a href="#">Event List</a></li>
          <li><a href="#">Hostel & Dinning</a></li>
          <li><a href="#">TimeTable</a></li>
        </ul>
      </div>

      
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-lg font-bold mb-3 text-gray-800 uppercase">Useful Links</h4>
        <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li><a href="#">Our Courses</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Teachers & Faculty</a></li>
          <li><a href="#">Teams & Conditions</a></li>
          <li><a href="#">Our Events</a></li>
        </ul>
      </div>

    
      <div className="flex-1 min-w-[200px]">
        <h4 className="text-lg font-bold mb-3 text-gray-800 uppercase">Get In Touch</h4>
        <div className="w-10 h-[2px] bg-gray-400 mb-4"></div>
        <p className="text-gray-600 text-sm mb-2">
          Your address goes here, Street City, Roadno 785 New York
        </p>
        <p className="text-gray-600 text-sm mb-1">+880 548 986 898 87</p>
        <p className="text-gray-600 text-sm mb-1">+880 659 785 658 98</p>
        <p className="text-gray-600 text-sm mb-1">info@eduhome.com</p>
        <p className="text-gray-600 text-sm">www.eduhome.com</p>
      </div>
    </div>
  </div>

  
  <div className="bg-indigo-900 text-white mt-20 text-center py-4 text-sm w-full">
    Copyright © <span className="font-semibold">Eduhome</span> 2022. All Right Reserved By 
    <span className="font-semibold">Hastech</span>.
  </div>
</footer>

  )
}

export default Footer
