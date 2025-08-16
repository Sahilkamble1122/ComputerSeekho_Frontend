"use client";

import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow mt-16">
      <div
        className="absolute inset-0 bg-cover bg-center filter scale-105 "
        style={{
          backgroundImage: "url('/education.jpg')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center text-white px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            EDUCATION TEACHES US EVERYTHING
          </h1>
          <p className="mb-6 max-w-2xl mx-auto">
            Education unlocks the mind, empowers the soul, and builds the
            foundation for everything we become and make a lasting impact on the
            world.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
