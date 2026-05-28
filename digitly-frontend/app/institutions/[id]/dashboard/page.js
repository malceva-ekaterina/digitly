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
function Header({ institutionName }) {
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
          {institutionName || 'Личный кабинет организации'}
        </p>
      </div>
    </div>
  );
}

// ========== КОМПОНЕНТ СТАТУСА ==========
function OlympiadStatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'draft':
        return { label: 'Черновик', bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: null };
      case 'pending_moderation':
        return { label: 'На модерации', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )};
      case 'approved':
        return { label: 'Одобрена', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )};
      case 'rejected':
        return { label: 'Отклонена', bgColor: 'bg-red-100', textColor: 'text-red-700', icon: (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )};
      default:
        return { label: status || 'Неизвестно', bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: null };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

// ========== МОКОВЫЕ ДАННЫЕ ==========
const MOCK_INSTITUTION = {
  id: 1,
  name: "ГАПОУ СО «Нижнетагильский торгово-экономический колледж»",
  inn: "6668012345",
  website: "https://nttek.ru",
  status: "approved",
  created_at: "2025-01-15T10:30:00.000Z",
  balance: 125000,
  active_olympiads: 8,
  participants_month: 156,
};

const MOCK_OLYMPIADS = [
  { id: 1, title: "Олимпиада по информатике", type: "permanent", status: "draft", questions_count: 3, created_at: "2025-01-15T10:00:00Z", rejection_reason: null, price: 0, description: "Проверка знаний по информатике", subject: "Информатика", age_group: "5-9 классы" },
  { id: 2, title: "Математическая олимпиада", type: "scheduled", status: "pending_moderation", questions_count: 8, created_at: "2025-01-20T14:30:00Z", rejection_reason: null, price: 500, description: "Математические задачи разного уровня", subject: "Математика", age_group: "10-11 классы" },
  { id: 3, title: "Олимпиада по русскому языку", type: "permanent", status: "approved", questions_count: 12, created_at: "2025-01-10T09:15:00Z", rejection_reason: null, price: 0, description: "Проверка грамотности", subject: "Русский язык", age_group: "5-11 классы" },
  { id: 4, title: "Олимпиада по физике", type: "scheduled", status: "rejected", questions_count: 6, created_at: "2025-01-18T11:45:00Z", rejection_reason: "Недостаточное количество вопросов. Требуется минимум 5 вопросов. Также отсутствует описание олимпиады.", price: 300, description: "", subject: "Физика", age_group: "10-11 классы" },
  { id: 5, title: "Олимпиада по химии", type: "permanent", status: "draft", questions_count: 0, created_at: "2025-01-22T16:20:00Z", rejection_reason: null, price: 200, description: "", subject: "Химия", age_group: "9-11 классы" },
];

