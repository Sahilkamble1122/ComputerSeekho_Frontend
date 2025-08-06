const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">

      <div
        className="absolute inset-0 bg-cover bg-center filter  scale-105"
        style={{
          backgroundImage: "url('/education.jpg')",
        }}
      ></div>


      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">EDUCATION TEACHES US EVERYTHING</h1>
          <p className="mb-6 max-w-2xl mx-auto">
            Education unlocks the mind, empowers the soul, and builds the foundation for everything we become and make a lasting impact on the world.
          </p>
          <a
            href="#"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded"
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
