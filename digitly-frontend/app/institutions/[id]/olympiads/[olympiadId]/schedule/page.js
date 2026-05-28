"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// ========== ТЕСТОВЫЙ РЕЖИМ ==========
const isTestMode = typeof window !== 'undefined' && (
  window.location.search.includes('test=true') || 
  window.location.search.includes('mock=true')
);

// ========== КОМПОНЕНТ КНОПКИ ПРОФИЛЯ ==========
function ProfileButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
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
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleNavigation = (path) => { setIsOpen(false); router.push(path); };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setIsAuthenticated(false);
    setIsOpen(false);
    router.push('/');
    window.dispatchEvent(new Event('storage'));
  };

  if (isAuthenticated) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={toggleMenu}
          className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden sm:inline max-w-[100px] truncate">{userName.split(' ')[0]}</span>
          <svg className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isOpen && (
          <div ref={menuRef} className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-50">
            <button onClick={() => handleNavigation('/profile')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Личный кабинет
            </button>
            <button onClick={() => handleNavigation('/profile/security')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Безопасность
            </button>
            <button onClick={() => handleNavigation('/profile/settings')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Настройки
            </button>
            <div className="border-t border-gray-100"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              Выйти
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href="/login" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
      <span>Вход</span>
      <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
    </Link>
  );
}

// ========== КОМПОНЕНТ ШАПКИ ==========
function Header({ olympiadTitle }) {
  return (
    <div className="w-full h-[200px] md:h-[278px] relative" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}>
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
        <div>
          <Link href="/">
            <img src="/chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto cursor-pointer" />
          </Link>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <Link href="/olympiads" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
            <span>Олимпиады</span>
            <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </Link>
          <Link href="/methodics" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
            <span>Методочки</span>
            <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </Link>
          <ProfileButton />
        </div>
      </div>
      <div className='absolute bottom-4 left-0 right-0'>
        <p className='font-sans text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold p-4 break-words'>
          Расписание: {olympiadTitle || 'Олимпиада'}
        </p>
      </div>
    </div>
  );
}

// ========== КОМПОНЕНТ ДАТАПИКЕРА ==========
function DateTimePicker({ label, value, onChange, minDate, maxDate, error, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="datetime-local"
        value={value || ''}
        onChange={onChange}
        min={minDate}
        max={maxDate}
        className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
          error ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default function OlympiadSchedulePage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id;
  const olympiadId = params?.olympiadId;
  
  const [loading, setLoading] = useState(false);
  const [olympiadTitle, setOlympiadTitle] = useState('');
  const [hasEssayQuestions, setHasEssayQuestions] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [schedule, setSchedule] = useState({
    registration_start_at: '',
    registration_end_at: '',
    participation_start_at: '',
    participation_end_at: '',
    review_start_at: '',
    review_end_at: '',
  });
  
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchOlympiadData();
  }, [olympiadId]);

  const fetchOlympiadData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isTestMode) {
        setOlympiadTitle('Тестовая олимпиада');
        setHasEssayQuestions(true);
        setSchedule({
          registration_start_at: '2025-06-01T00:00',
          registration_end_at: '2025-06-10T23:59',
          participation_start_at: '2025-06-11T00:00',
          participation_end_at: '2025-06-20T23:59',
          review_start_at: '2025-06-21T00:00',
          review_end_at: '2025-06-30T23:59',
        });
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/v1/olympiads/${olympiadId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOlympiadTitle(data.title);
        setHasEssayQuestions(data.has_essay_questions || false);
        setSchedule({
          registration_start_at: data.registration_start_at || '',
          registration_end_at: data.registration_end_at || '',
          participation_start_at: data.participation_start_at || '',
          participation_end_at: data.participation_end_at || '',
          review_start_at: data.review_start_at || '',
          review_end_at: data.review_end_at || '',
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateSchedule = () => {
    const newErrors = {};
    
    if (!schedule.registration_start_at) {
      newErrors.registration_start_at = 'Укажите дату начала регистрации';
    }
    if (!schedule.registration_end_at) {
      newErrors.registration_end_at = 'Укажите дату окончания регистрации';
    }
    if (!schedule.participation_start_at) {
      newErrors.participation_start_at = 'Укажите дату начала участия';
    }
    if (!schedule.participation_end_at) {
      newErrors.participation_end_at = 'Укажите дату окончания участия';
    }
    
    if (hasEssayQuestions) {
      if (!schedule.review_start_at) {
        newErrors.review_start_at = 'Укажите дату начала проверки эссе';
      }
      if (!schedule.review_end_at) {
        newErrors.review_end_at = 'Укажите дату окончания проверки эссе';
      }
    }
    
    if (schedule.registration_start_at && schedule.registration_end_at) {
      const regStart = new Date(schedule.registration_start_at);
      const regEnd = new Date(schedule.registration_end_at);
      if (regStart >= regEnd) {
        newErrors.registration_end_at = 'Дата окончания должна быть позже даты начала';
      }
    }
    
    if (schedule.registration_end_at && schedule.participation_start_at) {
      const regEnd = new Date(schedule.registration_end_at);
      const partStart = new Date(schedule.participation_start_at);
      if (regEnd >= partStart) {
        newErrors.participation_start_at = 'Участие должно начинаться после окончания регистрации';
      }
    }
    
    if (schedule.participation_start_at && schedule.participation_end_at) {
      const partStart = new Date(schedule.participation_start_at);
      const partEnd = new Date(schedule.participation_end_at);
      if (partStart >= partEnd) {
        newErrors.participation_end_at = 'Дата окончания участия должна быть позже даты начала';
      }
    }
    
    if (hasEssayQuestions && schedule.participation_end_at && schedule.review_start_at) {
      const partEnd = new Date(schedule.participation_end_at);
      const reviewStart = new Date(schedule.review_start_at);
      if (partEnd >= reviewStart) {
        newErrors.review_start_at = 'Проверка эссе должна начинаться после окончания участия';
      }
    }
    
    if (hasEssayQuestions && schedule.review_start_at && schedule.review_end_at) {
      const reviewStart = new Date(schedule.review_start_at);
      const reviewEnd = new Date(schedule.review_end_at);
      if (reviewStart >= reviewEnd) {
        newErrors.review_end_at = 'Дата окончания проверки должна быть позже даты начала';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSchedule()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isTestMode) {
        showToast('Расписание сохранено', 'success');
        setTimeout(() => {
          // Перенаправляем на страницу вопросов
          router.push(`/institutions/${institutionId}/olympiads/${olympiadId}/questions?mock=true`);
        }, 1000);
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/v1/olympiads/${olympiadId}/schedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule),
      });
      
      if (response.ok) {
        showToast('Расписание сохранено', 'success');
        setTimeout(() => {
          // Перенаправляем на страницу вопросов
          router.push(`/institutions/${institutionId}/olympiads/${olympiadId}/questions`);
        }, 1000);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при сохранении расписания');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getMinDateFor = (field) => {
    switch (field) {
      case 'registration_end_at':
        return schedule.registration_start_at;
      case 'participation_start_at':
        return schedule.registration_end_at;
      case 'participation_end_at':
        return schedule.participation_start_at;
      case 'review_start_at':
        return schedule.participation_end_at;
      case 'review_end_at':
        return schedule.review_start_at;
      default:
        return undefined;
    }
  };

  if (loading && !olympiadTitle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-in slide-in-from-right-5`}>
          {toast.message}
        </div>
      )}
      
      <Header olympiadTitle={olympiadTitle} />
      
      <div className="flex-1 bg-gray-100 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="text-[#8E51FF] hover:underline inline-flex items-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад к олимпиаде
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">Настройка расписания</h1>
              <p className="text-gray-500 text-sm mt-1">Установите даты и время для всех этапов олимпиады</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm">1</span>
                  Регистрация участников
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <DateTimePicker
                    label="Дата и время начала"
                    value={schedule.registration_start_at}
                    onChange={(e) => handleDateChange('registration_start_at', e.target.value)}
                    error={errors.registration_start_at}
                    required
                  />
                  <DateTimePicker
                    label="Дата и время окончания"
                    value={schedule.registration_end_at}
                    onChange={(e) => handleDateChange('registration_end_at', e.target.value)}
                    minDate={getMinDateFor('registration_end_at')}
                    error={errors.registration_end_at}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  В этот период участники могут зарегистрироваться на олимпиаду
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm">2</span>
                  Участие (прохождение олимпиады)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <DateTimePicker
                    label="Дата и время начала"
                    value={schedule.participation_start_at}
                    onChange={(e) => handleDateChange('participation_start_at', e.target.value)}
                    minDate={getMinDateFor('participation_start_at')}
                    error={errors.participation_start_at}
                    required
                  />
                  <DateTimePicker
                    label="Дата и время окончания"
                    value={schedule.participation_end_at}
                    onChange={(e) => handleDateChange('participation_end_at', e.target.value)}
                    minDate={getMinDateFor('participation_end_at')}
                    error={errors.participation_end_at}
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  В этот период участники могут проходить олимпиаду
                </p>
              </div>
              
              {hasEssayQuestions && (
                <div className="border border-gray-200 rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm">3</span>
                    Проверка эссе
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <DateTimePicker
                      label="Дата и время начала"
                      value={schedule.review_start_at}
                      onChange={(e) => handleDateChange('review_start_at', e.target.value)}
                      minDate={getMinDateFor('review_start_at')}
                      error={errors.review_start_at}
                      required
                    />
                    <DateTimePicker
                      label="Дата и время окончания"
                      value={schedule.review_end_at}
                      onChange={(e) => handleDateChange('review_end_at', e.target.value)}
                      minDate={getMinDateFor('review_end_at')}
                      error={errors.review_end_at}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    В этот период методисты проверяют эссе участников
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Хронология событий:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Регистрация:</span>
                    <span className="text-gray-800">
                      {schedule.registration_start_at ? new Date(schedule.registration_start_at).toLocaleString() : '—'} → 
                      {schedule.registration_end_at ? new Date(schedule.registration_end_at).toLocaleString() : '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Участие:</span>
                    <span className="text-gray-800">
                      {schedule.participation_start_at ? new Date(schedule.participation_start_at).toLocaleString() : '—'} → 
                      {schedule.participation_end_at ? new Date(schedule.participation_end_at).toLocaleString() : '—'}
                    </span>
                  </div>
                  {hasEssayQuestions && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Проверка эссе:</span>
                      <span className="text-gray-800">
                        {schedule.review_start_at ? new Date(schedule.review_start_at).toLocaleString() : '—'} → 
                        {schedule.review_end_at ? new Date(schedule.review_end_at).toLocaleString() : '—'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  Сохранить расписание
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-all"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[100px] md:h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}