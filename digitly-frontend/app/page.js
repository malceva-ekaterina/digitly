"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import { createPortal } from 'react-dom';

//  МАССИВЫ С ДАННЫМИ 
const allReviews = [
  {
    id: 1,
    name: "Константин Обедов",
    role: "Гость",
    stars: 4,
    text: "Сайт просто огонь, все удобно и олимпиады интересные, все очень-очень круто!",
    avatar: "chifra/avatar1.png"
  },
  {
    id: 2,
    name: "Александр Иванов",
    role: "Гость",
    stars: 4,
    text: "Мне все очень нравится, спасибо вам за такую замечательную платформу, я очень рад быть ее частью.",
    avatar: "chifra/avatar2.png"
  },
  {
    id: 3,
    name: "Екатерина Шульц",
    role: "Гость",
    stars: 5,
    text: "Все на высоте! Я люблю олимпиады и методический киоск, ураааа, все круто, супер!",
    avatar: "chifra/avatar3.png"
  },
  {
    id: 4,
    name: "Дмитрий Петров",
    role: "Участник",
    stars: 5,
    text: "Очень удобная платформа, много полезных материалов. Спасибо разработчикам!",
    avatar: "chifra/avatar4.png"
  },
  {
    id: 5,
    name: "Анна Смирнова",
    role: "Участник",
    stars: 5,
    text: "Участвую во всех олимпиадах, всегда интересные задания. Рекомендую!",
    avatar: "chifra/avatar5.png"
  }
];

const allColleges = [
  {
    id: 1,
    name: "ГАПОУ СО \"Нижнетагильский торгово-экономический колледж\"",
    description: "Учебное заведение, которое предоставляет студентам практические навыки и знания.",
    olympiads: "289",
    methods: "289"
  },
  {
    id: 2,
    name: "ГАПОУ СО \"Нижнетагильский торгово-экономический колледж\"",
    description: "Учебное заведение, которое предоставляет студентам практические навыки и знания.",
    olympiads: "289",
    methods: "289"
  },
  {
    id: 3,
    name: "ГАПОУ СО \"Нижнетагильский торгово-экономический колледж\"",
    description: "Учебное заведение, которое предоставляет студентам практические навыки и знания.",
    olympiads: "89",
    methods: "289"
  },
  {
    id: 4,
    name: "ГБПОУ \"Московский колледж бизнеса и технологий\"",
    description: "Современное образование с уклоном в практику и стажировки.",
    olympiads: "156",
    methods: "312"
  },
  {
    id: 5,
    name: "ГАПОУ \"Казанский педагогический колледж\"",
    description: "Подготовка квалифицированных педагогов и методистов.",
    olympiads: "203",
    methods: "178"
  }
];

