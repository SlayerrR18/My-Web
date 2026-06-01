import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaDownload, FaMoon, FaSun, FaGlobe } from 'react-icons/fa';

// --- KOMPONEN PROJECT CARD (DENGAN AUTO-SLIDER 3 FOTO) ---
const ProjectCard = ({ project, index, dict }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = project.images;

  useEffect(() => {
    if (!images || images.length === 0) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images]);

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-4 border-white flex flex-col bg-[#111] hover:border-[#ff4500] transition-colors min-h-75 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] group"
    >
      <div className="h-64 border-b-4 border-white overflow-hidden bg-gray-800 relative">
        <AnimatePresence initial={false} custom={1}>
          <motion.img 
            key={currentSlide}
            src={images[currentSlide]} 
            alt={`${project.title} - ${currentSlide + 1}`}
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.4 } }}
            className="absolute w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 p-1.5 bg-black/50 rounded-full backdrop-blur-sm border border-white/20">
          {images.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-[#ff4500] w-5' : 'bg-white/50'}`}></div>
          ))}
        </div>
      </div>
      
      <div className="p-8 grow flex flex-col justify-between">
        <div>
          <h3 className="text-3xl font-black uppercase mb-4 text-[#ff4500] tracking-tighter">{project.title}</h3>
          <p className="text-gray-300 font-medium mb-6 leading-relaxed">
            {project.desc}
          </p>
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
          {dict.viewRepo} <FaGithub className="text-xl"/>
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
  const [lang, setLang] = useState('en'); // 'en' atau 'id'
  const [isDark, setIsDark] = useState(false);

  // Efek Loading Awal
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Efek Dark Mode Logic
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

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

  const { scrollYProgress } = useScroll();
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yDecor = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // --- KAMUS BAHASA (DICTIONARY) ---
  const dict = {
    en: {
      nav: { about: "About", exp: "Experience", proj: "Projects", contact: "Contact Me" },
      hero: {
        hello: "Hello", world: "World.", iam: "I am",
        desc: "a Fullstack Developer focusing on building efficient systems and modern web applications.",
        viewWork: "View Work", dlCV: "Download CV", dlLoading: "Downloading", dlDone: "Downloaded!"
      },
      about: { title: "Overview" },
      exp: { title: "Work & Experience" },
      proj: { title: "My Projects", viewRepo: "View Repository" },
      loading: "Loading..."
    },
    id: {
      nav: { about: "Tentang", exp: "Pengalaman", proj: "Proyek", contact: "Hubungi Saya" },
      hero: {
        hello: "Halo", world: "Dunia.", iam: "Saya",
        desc: "seorang Fullstack Developer yang berfokus pada pembangunan sistem efisien dan aplikasi web modern.",
        viewWork: "Lihat Karya", dlCV: "Unduh CV", dlLoading: "Mengunduh", dlDone: "Selesai!"
      },
      about: { title: "Ringkasan" },
      exp: { title: "Pengalaman Kerja" },
      proj: { title: "Proyek Pilihan", viewRepo: "Lihat Repositori" },
      loading: "Memuat..."
    }
  };

  const currentDict = dict[lang];

  // --- DATA PROFIL BILINGUAL ---
  const data = {
    name: "Yoseph Zosimus",
    lastName: "Sakera",
    contact: {
      wa: "https://wa.me/6281238036180",
      github: "https://github.com/SlayerrR18",
      linkedin: "https://www.linkedin.com/in/yoseph-zosimus-sakera-46890a294",
      email: "mailto:joysakera01@gmail.com"
    },
    overview: {
      en: "Fresh graduate in Computer Science focusing on improving operational efficiency through technology. Skilled in database management, system analysis, and developing applications to support business processes.",
      id: "Lulusan baru Ilmu Komputer yang berfokus pada peningkatan efisiensi operasional melalui teknologi. Terampil dalam manajemen basis data, analisis sistem, dan pengembangan aplikasi untuk mendukung proses bisnis."
    },
    experience: [
      {
        role: "Fullstack Developer (Intern)",
        company: "SIDIGS",
        period: "Feb 2024 - Feb 2025",
        logo: "/sidigs-logo.png",
        desc: {
          en: "Developed student websites for managing laundry and UKS. Created a teacher portal for exporting weekly, monthly, and yearly reports to PDF/Excel. Maintained and added features using PHP and MySQL.",
          id: "Mengembangkan situs web siswa untuk mengelola laundry dan UKS. Membuat portal guru untuk mengekspor laporan mingguan, bulanan, dan tahunan ke PDF/Excel. Memelihara dan menambahkan fitur menggunakan PHP dan MySQL."
        }
      },
      {
        role: "Treasurer",
        company: "Panorama BINUS",
        period: "Feb 2023 - Feb 2024",
        logo: "/panorama-logo.png",
        desc: {
          en: "Managed cash flow, developed budgets to support organizational programs, and generated periodic financial reports for the executive board.",
          id: "Mengelola arus kas, menyusun anggaran untuk mendukung program organisasi, dan membuat laporan keuangan berkala untuk dewan eksekutif."
        }
      }
    ],
    projects: [
      {
        title: "Lolita Boarding House Management",
        images: ["/project-lolita-1.png", "/project-lolita-2.png", "/project-lolita-3.png"], 
        desc: {
          en: "A comprehensive website-based management system tailored for boarding house administration.",
          id: "Sistem manajemen komprehensif berbasis web yang disesuaikan untuk administrasi rumah kost."
        },
        points: {
          en: [
            "Developed applying the SCRUM framework methodology.",
            "Implemented full backend logic using Laravel & PHP.",
            "Integrated reporting features for boarder management.",
            "Integrated a secure payment gateway for automated and seamless monthly rent transactions.",
            "Designed an intuitive dashboard to monitor room occupancy and financial records."
          ],
          id: [
            "Dikembangkan dengan menerapkan metodologi kerangka kerja SCRUM.",
            "Mengimplementasikan logika backend penuh menggunakan Laravel & PHP.",
            "Mengintegrasikan fitur pelaporan untuk manajemen anak kost.",
            "Mengintegrasikan payment gateway yang aman untuk transaksi sewa bulanan otomatis.",
            "Merancang dasbor intuitif untuk memantau hunian kamar dan catatan keuangan."
          ]
        },
        link: "https://github.com/SlayerrR18/kost-lolita.git"
      },
      {
        title: "BarnBoss",
        images: ["/project-barnboss-1.png", "/project-barnboss-2.png", "/project-barnboss-3.png"],
        desc: {
          en: "A management application designed for tracking and controlling business operations efficiently.",
          id: "Aplikasi manajemen yang dirancang untuk melacak dan mengendalikan operasi bisnis secara efisien."
        },
        points: {
          en: [
            "End-to-end fullstack development implementation.",
            "Optimized database queries for faster data retrieval.",
            "Designed with a focus on operational efficiency.",
            "Implemented Role-Based Access Control (RBAC) for secure user authorization.",
            "Developed a responsive interface for seamless accessibility across desktop and mobile devices."
          ],
          id: [
            "Implementasi pengembangan fullstack dari ujung ke ujung (end-to-end).",
            "Optimalisasi kueri basis data untuk pengambilan data yang lebih cepat.",
            "Dirancang dengan fokus pada efisiensi operasional.",
            "Menerapkan Kontrol Akses Berbasis Peran (RBAC) untuk otorisasi pengguna yang aman.",
            "Mengembangkan antarmuka responsif untuk aksesibilitas lintas perangkat."
          ]
        },
        link: "https://github.com/SlayerrR18/BarnBoss.git"
      }
    ],
    skills: ["PHP", "Laravel", "React", "HTML", "CSS", "Tailwind CSS", "JavaScript", "MySQL", "Git", "Bootstrap", "Figma"]
  };

  if (isLoading) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#e5e5e5] dark:bg-[#111] flex flex-col items-center justify-center transition-colors duration-500"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-[#ff4500] border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          />
          <h2 className="mt-8 font-black uppercase tracking-widest text-xl text-black dark:text-white">{currentDict.loading}</h2>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="bg-[#e5e5e5] dark:bg-[#121212] text-gray-900 dark:text-[#e5e5e5] min-h-screen font-sans selection:bg-[#ff4500] selection:text-white smooth-scroll transition-colors duration-500">
      
      {/* NAVBAR */}
      <nav className="p-6 flex justify-between items-center border-b-2 border-black dark:border-[#333] sticky top-0 bg-[#e5e5e5]/90 dark:bg-[#121212]/90 backdrop-blur-sm z-40 transition-colors duration-500">
        <div className="font-black text-2xl tracking-tighter uppercase text-black dark:text-white">
          YS.
        </div>
        
        <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-black dark:text-white">
          <a href="#about" className="hover:text-[#ff4500] dark:hover:text-[#ff4500] transition-colors">{currentDict.nav.about}</a>
          <a href="#experience" className="hover:text-[#ff4500] dark:hover:text-[#ff4500] transition-colors">{currentDict.nav.exp}</a>
          <a href="#projects" className="hover:text-[#ff4500] dark:hover:text-[#ff4500] transition-colors">{currentDict.nav.proj}</a>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggles Bahasa & Mode */}
          <button onClick={() => setLang(lang === 'en' ? 'id' : 'en')} className="flex items-center gap-1 font-bold text-sm border-2 border-black dark:border-white px-2 py-1 bg-white dark:bg-black text-black dark:text-white hover:bg-[#ff4500] hover:text-white transition-colors">
            <FaGlobe /> {lang.toUpperCase()}
          </button>
          <button onClick={() => setIsDark(!isDark)} className="p-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-[#ff4500] hover:text-white transition-colors">
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
          
          <a href={data.contact.wa} target="_blank" rel="noreferrer" className="hidden md:flex bg-black dark:bg-white text-white dark:text-black px-6 py-2 font-bold uppercase text-sm hover:bg-[#25D366] dark:hover:bg-[#25D366] dark:hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] items-center gap-2">
            <FaWhatsapp className="text-lg"/> {currentDict.nav.contact}
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 overflow-hidden bg-white/50 dark:bg-black/20 transition-colors duration-500">
        <motion.div style={{ y: yDecor }} className="absolute top-20 left-[40%] w-32 h-32 border-4 border-[#ff4500]/30 rounded-full z-0"></motion.div>
        <motion.div style={{ y: yDecor }} className="absolute bottom-40 right-20 w-24 h-24 bg-black dark:bg-white opacity-5 rotate-12 z-0"></motion.div>

        <motion.div style={{ y: yText }} className="md:w-1/2 z-10">
          <h1 className="text-7xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 text-black dark:text-white">
            {currentDict.hero.hello} <br/>
            <span className="text-[#ff4500]">{currentDict.hero.world}</span>
          </h1>
          <div className="w-20 h-2 bg-black dark:bg-white mb-6"></div>
          <p className="text-xl md:text-2xl font-medium max-w-lg mb-8 leading-relaxed text-black dark:text-gray-300">
            {currentDict.hero.iam} <span className="font-bold border-b-4 border-[#ff4500]">{data.name} {data.lastName}</span>, {currentDict.hero.desc}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="border-2 border-black dark:border-white px-6 py-3 font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-black dark:text-white bg-transparent">
              {currentDict.hero.viewWork}
            </a>
            
            <button 
              onClick={handleDownloadCV}
              className="relative overflow-hidden bg-[#ff4500] text-white border-2 border-black dark:border-[#ff4500] px-6 py-3 font-bold uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,69,0,1)] active:translate-y-1 active:shadow-none flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                {downloadProgress > 0 && downloadProgress < 100 ? `${currentDict.hero.dlLoading} ${downloadProgress}%` : downloadProgress === 100 ? currentDict.hero.dlDone : <><FaDownload /> {currentDict.hero.dlCV}</>}
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
            <img src="/profile.png" alt="Yoseph Zosimus" className="relative w-72 md:w-96 h-auto object-cover border-4 border-black dark:border-white grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </motion.div>
      </section>

      {/* OVERVIEW */}
      <section id="about" className="py-20 px-6 md:px-20 border-t-2 border-black dark:border-[#333] bg-white dark:bg-[#1a1a1a] transition-colors duration-500">
        <div className="max-w-4xl">
          <h2 className="text-5xl font-black uppercase mb-8 flex items-center gap-4 tracking-tighter text-black dark:text-white">
            {currentDict.about.title} <span className="w-full h-1 bg-gray-300 dark:bg-gray-700 block"></span>
          </h2>
          <p className="text-2xl font-medium leading-relaxed text-gray-700 dark:text-gray-300">
            {data.overview[lang]}
          </p>
          <div className="mt-12 flex flex-wrap gap-3">
            {data.skills.map((skill, index) => (
              <span key={index} className="px-4 py-2 border-2 border-black dark:border-white font-bold text-sm uppercase bg-[#e5e5e5] dark:bg-black text-black dark:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="py-20 px-6 md:px-20 border-t-2 border-black dark:border-[#333] bg-[#f0f0f0] dark:bg-[#121212] transition-colors duration-500">
        <h2 className="text-5xl font-black uppercase mb-16 text-center tracking-tighter text-black dark:text-white">{currentDict.exp.title}</h2>
        <div className="max-w-5xl mx-auto space-y-12">
          {data.experience.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col md:flex-row gap-8 items-start border-4 border-black dark:border-white p-8 bg-white dark:bg-[#1a1a1a] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(255,69,0,1)] transition-all"
            >
              <div className="w-24 h-24 shrink-0 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center p-2 bg-white rounded-sm">
                <img src={exp.logo} alt={exp.company} className="max-w-full max-h-full object-contain" />
              </div>
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-black dark:text-white">{exp.role}</h3>
                <div className="inline-block bg-black dark:bg-white text-white dark:text-black px-3 py-1 font-bold text-sm mt-2 mb-4">
                  {exp.company} | {exp.period}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{exp.desc[lang]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-20 px-6 md:px-20 border-t-2 border-black dark:border-[#333] bg-black text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[url('/bg-pattern.png')] bg-repeat bg-center"></div>
        <h2 className="text-5xl font-black uppercase mb-16 text-[#ff4500] tracking-tighter relative z-10 text-center">{currentDict.proj.title}</h2>
        
        <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto relative z-10">
          {data.projects.map((project, index) => (
            <ProjectCard key={index} project={{...project, desc: project.desc[lang], points: project.points[lang]}} index={index} dict={currentDict.proj} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 px-6 md:px-20 bg-[#e5e5e5] dark:bg-[#121212] border-t-4 border-black dark:border-white flex flex-col md:flex-row justify-between items-center gap-8 transition-colors duration-500">
        <div className="font-black text-5xl uppercase tracking-tighter text-black dark:text-white">
          YS.
        </div>
        
        <div className="flex gap-8 text-3xl">
          <a href={data.contact.github} target="_blank" rel="noreferrer" className="text-black dark:text-white hover:text-[#ff4500] dark:hover:text-[#ff4500] hover:-translate-y-2 transition-all"><FaGithub /></a>
          <a href={data.contact.linkedin} target="_blank" rel="noreferrer" className="text-black dark:text-white hover:text-[#ff4500] dark:hover:text-[#ff4500] hover:-translate-y-2 transition-all"><FaLinkedin /></a>
          <a href={data.contact.email} className="text-black dark:text-white hover:text-[#ff4500] dark:hover:text-[#ff4500] hover:-translate-y-2 transition-all"><FaEnvelope /></a>
          <a href={data.contact.wa} target="_blank" rel="noreferrer" className="text-black dark:text-white hover:text-[#25D366] dark:hover:text-[#25D366] hover:-translate-y-2 transition-all"><FaWhatsapp /></a>
        </div>
        
        <div className="font-bold uppercase text-sm border-2 border-black dark:border-white px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-black text-black dark:text-white">
          © {new Date().getFullYear()} Yoseph Zosimus
        </div>
      </footer>
    </div>
  );
};

export default App;