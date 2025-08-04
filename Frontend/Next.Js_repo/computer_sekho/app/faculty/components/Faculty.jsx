// components/FacultyCard.tsx
import Image from 'next/image';

const facultyData = [
  {
    name: 'Ketki Acharya',
    title: 'C, Web Programming, .Net',
    description:
      'Corporate Trainings conducted for Deloitte, Accenture, Capgemini, Tata Consulting Engineering Ltd.',
    image: '/ketki.jpg',
  },
  {
    name: 'Ramesh Patil',
    title: 'Java, Spring Boot',
    description:
      '10+ years of experience in backend development. Worked with Infosys, Wipro, and HCL.',
    image: '/nitin.jpg',
  },
  {
    name: 'Vikram Nayak',
    title: 'Python, Data Science',
    description:
      'Data Science trainer with real-time projects and mentoring for over 500+ students.',
    image: '/vikram.jpg',
  },
   {
    name: 'Jayant Ponkshe',
    title: 'Python, Data Science',
    description:
      'Data Science trainer with real-time projects and mentoring for over 500+ students.',
    image: '/jayant.jpg',
  },
];

export default function Faculty() {
  return (
    <section className="py-12 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1a2d49] mb-8">
        Our Faculty
      </h2>

      <div className="container mx-auto px-4 space-y-10">
        {facultyData.map((faculty, index) => (
          <div
            key={index}
            className="relative w-full max-w-6xl mx-auto rounded-md overflow-hidden"
          >
            <Image
              src={faculty.image}
              alt={faculty.name}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority={index === 0}
            />

            <div className="absolute top-1/2 right-0 w-full md:w-[40%] bg-red-500/70 text-white rounded-l-xl p-6 md:p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-2 font-[cursive]">{faculty.name}</h3>
              <p className="text-lg font-semibold mb-3">{faculty.title}</p>
              <p className="text-sm leading-relaxed">{faculty.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
