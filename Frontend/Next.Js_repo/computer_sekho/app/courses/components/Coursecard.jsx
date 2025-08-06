
const Coursecard = () => {
  return (
<section className="p-10 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    
    
    <h2 className="text-4xl font-bold text-center text-blue-900 mb-12  tracking-wider ">
      Courses We Offer
    </h2>

   
    <div className="grid md:grid-cols-3 gap-8">
      
     
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" alt="CSE" className="w-full h-56 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">PG-DAC Courses</h3>
          <p className="text-gray-600 mb-4">
            The PG-DAC (Post Graduate Diploma in Advanced Computing) is a nine-month postgraduate diploma program offered by C-DAC designed to equip engineers and IT professionals with advanced skills in software development
          </p>
          <a href="#" className="inline-block bg-red-600 text-white px-5 py-2 font-semibold rounded hover:bg-red-700 transition">
            READ MORE
          </a>
        </div>
      </div>

      
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <img src="https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg" alt="CSE" className="w-full h-56 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">PG DBDA Courses</h3>
          <p className="text-gray-600 mb-4">
            A Post Graduate Diploma in Big Data Analytics (PG-DBDA) is a specialized program designed to equip individuals with the skills and knowledge needed to work in the field of data science and analytics
          </p>
          <a href="#" className="inline-block bg-red-600 text-white px-5 py-2 font-semibold rounded hover:bg-red-700 transition">
            READ MORE
          </a>
        </div>
      </div>

     
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
        <img src="https://images.pexels.com/photos/256401/pexels-photo-256401.jpeg" alt="CSE" className="w-full h-56 object-cover" />
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">MSCIT LAB</h3>
          <p className="text-gray-600 mb-4">
           The MS-CIT (Master of Science in Information Technology) course at SM Vita is a foundational IT literacy program focused on practical skills for the digital age. It aims to equip learners with essential computer skills, including operating systems, MS Office tools, and basic programming concepts
          </p>
          <a href="#" className="inline-block bg-red-600 text-white px-5 py-2 font-semibold rounded hover:bg-red-700 transition">
            READ MORE
          </a>
        </div>
      </div>

    </div>
  </div>
</section>

  )
}

export default Coursecard