export default function InstitutionDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id;
  
  const [institution, setInstitution] = useState(null);
  const [olympiads, setOlympiads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOlympiad, setSelectedOlympiad] = useState(null);
  const [returningToDraft, setReturningToDraft] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState('olympiads');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchData();
  }, [institutionId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isTestMode) {
        setInstitution(MOCK_INSTITUTION);
        setOlympiads(MOCK_OLYMPIADS);
        setLoading(false);
        return;
      }
      
      const [institutionRes, olympiadsRes] = await Promise.all([
        fetch(`/api/v1/institutions/${institutionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/v1/institutions/${institutionId}/olympiads`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (institutionRes.ok) {
        const data = await institutionRes.json();
        setInstitution(data);
      }
      
      if (olympiadsRes.ok) {
        const data = await olympiadsRes.json();
        setOlympiads(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setInstitution(MOCK_INSTITUTION);
      setOlympiads(MOCK_OLYMPIADS);
    } finally {
      setLoading(false);
    }
  };

  // Редактирование олимпиады
  const handleEditOlympiad = (olympiadId, e) => {
    e.stopPropagation();
    router.push(`/institutions/${institutionId}/olympiads/${olympiadId}/edit`);
  };

  // Возврат отклонённой олимпиады в черновик
  const handleReturnToDraft = async (olympiadId, e) => {
    e.stopPropagation();
    if (!confirm('Вернуть олимпиаду в черновик? Вы сможете исправить ошибки и отправить на повторную модерацию.')) {
      return;
    }
    
    setReturningToDraft(olympiadId);
    try {
      if (isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setOlympiads(olympiads.map(o => 
          o.id === olympiadId 
            ? { ...o, status: 'draft', rejection_reason: null }
            : o
        ));
        showToast('Олимпиада перемещена в черновик', 'success');
        setReturningToDraft(null);
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/olympiads/${olympiadId}/return-to-draft`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при возврате в черновик');
      }
      
      setOlympiads(olympiads.map(o => 
        o.id === olympiadId 
          ? { ...o, status: 'draft', rejection_reason: null }
          : o
      ));
      showToast('Олимпиада перемещена в черновик', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setReturningToDraft(null);
    }
  };

  // Удаление олимпиады
  const handleDeleteOlympiad = async (olympiadId, e) => {
    e.stopPropagation();
    if (!confirm('Удалить олимпиаду? Это действие нельзя отменить.')) {
      return;
    }
    
    setShowDeleteConfirm(olympiadId);
    try {
      if (isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setOlympiads(olympiads.filter(o => o.id !== olympiadId));
        if (selectedOlympiad?.id === olympiadId) {
          setSelectedOlympiad(null);
        }
        showToast('Олимпиада удалена', 'success');
        setShowDeleteConfirm(null);
        return;
      }
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/olympiads/${olympiadId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при удалении');
      }
      
      setOlympiads(olympiads.filter(o => o.id !== olympiadId));
      if (selectedOlympiad?.id === olympiadId) {
        setSelectedOlympiad(null);
      }
      showToast('Олимпиада удалена', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  // Открытие детальной информации об олимпиаде
  const toggleOlympiadDetails = (olympiad) => {
    if (selectedOlympiad?.id === olympiad.id) {
      setSelectedOlympiad(null);
    } else {
      setSelectedOlympiad(olympiad);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Активна</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">На модерации</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Отклонена</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    return type === 'permanent' ? 'Постоянная' : 'Временная';
  };

  const menuItems = [
    { id: 'dashboard', name: 'Дашборд' },
    { id: 'olympiads', name: 'Олимпиады' },
    { id: 'kiosk', name: 'Методический киоск' },
    { id: 'questions', name: 'Банки вопросов' },
    { id: 'team', name: 'Команда' },
    { id: 'requisites', name: 'Реквизиты' },
    { id: 'finances', name: 'Финансы' },
    { id: 'moderation', name: 'История модерации' },
  ];

  const handleMenuItemClick = (itemId) => {
    setActiveMenuItem(itemId);
    setSelectedOlympiad(null);
    if (itemId === 'team') {
      router.push(`/institutions/${institutionId}/team`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
        } text-white animate-in slide-in-from-right-5`}>
          {toast.message}
        </div>
      )}
      
      <Header institutionName={institution?.name} />
      
      <div className="flex-1 bg-gray-100 py-6 sm:py-10 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            
            {/* Левая навигация */}
            <nav className='rounded-xl w-full md:w-[280px] bg-white p-3 sm:p-4 shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] h-fit'>
              <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`flex-1 md:w-full text-left p-3 rounded-xl font-sans transition-all whitespace-nowrap md:whitespace-normal ${
                      activeMenuItem === item.id ? "bg-[#FFE4E6]" : "hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-sm md:text-base">{item.name}</span>
                  </button>
                ))}
              </div>
            </nav>
            
            {/* Основной контент */}
            <div className="flex-1">
              
              {/* Кнопка назад */}
              <div className="mb-4">
                <button
                  onClick={() => router.push('/profile/institutions')}
                  className="text-[#8E51FF] hover:underline inline-flex items-center gap-1 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Назад к моим организациям
                </button>
              </div>
              
              {/* ========== ДАШБОРД ========== */}
              {activeMenuItem === "dashboard" && (
                <>
                  {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <svg className="w-10 h-10 animate-spin text-[#8E51FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <p className="text-gray-500">Загрузка...</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                          <h2 className="text-lg font-bold text-gray-800">Информация об организации</h2>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-gray-500">Полное наименование</p>
                              <p className="font-medium text-gray-800 mt-1">{institution?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">ИНН</p>
                              <p className="font-medium text-gray-800 mt-1">{institution?.inn}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Сайт</p>
                              <a href={institution?.website} target="_blank" rel="noopener noreferrer" className="font-medium text-[#8E51FF] hover:underline mt-1 inline-block">
                                {institution?.website}
                              </a>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Дата регистрации</p>
                              <p className="font-medium text-gray-800 mt-1">{formatDate(institution?.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Статус</p>
                              <div className="mt-1">{getStatusBadge(institution?.status)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                          <div className="text-3xl font-bold text-[#312C85]">{olympiads.length}</div>
                          <p className="text-gray-500 text-sm mt-1">Всего олимпиад</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                          <div className="text-3xl font-bold text-[#312C85]">{olympiads.filter(o => o.status === 'approved').length}</div>
                          <p className="text-gray-500 text-sm mt-1">Активных олимпиад</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                          <div className="text-3xl font-bold text-[#312C85]">{olympiads.filter(o => o.status === 'pending_moderation').length}</div>
                          <p className="text-gray-500 text-sm mt-1">На модерации</p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ========== ОЛИМПИАДЫ ========== */}
              {activeMenuItem === "olympiads" && (
                <>
                  <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <h2 className="text-xl font-bold text-gray-800">Олимпиады организации</h2>
                    <button
                      onClick={() => router.push(`/institutions/${institutionId}/olympiads/create?mock=true`)}
                      className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Создать олимпиаду
                    </button>
                  </div>
                  
                  {loading ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <svg className="w-10 h-10 animate-spin text-[#8E51FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <p className="text-gray-500">Загрузка олимпиад...</p>
                    </div>
                  ) : olympiads.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 mb-4">У вас пока нет созданных олимпиад</p>
                      <button
                        onClick={() => router.push(`/institutions/${institutionId}/olympiads/create?mock=true`)}
                        className="text-[#8E51FF] hover:underline inline-flex items-center gap-1"
                      >
                        Создать первую олимпиаду
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {olympiads.map((olympiad) => (
                        <div key={olympiad.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                          {/* Основная строка олимпиады */}
                          <div 
                            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => toggleOlympiadDetails(olympiad)}
                          >
                            <div className="flex flex-wrap justify-between items-center gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap mb-2">
                                  <h3 className="text-lg font-bold text-gray-800 break-words">
                                    {olympiad.title}
                                  </h3>
                                  <OlympiadStatusBadge status={olympiad.status} />
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                    </svg>
                                    {getTypeLabel(olympiad.type)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {olympiad.questions_count} вопросов
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {olympiad.price === 0 ? 'Бесплатно' : `${olympiad.price} ₽`}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {formatDate(olympiad.created_at)}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {/* Кнопка редактирования - для всех, кроме олимпиад на модерации */}
                                {olympiad.status !== 'pending_moderation' && (
                                  <button
                                    onClick={(e) => handleEditOlympiad(olympiad.id, e)}
                                    className="bg-[#8E51FF] hover:bg-[#312C85] text-white px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1"
                                    title="Редактировать олимпиаду"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Редактировать
                                  </button>
                                )}
                                
                                {/* Кнопка "Вернуть в черновик" только для отклонённых */}
                                {olympiad.status === 'rejected' && (
                                  <button
                                    onClick={(e) => handleReturnToDraft(olympiad.id, e)}
                                    disabled={returningToDraft === olympiad.id}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1"
                                  >
                                    {returningToDraft === olympiad.id ? (
                                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                    ) : (
                                      <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Вернуть
                                      </>
                                    )}
                                  </button>
                                )}
                                
                                {/* Кнопка удаления - для всех олимпиад */}
                                <button
                                  onClick={(e) => handleDeleteOlympiad(olympiad.id, e)}
                                  disabled={showDeleteConfirm === olympiad.id}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1.5"
                                  title="Удалить олимпиаду"
                                >
                                  {showDeleteConfirm === olympiad.id ? (
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  )}
                                </button>
                                
                                {/* Стрелка раскрытия */}
                                <svg 
                                  className={`w-5 h-5 text-gray-400 transition-transform ${selectedOlympiad?.id === olympiad.id ? 'rotate-90' : ''}`} 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                          
                          {/* Раскрывающаяся панель с детальной информацией */}
                          {selectedOlympiad?.id === olympiad.id && (
                            <div className="border-t border-gray-200 bg-gray-50 p-6">
                              <h4 className="font-semibold text-gray-800 mb-4">Детальная информация</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500">Предмет</p>
                                  <p className="font-medium text-gray-800">{olympiad.subject || 'Не указан'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Возрастная группа</p>
                                  <p className="font-medium text-gray-800">{olympiad.age_group || 'Не указана'}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-sm text-gray-500">Описание</p>
                                  <p className="font-medium text-gray-800">{olympiad.description || 'Описание отсутствует'}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Дата создания</p>
                                  <p className="font-medium text-gray-800">{formatDateTime(olympiad.created_at)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">ID олимпиады</p>
                                  <p className="font-medium text-gray-800 font-mono text-sm">{olympiad.id}</p>
                                </div>
                                
                                {/* ========== ПРИЧИНА ОТКАЗА (только для отклонённых) ========== */}
                                {olympiad.status === 'rejected' && olympiad.rejection_reason && (
                                  <div className="md:col-span-2">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                      <div className="flex items-start gap-2">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                          <p className="text-sm font-semibold text-red-700 mb-1">Причина отклонения:</p>
                                          <p className="text-sm text-red-600 whitespace-pre-wrap">{olympiad.rejection_reason}</p>
                                          <p className="text-xs text-red-500 mt-2">
                                            Исправьте указанные ошибки и отправьте олимпиаду на повторную модерацию
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Заглушки для остальных разделов */}
              {activeMenuItem !== "dashboard" && activeMenuItem !== "olympiads" && (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <p className="text-gray-500">Раздел в разработке</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[100px] md:h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}