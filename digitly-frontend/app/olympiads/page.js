"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';

// ========== КОМПОНЕНТ КНОПКИ ПРОФИЛЯ ==========
function ProfileButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.fullname || 'Пользователь');
      } catch {
        setUserName('Пользователь');
      }
    }
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

  const toggleMenu = () => setIsOpen(!isOpen);
  const goTo = (path) => { setIsOpen(false); window.location.href = path; };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/'; };

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
        <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
          <div onClick={() => goTo('/profile')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Личный кабинет</div>
          <div onClick={() => goTo('/profile/security')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Безопасность</div>
          <div onClick={() => goTo('/profile/settings')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">Настройки</div>
          <div className="border-t border-gray-100"></div>
          <div onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer">Выйти</div>
        </div>
      )}
    </div>
  );
}

// ========== КОМПОНЕНТ НАВИГАЦИИ ==========
function NavigationButtons() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
      <Link href="/olympiads" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
        <span className="text-gray-700">Олимпиады</span>
        <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
      </Link>
      <Link href="/methodics" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
        <span className="text-gray-700">Методочки</span>
        <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
      </Link>
      <ProfileButton />
    </div>
  );
}

// ========== КОМПОНЕНТ ФИЛЬТРОВ ==========
function FilterChip({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium transition-all ${
        isActive 
          ? 'bg-violet-600 text-white shadow-md' 
          : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
      } text-[11px] sm:text-xs md:text-sm`}
    >
      <span>{label}</span>
      <svg className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 ${isActive ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// ========== КОМПОНЕНТ ПОИСКА ==========
function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="relative bg-white rounded-full shadow-sm">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white rounded-full outline-none focus:shadow-md transition-all text-xs sm:text-sm md:text-base"
      />
    </div>
  );
}

// ========== ОСНОВНОЙ КОМПОНЕНТ ==========
export default function OlympiadsCatalogPage() {
  const [olympiads, setOlympiads] = useState([]);
  const [filteredOlympiads, setFilteredOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const MOCK_OLYMPIADS = [
    { id: 1, title: "Основы информатики", subject: "Информатика", age: "5-9 классы", organization: "ГАПОУ СО НТТЭК", price: 0, type: "permanent", questions: 10 },
    { id: 2, title: "Математический марафон", subject: "Математика", age: "10-11 классы", organization: "ГБПОУ МКБТ", price: 500, type: "scheduled", questions: 15 },
    { id: 3, title: "English Grammar", subject: "Английский язык", age: "Без ограничений", organization: "ГАПОУ КПК", price: 300, type: "permanent", questions: 20 },
    { id: 4, title: "Физика вокруг нас", subject: "Физика", age: "10-11 классы", organization: "ГАПОУ СО НТТЭК", price: 0, type: "permanent", questions: 12 },
    { id: 5, title: "История России", subject: "История", age: "5-9 классы", organization: "ГБПОУ МКБТ", price: 250, type: "scheduled", questions: 25 },
    { id: 6, title: "Химия элементов", subject: "Химия", age: "10-11 классы", organization: "ГАПОУ КПК", price: 400, type: "permanent", questions: 18 },
    { id: 7, title: "Биология: мир животных", subject: "Биология", age: "5-9 классы", organization: "ГАПОУ СО НТТЭК", price: 0, type: "permanent", questions: 15 },
    { id: 8, title: "География России", subject: "География", age: "5-9 классы", organization: "ГБПОУ МКБТ", price: 200, type: "scheduled", questions: 20 },
    { id: 9, title: "Литература XIX века", subject: "Литература", age: "10-11 классы", organization: "ГАПОУ КПК", price: 350, type: "permanent", questions: 22 },
    { id: 10, title: "Обществознание", subject: "Обществознание", age: "10-11 классы", organization: "ГАПОУ СО НТТЭК", price: 0, type: "permanent", questions: 14 },
    { id: 11, title: "Программирование на Python", subject: "Информатика", age: "10-11 классы", organization: "ГБПОУ МКБТ", price: 600, type: "scheduled", questions: 12 },
    { id: 12, title: "Английский для IT", subject: "Английский язык", age: "Студенты", organization: "ГАПОУ КПК", price: 450, type: "permanent", questions: 16 },
    { id: 13, title: "Русский язык: орфография", subject: "Русский язык", age: "5-9 классы", organization: "ГАПОУ СО НТТЭК", price: 0, type: "permanent", questions: 18 },
    { id: 14, title: "Экономика для школьников", subject: "Экономика", age: "10-11 классы", organization: "ГБПОУ МКБТ", price: 300, type: "scheduled", questions: 10 },
    { id: 15, title: "Астрономия", subject: "Физика", age: "10-11 классы", organization: "ГАПОУ КПК", price: 0, type: "permanent", questions: 12 },
    { id: 16, title: "Экология", subject: "Биология", age: "Студенты", organization: "ГАПОУ СО НТТЭК", price: 250, type: "permanent", questions: 14 },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOlympiads(MOCK_OLYMPIADS);
      setFilteredOlympiads(MOCK_OLYMPIADS);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = [...olympiads];
    if (searchTerm) {
      filtered = filtered.filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterValue && activeFilter === "subject") filtered = filtered.filter(o => o.subject === filterValue);
    if (filterValue && activeFilter === "age") filtered = filtered.filter(o => o.age === filterValue);
    if (filterValue && activeFilter === "organization") filtered = filtered.filter(o => o.organization === filterValue);
    if (filterValue && activeFilter === "price") {
      if (filterValue === "free") filtered = filtered.filter(o => o.price === 0);
      if (filterValue === "paid") filtered = filtered.filter(o => o.price > 0);
    }
    setFilteredOlympiads(filtered);
    setCurrentPage(1);
  }, [searchTerm, activeFilter, filterValue, olympiads]);

  const totalPages = Math.ceil(filteredOlympiads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOlympiads = filteredOlympiads.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const subjects = [...new Set(olympiads.map(o => o.subject))];
  const ages = [...new Set(olympiads.map(o => o.age))];
  const organizations = [...new Set(olympiads.map(o => o.organization))];

  const handleFilterClick = (filterName) => {
    if (activeFilter === filterName) {
      setActiveFilter(null);
      setFilterValue("");
    } else {
      setActiveFilter(filterName);
      setFilterValue("");
    }
  };

  const handleFilterSelect = (value) => {
    setFilterValue(value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActiveFilter(null);
    setFilterValue("");
  };

  const getFilterOptions = () => {
    switch (activeFilter) {
      case "subject": return subjects;
      case "age": return ages;
      case "organization": return organizations;
      case "price": return ["Бесплатные", "Платные"];
      default: return [];
    }
  };

  const filtersList = ["Предмет", "Возраст", "Организация", "Цена"];

  return (
    <div className="min-h-screen">
      {/* БЛОК 1: ГРАДИЕНТНЫЙ ФОН С ВОЛНОЙ */}
      <div className="relative h-[650px] sm:h-[650px] md:h-[700px] w-full overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #A684FF 0%, #A3B3FF 25%, #FFCCD3 50%, #FFA1AD 75%, #7C86FF 100%)' 
      }}>
        {/* Шапка */}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4">
          <Link href="/">
            <img src="/chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto cursor-pointer" />
          </Link>
          <NavigationButtons />
        </div>

        {/* Контейнер для центрирования названия - увеличен размер на мобильных */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
          <div className="flex justify-center items-center">
            {/* Название - увеличено на мобильных */}
            <div className="flex-shrink w-full flex justify-center">
              <img 
                src="/olimpiads/title.png" 
                alt="Цифра Олимпус" 
                className="w-full max-w-[350px] sm:max-w-[400px] md:max-w-[550px] lg:max-w-[650px] h-auto" 
              />
            </div>
          </div>
        </div>

        {/* Волна - увеличена на мобильных */}
        <div className="absolute bottom-0 left-0 right-0 w-full">
          <img src="/chifra/lower_wave.png" alt="волна" className="w-full h-auto scale-110 sm:scale-100" />
        </div>
      </div>

      {/* ОСТАЛЬНОЙ КОД... */}
      {/* БЛОК 2: ФИЛЬТРЫ И КАРТОЧКИ */}
      <div className="bg-[#312C85] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          
          {/* Поиск */}
          <div className="w-full mb-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Поиск..." />
          </div>
          
          {/* Кнопка "Фильтры" для мобильных */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full bg-white rounded-xl py-2 px-4 mb-3 flex items-center justify-between text-gray-700 font-medium text-sm"
          >
            <span>Фильтры</span>
            <svg className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Фильтры */}
          <div className={`${showFilters ? 'flex' : 'hidden'} lg:flex flex-wrap gap-2 mb-4`}>
            {filtersList.map((filter) => {
              let filterKey = "";
              if (filter === "Предмет") filterKey = "subject";
              if (filter === "Возраст") filterKey = "age";
              if (filter === "Организация") filterKey = "organization";
              if (filter === "Цена") filterKey = "price";
              return (
                <FilterChip
                  key={filter}
                  label={filter}
                  isActive={activeFilter === filterKey}
                  onClick={() => handleFilterClick(filterKey)}
                />
              );
            })}
          </div>

          {/* Выпадающие опции фильтров */}
          {activeFilter && (
            <div className="mt-4 flex flex-wrap gap-2 bg-white rounded-xl p-4 shadow-sm mb-4">
              {getFilterOptions().map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterSelect(option === "Бесплатные" ? "free" : option === "Платные" ? "paid" : option)}
                  className={`px-3 py-1.5 rounded-full transition-all text-[11px] sm:text-xs md:text-sm ${
                    filterValue === (option === "Бесплатные" ? "free" : option === "Платные" ? "paid" : option)
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
              <button
                onClick={() => setFilterValue("")}
                className="px-3 py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm text-gray-400 hover:text-gray-600"
              >
                Сбросить
              </button>
            </div>
          )}

          {/* Счётчик результатов */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-white/70 text-[11px] sm:text-xs md:text-sm">Найдено: {filteredOlympiads.length} олимпиад</p>
            {(searchTerm || activeFilter) && (
              <button onClick={clearFilters} className="text-[11px] sm:text-xs md:text-sm text-white/70 hover:text-white underline">
                Сбросить все фильтры
              </button>
            )}
          </div>

          {/* Карточки олимпиад */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-white/70">Загрузка олимпиад...</p>
            </div>
          ) : filteredOlympiads.length === 0 ? (
            <div className="text-center py-12 bg-white/10 rounded-2xl">
              <p className="text-white/70">Олимпиад не найдено</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentOlympiads.map((olymp) => (
                  <div key={olymp.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="p-4 sm:p-5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{olymp.subject}</span>
                        {olymp.type === "scheduled" && <span className="text-[10px] sm:text-[11px] md:text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Временная</span>}
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1 line-clamp-1">{olymp.title}</h3>
                      <p className="text-[10px] sm:text-[11px] md:text-xs text-gray-400 mb-2">{olymp.organization}</p>
                      <div className="flex items-center gap-2 sm:gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-500">{olymp.questions} вопросов</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] sm:text-[11px] md:text-xs text-gray-400">{olymp.age}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div>
                          {olymp.price === 0 ? (
                            <span className="text-green-600 font-bold text-[11px] sm:text-xs md:text-sm">Бесплатно</span>
                          ) : (
                            <span className="text-gray-800 font-bold text-[11px] sm:text-xs md:text-sm">{olymp.price} ₽</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/olympiads/${olymp.id}`} className="text-violet-600 hover:text-violet-800 text-[11px] sm:text-xs md:text-sm font-medium">Подробнее</Link>
                          <button className="bg-gradient-to-r from-violet-600 to-violet-800 hover:from-violet-700 hover:to-violet-900 text-white px-2 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs md:text-sm font-medium transition-all">Купить</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all text-[11px] sm:text-xs md:text-sm ${
                      currentPage === 1
                        ? 'bg-white/20 text-white/40 cursor-not-allowed'
                        : 'bg-white text-violet-700 hover:bg-gray-100'
                    }`}
                  >
                    ← Назад
                  </button>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-medium transition-all text-[11px] sm:text-xs md:text-sm ${
                              currentPage === pageNum
                                ? 'bg-white text-violet-700 font-bold'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        (pageNum === 2 && currentPage > 3) ||
                        (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return <span key={pageNum} className="text-white/50 text-[11px] sm:text-xs">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all text-[11px] sm:text-xs md:text-sm ${
                      currentPage === totalPages
                        ? 'bg-white/20 text-white/40 cursor-not-allowed'
                        : 'bg-white text-violet-700 hover:bg-gray-100'
                    }`}
                  >
                    Вперёд →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* БЛОК 3: ДОКУМЕНТЫ */}
      <div className="relative min-h-screen flex flex-col p-3 sm:p-4" style={{ backgroundColor: '#312C85' }}>
        <div className="relative z-10 flex justify-between items-center px-2 sm:px-4 md:px-8 py-2 sm:py-4">
          <div><img src="/chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto" /></div>
          <NavigationButtons />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-sans text-white my-4 sm:my-6 md:my-8 text-center px-4">ДОКУМЕНТЫ</p>
          <div className="w-full px-2 sm:px-4 md:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center">
              {[...Array(16)].map((_, idx) => {
                const icons = ["Microsoft_Excel.png", "TXT.png", "Microsoft_Word.png", "PDF.png"];
                const icon = icons[idx % 4];
                return (
                  <div key={idx} className="bg-white/5 w-full max-w-[310px] h-[84px] sm:h-[94px] rounded-xl p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
                    <img src={`/chifra/${icon}`} alt={icon.replace(".png", "")} className="w-6 h-6 sm:w-8 sm:h-8" />
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