"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

//  КОМПОНЕНТ КНОПКИ ПРОФИЛЯ 
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

  const handleNavigation = (path) => {
    setIsOpen(false);
    router.push(path);
  };

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
              <div className="flex items-center gap-2">
                Личный кабинет
              </div>
            </button>
            <button onClick={() => handleNavigation('/profile/security')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                Безопасность
              </div>
            </button>
            <button onClick={() => handleNavigation('/profile/settings')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                Настройки
              </div>
            </button>
            <div className="border-t border-gray-100"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-2">
                Выйти
              </div>
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

//  КОМПОНЕНТ ВЕРХНЕЙ ПАНЕЛИ 
function Header() {
  return (
    <div className="w-full h-[278px] relative" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}>
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
        {/* Логотип слева */}
        <div>
          <Link href="/">
            <img src="/chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto cursor-pointer" />
          </Link>
        </div>
        {/* Кнопки навигации справа */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <Link href="/olympiads" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
            <span>Олимпиады</span>
            <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </Link>
          <Link href="/methodics" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
            <span>Методочки</span>
            <img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </Link>
          {/* Кнопка профиля (вход/личный кабинет) */}
          <ProfileButton />
        </div>
      </div>
      <div className='absolute bottom-4 left-0 right-0'>
        <p className='font-sans text-white text-5xl sm:text-6xl md:text-7xl font-bold p-4'>Безопасность</p>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const router = useRouter();
  const [loginHistory, setLoginHistory] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState(false);
  const [terminatingSessionId, setTerminatingSessionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  // Проверка авторизации
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    router.push('/');
    window.dispatchEvent(new Event('storage'));
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Загрузка истории входов с сервера
  const fetchLoginHistory = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/profile/login-history?page=${page}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Ошибка загрузки истории');
      
      const data = await response.json();
      setLoginHistory(data.data);
      setMeta(data.meta);
    } catch (err) {
      showToast('Ошибка загрузки истории входов', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Завершение конкретной сессии
  const handleTerminateSession = async (sessionId) => {
    if (!confirm('Вы уверены, что хотите завершить эту сессию?')) {
      return;
    }
    setTerminatingSessionId(sessionId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/profile/sessions/${sessionId}/terminate`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setLoginHistory(prev => prev.filter(item => item.id !== sessionId));
        showToast('Сессия успешно завершена', 'success');
      } else {
        throw new Error('Ошибка при завершении сессии');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setTerminatingSessionId(null);
    }
  };

  // Завершение всех сессий кроме текущей
  const handleTerminateOtherSessions = async () => {
    const otherSessionsCount = loginHistory.filter(item => !item.is_current).length;
    if (otherSessionsCount === 0) {
      showToast('Нет активных сессий для завершения', 'info');
      return;
    }
    if (!confirm(`Вы уверены? Будут завершены все ${otherSessionsCount} сессий на других устройствах.`)) {
      return;
    }
    setTerminating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/profile/terminate-other-sessions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setLoginHistory(prev => prev.filter(item => item.is_current));
        showToast(`Завершено ${otherSessionsCount} сессий на других устройствах`, 'success');
      } else {
        throw new Error('Ошибка при завершении сессий');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setTerminating(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory(currentPage);
  }, [currentPage]);

  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'desktop':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'mobile':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'tablet':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const otherSessionsCount = loginHistory.filter(item => !item.is_current).length;

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
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Безопасность аккаунта</h1>
              <p className="text-gray-500 text-sm mt-1">Контроль устройств и истории входов</p>
            </div>
            <button
              onClick={handleTerminateOtherSessions}
              disabled={terminating || otherSessionsCount === 0}
              className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
            >
              {terminating ? (
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Завершить все сессии кроме текущей
                </>
              )}
            </button>
          </div>
          
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">История входов</h2>
            
            {loading ? (
              <div className="text-center py-12 text-gray-500">Загрузка истории входов...</div>
            ) : loginHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">История входов пуста</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Дата и время</th>
                        <th className="text-left py-3 px-3 text-gray-500 font-medium">IP-адрес</th>
                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Устройство</th>
                        <th className="text-left py-3 px-3 text-gray-500 font-medium">Браузер</th>
                        <th className="text-left py-3 px-3 text-gray-500 font-medium"></th>
                        <th className="text-center py-3 px-3 text-gray-500 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.map((entry, idx) => (
                        <tr key={entry.id || idx} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 text-gray-700 whitespace-nowrap">
                            {formatDate(entry.logged_in_at)}
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-gray-600">
                            {entry.ip_address}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(entry.device_type)}
                              <span className="capitalize">{entry.device_type || '—'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-600">
                            {entry.user_agent?.split(/[\/ ]/)[0] || '—'}
                          </td>
                          <td className="py-3 px-3">
                            {entry.is_current && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Текущая
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {!entry.is_current && (
                              <button
                                onClick={() => handleTerminateSession(entry.id)}
                                disabled={terminatingSessionId === entry.id}
                                className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white rounded-lg p-1 px-3 transition flex items-center gap-1 text-xs"
                                title="Завершить сессию"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Завершить
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {meta && meta.last_page > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      ← Назад
                    </button>
                    <span className="px-4 py-1 text-gray-600">
                      {currentPage} / {meta.last_page}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(meta.last_page, p + 1))}
                      disabled={currentPage === meta.last_page}
                      className="px-3 py-1 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
                    >
                      Вперёд →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          
          <div className="border-t border-gray-200 px-6 py-4">
            <Link href="/profile" className="text-[#8E51FF] hover:text-[#312C85] transition text-sm inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Вернуться в личный кабинет
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full h-[209px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}