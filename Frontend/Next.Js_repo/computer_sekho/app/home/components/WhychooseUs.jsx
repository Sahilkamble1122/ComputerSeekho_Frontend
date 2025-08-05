// components/WhyChooseUs.tsx
import Image from "next/image";

export default function WhyChooseUs() {
  return (
    <section className="bg-[#3E5A78] py-10 text-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-6">
        {/* Left Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <Image
            src="/vita12.jpg"
            alt="Why Choose SM VITA"
            width={600}
            height={400}
            className="rounded-md"
          />
        </div>

        {/* Right Text */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-red-500">SM VITA</span> ?
          </h2>
          <p className="text-lg mb-6 text-gray-200">
            Our institute has been present for over 20 years in the market. We
            make the most of all our students.
          </p>

          <ul className="space-y-4 text-white text-lg">
            {[
              "Best in class Infrastructure",
              "Best Faculty / Teachers",
              "Best Learning Methodology",
              "More than 95% Placement for 10 Consecutive batches",
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-500 mr-3 text-xl">✔️</span>
                <span className="font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
