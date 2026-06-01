import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt, FaWhatsapp, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// --- KOMPONEN PROJECT CARD (DENGAN AUTO-SLIDER 3 FOTO) ---
const ProjectCard = ({ project, index }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = project.images; // Mengambil array 3 foto

  // Logika Auto-Slide (berganti setiap 5 detik)
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000); // 5000ms = 5 detik

    return () => clearInterval(timer); // Membersihkan timer saat komponen di-unmount
  }, [images]);

  // Varian Animasi untuk efek Slide yang smooth
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  // State untuk melacak arah slide (untuk navigasi manual jika ditambahkan nanti)
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = page % images.length;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };
  
  // Menggunakan currentSlide dari useEffect untuk auto-slide, 
  // atau menggunakan imageIndex jika ingin navigasi manual yang kompleks.
  // Di sini kita gunakan currentSlide agar simpel & elegan sesuai permintaan.

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-4 border-white flex flex-col bg-[#111] hover:border-[#ff4500] transition-colors min-h-75 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] group"
    >
      {/* --- SLIDER BAGIAN ATAS --- */}
      <div className="h-64 border-b-4 border-white overflow-hidden bg-gray-800 relative">
        <AnimatePresence initial={false} custom={1}>
          <motion.img 
            key={currentSlide} // Kunci penting untuk memicu animasi AnimatePresence
            src={images[currentSlide]} 
            alt={`${project.title} - ${currentSlide + 1}`}
            custom={1} // Arah slide (1 untuk ke kanan)
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 }, // Efek pegas yang smooth
              opacity: { duration: 0.4 } // Transisi opacity lembut
            }}
            className="absolute w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </AnimatePresence>
        
        {/* Overlay Gradasi agar foto tidak terlalu mati di gelap */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none"></div>

        {/* Indikator Titik (Dots) yang Elegan */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 p-1.5 bg-black/50 rounded-full backdrop-blur-sm border border-white/20">
          {images.map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-[#ff4500] w-5' : 'bg-white/50'}`}
            ></div>
          ))}
        </div>
      </div>
      
      {/* --- DETAIL PROYEK BAGIAN BAWAH --- */}
      <div className="p-8 grow flex flex-col justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase mb-4 text-[#ff4500] tracking-tighter">{project.title}</h3>
          <p className="text-gray-300 font-medium mb-6 leading-relaxed">
            {project.desc}
          </p>
          
          {/* 3 Point Penting */}
          <ul className="mb-8 space-y-3">
            {project.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-bold text-gray-400">
                <span className="text-[#ff4500] mt-1 text-lg">▹</span> 
                <span className="leading-tight">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 font-black uppercase bg-white text-black px-6 py-3 w-max hover:bg-[#ff4500] hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[4px_4px_0px_0px_rgba(255,69,0,1)] active:translate-y-1 active:shadow-none">
          View Repository <FaGithub className="text-xl"/>
        </a>
      </div>
    </motion.div>
  );
};


// =========================================================================
// ========================== UTAMA KOMPONEN APP ==========================
// =========================================================================

const App = () => {
  // --- STATES ---
  const [isLoading, setIsLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Efek Loading Awal
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Logika Download Bar
  const handleDownloadCV = () => {
    if (downloadProgress > 0) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setDownloadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = '/CV-Yoseph Zosimus Sakera.pdf';
          link.download = 'CV-Yoseph Zosimus Sakera.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => setDownloadProgress(0), 500);
        }, 300);
      }
    }, 150);
  };

  // --- PARALLAX EFFECTS ---
  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yDecor = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // --- DATA (UPDATED DATA STRUCTURE FOR 3 PHOTOS) ---
  const data = {
    name: "Yoseph Zosimus",
    lastName: "Sakera",
    title: "Fullstack Developer",
    contact: {
      wa: "https://wa.me/6281238036180",
      github: "https://github.com/SlayerrR18",
      linkedin: "https://www.linkedin.com/in/yoseph-zosimus-sakera-46890a294",
      email: "mailto:joysakera01@gmail.com"
    },
    overview: "Fresh graduate in Computer Science focusing on improving operational efficiency through technology. Skilled in database management, system analysis, and developing applications to support business processes.",
    experience: [
      {
        role: "Fullstack Developer (Intern)",
        company: "SIDIGS",
        period: "Feb 2024 - Feb 2025",
        logo: "/sidigs-logo.png",
        desc: "Developed student websites for managing laundry and UKS. Created a teacher portal for exporting weekly, monthly, and yearly reports to PDF/Excel. Maintained and added features using PHP and MySQL."
      },
      {
        role: "Treasurer",
        company: "Panorama BINUS",
        period: "Feb 2023 - Feb 2024",
        logo: "/panorama-logo.png",
        desc: "Managed cash flow, developed budgets to support organizational programs, and generated periodic financial reports for the executive board."
      }
    ],
    projects: [
      {
        title: "Lolita Boarding House Management",
        images: [
          "/project-lolita-1.png", 
          "/project-lolita-2.png", 
          "/project-lolita-3.png"
        ], 
        desc: "A comprehensive website-based management system tailored for boarding house administration.",
        points: [
          "Developed applying the SCRUM framework methodology.",
          "Implemented full backend logic using Laravel & PHP.",
          "Integrated reporting features for boarder management.",
          "Integrated a secure payment gateway for automated and seamless monthly rent transactions.",
          "Designed an intuitive dashboard to monitor room occupancy and financial records."
        ],
        link: "https://github.com/SlayerrR18/kost-lolita.git"
      },
      {
        title: "BarnBoss",
        images: [
          "/project-barnboss-1.png", 
          "/project-barnboss-2.png", 
          "/project-barnboss-3.png"
        ],
        desc: "A management application designed for tracking and controlling business operations efficiently.",
        points: [
          "End-to-end fullstack development implementation.",
          "Optimized database queries for faster data retrieval.",
          "Designed with a focus on operational efficiency.",
          "Implemented Role-Based Access Control (RBAC) for secure user authorization.",
          "Developed a responsive interface for seamless accessibility across desktop and mobile devices."
        ],
        link: "https://github.com/SlayerrR18/BarnBoss.git"
      }
    ],
    skills: ["PHP", "Laravel", "React", "HTML", "CSS", "Tailwind CSS", "JavaScript", "MySQL", "Git", "Bootstrap", "Figma"]
  };

  // --- LOADING SCREEN ---
  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#e5e5e5] flex flex-col items-center justify-center"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-[#ff4500] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          <h2 className="mt-8 font-black uppercase tracking-widest text-xl text-black">Loading...</h2>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-[#e5e5e5] text-gray-900 min-h-screen font-sans selection:bg-[#ff4500] selection:text-white smooth-scroll">
      
      {/* NAVBAR */}
      <nav className="p-6 flex justify-between items-center border-b-2 border-black sticky top-0 bg-[#e5e5e5]/90 backdrop-blur-sm z-40">
        <div className="font-black text-2xl tracking-tighter uppercase">
          YS.
        </div>
        <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest">
          <a href="#about" className="hover:text-[#ff4500] transition-colors">About</a>
          <a href="#experience" className="hover:text-[#ff4500] transition-colors">Experience</a>
          <a href="#projects" className="hover:text-[#ff4500] transition-colors">Projects</a>
        </div>
        <a href={data.contact.wa} target="_blank" rel="noreferrer" className="bg-black text-white px-6 py-2 font-bold uppercase text-sm hover:bg-[#25D366] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(37,211,102,1)] flex items-center gap-2">
          <FaWhatsapp className="text-lg"/> Contact Me
        </a>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 overflow-hidden bg-white/50">
        
        <motion.div style={{ y: yDecor }} className="absolute top-20 left-[40%] w-32 h-32 border-4 border-[#ff4500]/30 rounded-full z-0"></motion.div>
        <motion.div style={{ y: yDecor }} className="absolute bottom-40 right-20 w-24 h-24 bg-black opacity-5 rotate-12 z-0"></motion.div>

        <motion.div style={{ y: yText }} className="md:w-1/2 z-10">
          <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Hello <br/>
            <span className="text-[#ff4500]">World.</span>
          </h1>
          <div className="w-20 h-2 bg-black mb-6"></div>
          <p className="text-xl md:text-2xl font-medium max-w-lg mb-8 leading-relaxed">
            I am <span className="font-bold border-b-4 border-[#ff4500]">{data.name} {data.lastName}</span>, a {data.title} focusing on building efficient systems and modern web applications.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="border-2 border-black px-6 py-3 font-bold uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              View Work
            </a>
            
            <button 
              onClick={handleDownloadCV}
              className="relative overflow-hidden bg-[#ff4500] text-white border-2 border-black px-6 py-3 font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {downloadProgress > 0 && downloadProgress < 100 ? `Downloading ${downloadProgress}%` : downloadProgress === 100 ? 'Downloaded!' : <><FaDownload /> Download CV</>}
              </span>
              {downloadProgress > 0 && (
                <div 
                  className="absolute top-0 left-0 h-full bg-black opacity-20 transition-all duration-150 ease-linear"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div style={{ y: yImage }} className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff4500] translate-x-4 translate-y-4"></div>
            <img src="/profile.png" alt="Yoseph Zosimus" className="relative w-72 md:w-96 h-auto object-cover border-4 border-black grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </motion.div>
      </section>

      {/* OVERVIEW */}
      <section id="about" className="py-20 px-6 md:px-20 border-t-2 border-black bg-white">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-black uppercase mb-8 flex items-center gap-4 tracking-tighter">
            Overview <span className="w-full h-1 bg-gray-300 block"></span>
          </h2>
          <p className="text-2xl font-medium leading-relaxed text-gray-700">
            {data.overview}
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 border-2 border-black font-bold text-sm uppercase bg-[#e5e5e5] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-20 px-6 md:px-20 border-t-2 border-black bg-[#f0f0f0]">
        <h2 className="text-5xl font-black uppercase mb-16 text-center tracking-tighter">Work & Experience</h2>
        <div className="max-w-5xl mx-auto space-y-12">
          {data.experience.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col md:flex-row gap-8 items-start border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,69,0,1)] transition-all"
            >
              <div className="w-24 h-24 shrink-0 border-2 border-gray-200 flex items-center justify-center p-2 bg-white">
                <img src={exp.logo} alt={exp.company} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{exp.role}</h3>
                <div className="inline-block bg-black text-white px-3 py-1 font-bold text-sm mt-2 mb-4">
                  {exp.company} | {exp.period}
                </div>
                <p className="text-lg text-gray-700 font-medium">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION (DENGAN KOMPONEN CARD BARU) */}
      <section id="projects" className="py-20 px-6 md:px-20 border-t-2 border-black bg-black text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[url('/bg-pattern.png')] bg-repeat bg-center"></div> {/* Opsional: Pattern BG */}
        <h2 className="text-5xl font-black uppercase mb-16 text-[#ff4500] tracking-tighter relative z-10 text-center">Selected Projects</h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto relative z-10">
          {data.projects.map((project, index) => (
            // Menggunakan Komponen ProjectCard yang baru dibuat di atas
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 md:px-20 bg-[#e5e5e5] border-t-4 border-black flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-black text-5xl uppercase tracking-tighter">
          YS.
        </div>
        
        <div className="flex gap-8 text-3xl">
          <a href={data.contact.github} target="_blank" rel="noreferrer" className="text-black hover:text-[#ff4500] hover:-translate-y-2 transition-all"><FaGithub /></a>
          <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="text-black hover:text-[#ff4500] hover:-translate-y-2 transition-all"><FaLinkedin /></a>
          <a href={data.contact.email} className="text-black hover:text-[#ff4500] hover:-translate-y-2 transition-all"><FaEnvelope /></a>
          <a href={data.contact.wa} target="_blank" rel="noreferrer" className="text-black hover:text-[#25D366] hover:-translate-y-2 transition-all"><FaWhatsapp /></a>
        </div>
        
        <div className="font-bold uppercase text-sm border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-black">
          © {new Date().getFullYear()} Yoseph Zosimus
        </div>
      </footer>
    </div>
  );
};

export default App;