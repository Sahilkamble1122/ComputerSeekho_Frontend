
const Gallery = () => {
  return (
   <section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    

    <h2 className="text-4xl font-bold text-center text-blue-900 mb-12  tracking-wider">
      Gallery
    </h2>

    
    <div className="grid md:grid-cols-3 gap-8">
      
   
      <div className="bg-white shadow-md hover:shadow-lg transition duration-300">
        <div className="relative">
          <img src="https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg" alt="Event" className="w-full h-56 object-cover" />
      
        </div>
      
      </div>

  
      <div className="bg-white shadow-md hover:shadow-lg transition duration-300">
        <div className="relative">
          <img src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg" alt="Event" className="w-full h-56 object-cover" />
         
        </div>
       
      </div>

  
      <div className="bg-white shadow-md hover:shadow-lg transition duration-300">
        <div className="relative">
          <img src="https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg" alt="Event" className="w-full h-56 object-cover" />
          
        </div>
       
      </div>

    </div>
  </div>
</section>

  )
}

export default Gallery;