function CollegeCard({ college, isActive = false }) {
  return (
    <div 
      className={`bg-white/90 rounded-3xl shadow-xl p-6 w-full h-full flex flex-col transition-all duration-300 ${
        isActive ? 'shadow-2xl opacity-100' : 'opacity-50'
      }`}
      style={{ 
        width: '100%', 
        height: '500px',
        boxShadow: isActive ? '0 25px 50px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.1)'
      }}
    >
      <div className="flex flex-col items-center text-center h-full justify-between py-6">
        <div className="w-28 h-28 bg-gradient-to-br from-violet-100 to-violet-200 rounded-full flex items-center justify-center shadow-md">
          <svg className="w-16 h-16 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-lg md:text-xl lg:text-2xl mb-3 leading-tight px-2 break-words">
          {college.name}
        </h3>
        <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-4 px-2 break-words">
          {college.description}
        </p>
        <div className="flex justify-center gap-6 md:gap-8 pt-3 border-t border-gray-300 w-full">
          <div className="text-center">
            <p className="font-bold text-xl md:text-2xl text-violet-700">{college.olympiads}</p>
            <p className="text-xs md:text-sm text-gray-500">Олимпиад</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-xl md:text-2xl text-violet-700">{college.methods}</p>
            <p className="text-xs md:text-sm text-gray-500 leading-tight">
              Методических<br className="hidden sm:block" />элементов
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


//  ИСПРАВЛЕННЫЙ КОМПОНЕНТ КНОПКИ ПРОФИЛЯ 
function ProfileButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const router = useRouter(); // <-- ДОБАВИТЬ ЭТУ СТРОКУ!

  const fetchCsrfToken = async () => {
    try {
      await fetch('/sanctum/csrf-cookie', {
        credentials: 'include',
      });
    } catch (error) {
      console.error('Ошибка получения CSRF токена:', error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      await fetchCsrfToken();
      
      const response = await fetch('/api/v1/user', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setUserName(userData.name || userData.fullname || userData.email?.split('@')[0] || 'Пользователь');
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('is_authenticated', 'true');
      } else if (response.status === 401) {
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('user');
        localStorage.removeItem('is_authenticated');
      }
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('is_authenticated') === 'true';
    const savedUser = localStorage.getItem('user');
    
    if (savedAuth && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUserName(userData.name || userData.fullname || userData.email?.split('@')[0] || 'Пользователь');
        setLoading(false);
        fetchCurrentUser();
      } catch {
        fetchCurrentUser();
      }
    } else {
      fetchCurrentUser();
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = (event) => {
      if (event.key === 'auth_change') {
        fetchCurrentUser();
      }
    };
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && buttonRef.current && !buttonRef.current.contains(event.target) &&
          menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const goTo = (path) => {
    setIsOpen(false);
    router.push(path); // <-- ИСПРАВЛЕНО: используем router.push
  };
  
  const logout = async () => {
    try {
      await fetchCsrfToken();
      
      const response = await fetch('/api/v1/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      if (response.ok) {
        console.log('Выход выполнен успешно');
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
    
    localStorage.removeItem('user');
    localStorage.removeItem('is_authenticated');
    localStorage.setItem('auth_change', Date.now().toString());
    
    setIsAuthenticated(false);
    setIsOpen(false);
    
    router.push('/'); // <-- ИСПРАВЛЕНО: используем router.push
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5">
        <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
        <span className="text-gray-700">Вход</span>
        <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
      </Link>
    );
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="hidden sm:inline max-w-[100px] truncate text-gray-700">{userName.split(' ')[0]}</span>
        <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50"
        >
          <div
            onClick={() => goTo('/profile')}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Личный кабинет
          </div>
          <div
            onClick={() => goTo('/profile/security')}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Безопасность
          </div>
          <div
            onClick={() => goTo('/profile/settings')}
            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Настройки
          </div>
          <div className="border-t border-gray-100"></div>
          <div
            onClick={logout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            Выйти
          </div>
        </div>
      )}
    </div>
  );
}

// Компонент навигации (один на всю страницу)
function NavigationButtons() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
      <Link href="/olympiads" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
        <span className="text-gray-700">Олимпиады</span>
        <img src="chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
      </Link>
      <Link href="/methodics" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
        <span className="text-gray-700">Методочки</span>
        <img src="chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
      </Link>
      <ProfileButton />
    </div>
  );
}

//  ОСНОВНОЙ КОМПОНЕНТ 
export default function PasswordRecoveryEmail() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [currentCollegeIndex, setCurrentCollegeIndex] = useState(0);
  const reviewsToShow = 3;

  const nextReviews = () => {
    if (currentReviewIndex + reviewsToShow < allReviews.length) {
      setCurrentReviewIndex(currentReviewIndex + 1);
    } else {
      setCurrentReviewIndex(0);
    }
  };
  const prevReviews = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1);
    } else {
      setCurrentReviewIndex(Math.max(0, allReviews.length - reviewsToShow));
    }
  };
  const visibleReviews = allReviews.slice(currentReviewIndex, currentReviewIndex + reviewsToShow);

  const nextCollege = () => {
    setCurrentCollegeIndex((prev) => (prev + 1) % allColleges.length);
  };
  const prevCollege = () => {
    setCurrentCollegeIndex((prev) => (prev - 1 + allColleges.length) % allColleges.length);
  };
  const leftIndex = (currentCollegeIndex - 1 + allColleges.length) % allColleges.length;
  const rightIndex = (currentCollegeIndex + 1) % allColleges.length;

  return (  
    <div>
      {/* ПЕРВЫЙ БЛОК (ГЛАВНЫЙ ЭКРАН) */}
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/main_page.png')" }}>
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('chifra/binary_001.png')" }} />
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
          <div><img src="chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
          <NavigationButtons />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <img src="chifra/chifra_olympiad.png" alt="Цифра Центр онлайн олимпиад" className="w-full max-w-[90%] sm:max-w-[80%] md:max-w-[717px] h-auto px-2 sm:px-4" />
        </div>
      </div>

      {/* ВТОРОЙ БЛОК (ПРЕИМУЩЕСТВА) */}
      <div className="min-h-screen flex flex-col p-4 sm:p-6 md:p-8" style={{ backgroundColor: '#EDE9FE' }}>
        <div className="flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4">
          <div><img src="chifra/logo_chifra_black.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
          <NavigationButtons />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-[1328px] px-2 sm:px-4 md:px-8">
            <p className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 font-sans text-center lg:text-left text-gray-800">ПРЕИМУЩЕСТВА</p>
            <div className="flex flex-col xl:flex-row gap-6 sm:gap-8 font-sans">
              <div className="relative bg-white rounded-xl flex flex-col justify-end flex-1 min-w-[280px] overflow-hidden" style={{ height: 'auto', minHeight: '400px' }}>
                <img src="chifra/binary_003.png" alt="binary bg" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0 pointer-events-none" />
                <div className="absolute top-4 right-4 bg-violet-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center z-10">
                  <img src="chifra/check_mark.png" alt="галочка" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </div>
                <div className="relative z-10 p-4 sm:p-6">
                  <p className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 font-sans">Сотрудничество</p>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl font-sans">Сотрудничество включает взаимодействие с работодателями и социальными партнерами для разработки образовательных программ.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6 sm:gap-8 flex-1 min-w-[280px]">
                <div className="relative bg-white rounded-xl flex flex-col justify-end overflow-hidden" style={{ height: 'auto', minHeight: '200px' }}>
                  <img src="chifra/binary_005.png" alt="binary bg" className="absolute inset-0 object-cover opacity-70 z-0 pointer-events-none" />
                  <div className="absolute top-4 right-4 bg-violet-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center z-10">
                    <img src="chifra/check_mark.png" alt="галочка" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="relative z-10 p-4 sm:p-6">
                    <p className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 font-sans">Нет ограничений</p>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl font-sans">Нет ограничений в плане обучения и прохождения, нет ограничений по времени, учитесь в своем удобном темпе, олимпиады открыты и днем и ночью.</p>
                  </div>
                </div>
                <div className="relative bg-white rounded-xl flex flex-col justify-end overflow-hidden" style={{ height: 'auto', minHeight: '200px' }}>
                  <img src="chifra/binary_004.png" alt="binary bg" className="absolute inset-0 w-full h-full object-cover opacity-70 z-0 pointer-events-none" />
                  <div className="absolute top-4 right-4 bg-violet-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center z-10">
                    <img src="chifra/check_mark.png" alt="галочка" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </div>
                  <div className="relative z-10 p-4 sm:p-6">
                    <p className="font-bold text-gray-800 text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2">Легкость</p>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl font-sans">Не нужно много знаний чтобы понять как проходить олимпиады. У нас все легко и просто. Учитесь, развивайтесь и узнавайте мир вместе с нами!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ТРЕТИЙ БЛОК (ЦИФРЫ) */}
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/main_page.png')" }}>
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4" style={{ backgroundImage: "url('chifra/binary_002.png')" }} />
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
          <div><img src="chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
          <NavigationButtons />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-12">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-white">
            <div className="rounded-xl m-2 sm:m-4 flex flex-col justify-center items-center backdrop-blur-sm w-[calc(100%-1rem)] sm:w-[280px]" style={{ height: '186px', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.85), rgba(168, 85, 247, 0.85))' }}>
              <img src="chifra/smailey_people.png" alt="стрелка" className="w-6 h-6 sm:w-8 sm:h-8 mt-3 sm:mt-4" />
              <p className="mt-2 sm:mt-4 font-sans text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl">29430</p>
              <p className="mt-1 sm:mt-4 font-sans text-white text-xs sm:text-base">Студентов</p>
            </div>
            <div className="rounded-xl m-2 sm:m-4 flex flex-col justify-center items-center backdrop-blur-sm w-[calc(100%-1rem)] sm:w-[280px]" style={{ height: '186px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.85), rgba(126, 34, 206, 0.85))' }}>
              <img src="chifra/smailey_check_paper.png" alt="стрелка" className="w-6 h-6 sm:w-8 sm:h-8 mt-3 sm:mt-4" />
              <p className="mt-2 sm:mt-4 font-sans text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl">2389</p>
              <p className="mt-1 sm:mt-4 font-sans text-white text-xs sm:text-base">Олимпиад</p>
            </div>
            <div className="rounded-xl m-2 sm:m-4 flex flex-col justify-center items-center backdrop-blur-sm w-[calc(100%-1rem)] sm:w-[280px]" style={{ height: '186px', background: 'linear-gradient(135deg, rgba(126, 34, 206, 0.85), rgba(88, 28, 135, 0.85))' }}>
              <img src="chifra/smailey_handsnake.png" alt="стрелка" className="w-6 h-6 sm:w-8 sm:h-8 mt-3 sm:mt-4" />
              <p className="mt-2 sm:mt-4 font-sans text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl">29</p>
              <p className="mt-1 sm:mt-4 font-sans text-white text-xs sm:text-base">Партнеров</p>
            </div>
            <div className="rounded-xl m-2 sm:m-4 flex flex-col justify-center items-center backdrop-blur-sm w-[calc(100%-1rem)] sm:w-[280px]" style={{ height: '186px', background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.85), rgba(76, 29, 149, 0.85), rgba(139, 92, 246, 0.7))' }}>
              <img src="chifra/smailey_heart.png" alt="стрелка" className="w-6 h-6 sm:w-8 sm:h-8 mt-3 sm:mt-4" />
              <p className="mt-2 sm:mt-4 font-sans text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl">10</p>
              <p className="mt-1 sm:mt-4 font-sans text-white text-xs sm:text-base">Лет вместе</p>
            </div>
          </div>
        </div>
      </div>

      {/* ЧЕТВЕРТЫЙ БЛОК (ОТЗЫВЫ) */}
      <div className="relative min-h-screen flex flex-col p-3 sm:p-4" style={{ backgroundColor: '#EDE9FE' }}>
        <img src="chifra/reviews1.png" alt="" className="absolute bottom-0 left-0 w-24 sm:w-auto opacity-0 sm:opacity-100 pointer-events-none" style={{ zIndex: 0 }} />
        <img src="chifra/reviews2.png" alt="" className="absolute bottom-0 right-0 w-24 sm:w-auto opacity-0 sm:opacity-100 pointer-events-none" style={{ zIndex: 0 }} />

        <div className="relative flex flex-col justify-center min-h-screen" style={{ zIndex: 1 }}>
          <div className="flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4">
            <div><img src="chifra/logo_chifra_black.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
            <NavigationButtons />
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 md:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-0">
                <p className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-sans text-center sm:text-left text-gray-800">ОТЗЫВЫ</p>
                <div className="flex gap-2">
                  <button onClick={prevReviews} className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors" style={{ width: '70px', height: '24px' }}>
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextReviews} className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors" style={{ width: '70px', height: '24px' }}>
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
              <div className="bg-white/90 rounded-3xl shadow-xl w-full py-8 sm:py-12 px-4 sm:px-6 md:px-10">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10">
                  {visibleReviews.map((review) => (
                    <div key={review.id} className="flex flex-col w-full sm:w-[320px] md:w-[350px] lg:w-[380px] min-h-[300px] sm:min-h-[320px]">
                      <img src="chifra/forging.png" alt="кавычки" className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
                      <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed flex-1 mb-4 sm:mb-6 line-clamp-4">{review.text}</p>
                      <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gray-300 rounded-full overflow-hidden"><img src={review.avatar} alt="аватар" className="w-full h-full object-cover" /></div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">{review.name}</p>
                          <p className="text-xs sm:text-sm md:text-base text-gray-500">{review.role}</p>
                          <div className="flex gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
                            {[...Array(5)].map((_, i) => (<span key={i} className={`text-sm sm:text-base md:text-lg ${i < review.stars ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 sm:gap-3 mt-6 sm:mt-8">
                {[...Array(Math.ceil(allReviews.length / reviewsToShow))].map((_, idx) => {
                  const isActive = Math.floor(currentReviewIndex / reviewsToShow) === idx;
                  return (<button key={idx} onClick={() => setCurrentReviewIndex(idx * reviewsToShow)} className={`transition-all duration-300 rounded-full ${isActive ? 'bg-gray-800 w-6 sm:w-8 h-1.5 sm:h-2' : 'bg-gray-400 hover:bg-gray-500 w-1.5 sm:w-2 h-1.5 sm:h-2'}`} />);
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ПЯТЫЙ БЛОК (КОЛЛЕДЖИ ПАРТНЕРЫ) */}
      <div className="relative min-h-screen flex flex-col p-3 sm:p-4" style={{ backgroundColor: '#EDE9FE' }}>
        <img src="chifra/lower_wave.png" alt="Волна" className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ zIndex: 0 }} />
        
        <div className="relative" style={{ zIndex: 1 }}>
          <div className="flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4">
            <div><img src="chifra/logo_chifra_black.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
            <NavigationButtons />
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="w-full max-w-[1400px] px-2 sm:px-4 md:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-0">
                <p className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-sans text-center sm:text-left text-gray-800">КОЛЛЕДЖИ ПАРТНЕРЫ</p>
                <div className="flex gap-2">
                  <button onClick={prevCollege} className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors" style={{ width: '70px', height: '24px' }}>
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextCollege} className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors" style={{ width: '70px', height: '24px' }}>
                    <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-full lg:hidden">
                  <CollegeCard college={allColleges[currentCollegeIndex]} isActive={true} />
                </div>
                <div className="hidden lg:grid lg:grid-cols-3 gap-6 items-stretch w-full">
                  <div className="transition-all duration-300"><CollegeCard college={allColleges[leftIndex]} isActive={false} /></div>
                  <div className="transition-all duration-300"><CollegeCard college={allColleges[currentCollegeIndex]} isActive={true} /></div>
                  <div className="transition-all duration-300"><CollegeCard college={allColleges[rightIndex]} isActive={false} /></div>
                </div>
              </div>
              <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-12">
                {allColleges.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentCollegeIndex(idx)} className={`transition-all duration-300 rounded-full ${currentCollegeIndex === idx ? 'bg-gray-800 w-6 sm:w-8 h-1.5 sm:h-2' : 'bg-gray-400 hover:bg-gray-500 w-1.5 sm:w-2 h-1.5 sm:h-2'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ШЕСТОЙ БЛОК (ДОКУМЕНТЫ) */}
      <div className="relative min-h-screen flex flex-col p-3 sm:p-4" style={{ backgroundColor: '#312C85' }}>
        <div className="relative z-10 flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4">
          <div><img src="chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
          <NavigationButtons />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-sans text-white my-4 sm:my-6 md:my-8 text-center px-4">ДОКУМЕНТЫ</p>
          <div className="w-full px-2 sm:px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center">
              {[...Array(16)].map((_, idx) => {
                const icons = ["Microsoft_Excel.png", "TXT.png", "Microsoft_Word.png", "PDF.png"];
                const icon = icons[idx % 4];
                return (
                  <div key={idx} className="bg-white/5 w-full max-w-[310px] h-[84px] sm:h-[94px] rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                    <img src={`chifra/${icon}`} alt={icon.replace(".png", "")} className="w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="text-gray-100 text-xs sm:text-sm leading-tight">Положение о проведении олимпиады</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}