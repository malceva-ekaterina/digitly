"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// КОМПОНЕНТ КНОПКИ ПРОФИЛЯ
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

//КОМПОНЕНТ ШАПКИ 
function Header() {
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
          Мои организации
        </p>
      </div>
    </div>
  );
}

// ТЕСТОВЫЕ ДАННЫЕ
const MOCK_INSTITUTIONS = [
  {
    id: 1,
    name: "ГАПОУ СО «Нижнетагильский торгово-экономический колледж»",
    inn: "6668012345",
    website: "https://nttek.ru",
    status: "approved",
    role: "admin",
    created_at: "2025-01-15T10:30:00.000Z",
    rejection_reason: null
  },
  {
    id: 2,
    name: "ГБПОУ «Московский колледж бизнеса и технологий»",
    inn: "772312345678",
    website: "https://mkbt.msk.ru",
    status: "pending",
    role: "methodist",
    created_at: "2025-02-20T14:45:00.000Z",
    rejection_reason: null
  },
  {
    id: 3,
    name: "ГАПОУ «Казанский педагогический колледж»",
    inn: "1655123456",
    website: "https://kpk-kazan.ru",
    status: "rejected",
    role: "admin",
    created_at: "2025-03-01T09:15:00.000Z",
    rejection_reason: "Не предоставлен полный пакет документов"
  }
];

export default function MyInstitutionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    // Проверяем параметр mock в URL
    const isMock = searchParams.get('mock') === 'true';
    
    if (isMock) {
      // Используем тестовые данные
      setInstitutions(MOCK_INSTITUTIONS);
      setLoading(false);
    } else {
      fetchInstitutions();
    }
  }, [searchParams]);

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/institutions/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        // Если API не работает, используем тестовые данные
        setInstitutions(MOCK_INSTITUTIONS);
      }
    } catch (err) {
      console.error('Ошибка загрузки организаций:', err);
      // При ошибке используем тестовые данные
      setInstitutions(MOCK_INSTITUTIONS);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">На модерации</span>;
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Активна</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Отклонена</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleResubmit = () => {
    router.push('/institutions/apply');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
      
      <Header />
      
      <div className="flex-1 bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="flex flex-col md:flex-row gap-8">
            
            <div className="flex-1">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Мои организации</h2>
                    <p className="text-gray-500 text-sm mt-1">Управление зарегистрированными образовательными организациями</p>
                  </div>
                  <Link
                    href="/institutions/apply"
                    className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    + Зарегистрировать ОО
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  {loading ? (
                    <div className="text-center py-12">
                      <svg className="w-10 h-10 animate-spin text-[#8E51FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <p className="text-gray-500">Загрузка организаций...</p>
                    </div>
                  ) : institutions.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">У вас пока нет зарегистрированных организаций</p>
                      <Link href="/institutions/apply" className="text-[#8E51FF] hover:underline inline-flex items-center gap-1">
                        Зарегистрировать организацию
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {institutions.map((inst) => (
                        <div key={inst.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg text-gray-800">{inst.name}</h3>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                  </svg>
                                  <span>ИНН: {inst.inn}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                                  </svg>
                                  <span>Сайт: <a href={inst.website} target="_blank" rel="noopener noreferrer" className="text-[#8E51FF] hover:underline">{inst.website}</a></span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>Создана: {formatDate(inst.created_at)}</span>
                                </div>
                              </div>
                              {inst.status === 'rejected' && inst.rejection_reason && (
                                <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-red-700 text-sm flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Причина отказа: {inst.rejection_reason}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              {getStatusBadge(inst.status)}
                              <span className="text-xs text-gray-400">
                                {inst.role === 'admin' ? 'Администратор' : 'Методист'}
                              </span>
                              {inst.status === 'approved' && (
                                <button 
                                  onClick={() => router.push(`/institutions/${inst.id}/dashboard?mock=true`)}
                                  className="text-sm text-[#8E51FF] hover:underline"
                                >
                                  Подробнее →
                                </button>
                              )}
                              {inst.status === 'pending' && (
                                <button className="text-sm text-gray-400 cursor-not-allowed" disabled>
                                  Ожидание модерации
                                </button>
                              )}
                              {inst.status === 'rejected' && (
                                <button 
                                  onClick={handleResubmit}
                                  className="text-sm text-[#8E51FF] hover:underline"
                                >
                                  Подать заново
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[100px] md:h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}