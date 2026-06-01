"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
function Header({ institutionName }) {
  return (
    <div className="w-full h-[278px] relative" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}>
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
        <p className='font-sans text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold p-4'>
          {institutionName || 'Управление командой'}
        </p>
      </div>
    </div>
  );
}

//  МОКОВЫЕ ДАННЫЕ ДЛЯ ТЕСТИРОВАНИЯ 
const MOCK_MEMBERS = [
  { user_id: 1, fullname: "Иванов Иван Иванович", email: "ivan@mail.ru", role: "admin", joined_at: "2025-01-15T10:30:00.000Z" },
  { user_id: 2, fullname: "Петрова Анна Сергеевна", email: "anna@mail.ru", role: "methodist", joined_at: "2025-02-20T14:45:00.000Z" },
  { user_id: 3, fullname: "Сидоров Петр Алексеевич", email: "petr@mail.ru", role: "methodist", joined_at: "2025-03-01T09:15:00.000Z" },
];

export default function InstitutionTeamPage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id;
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [institutionName, setInstitutionName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('methodist');
  const [emailError, setEmailError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('team'); 
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [institutionId]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/institutions/${institutionId}/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data.data || []);
        if (data.institution_name) setInstitutionName(data.institution_name);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        setMembers(MOCK_MEMBERS);
        setInstitutionName("»");
      }
    } catch (err) {
      console.error('Ошибка загрузки команды:', err);
      setMembers(MOCK_MEMBERS);
      setInstitutionName("ГАПОУ СО «Нижнетагильский торгово-экономический колледж»");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setEmailError('Введите email пользователя');
      return;
    }
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/institutions/${institutionId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newMemberEmail,
          role: newMemberRole,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast(`Пользователь успешно добавлен как ${newMemberRole === 'admin' ? 'администратор' : 'методист'}`, 'success');
        setIsModalOpen(false);
        setNewMemberEmail('');
        setEmailError('');
        fetchTeamMembers();
      } else {
        setEmailError(data.message || 'Ошибка при добавлении пользователя');
      }
    } catch (err) {
      setEmailError('Ошибка соединения с сервером');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/institutions/${institutionId}/members/${selectedMember.user_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        showToast('Пользователь удалён из команды', 'success');
        setIsDeleteModalOpen(false);
        setSelectedMember(null);
        fetchTeamMembers();
      } else {
        const data = await response.json();
        showToast(data.message || 'Ошибка при удалении', 'error');
      }
    } catch (err) {
      showToast('Ошибка соединения с сервером', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (member, newRole) => {
    if (member.role === newRole) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/institutions/${institutionId}/members/${member.user_id}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (response.ok) {
        showToast(`Роль изменена на ${newRole === 'admin' ? 'администратора' : 'методиста'}`, 'success');
        fetchTeamMembers();
      } else {
        const data = await response.json();
        showToast(data.message || 'Ошибка при изменении роли', 'error');
      }
    } catch (err) {
      showToast('Ошибка соединения с сервером', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Администратор</span>;
      case 'methodist':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Методист</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{role}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white animate-in slide-in-from-right-5`}>
          {toast.message}
        </div>
      )}
      
      <Header institutionName={institutionName} />
      
      <div className="flex-1 bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* КОНТЕНТ */}
          <div className="flex flex-col md:flex-row gap-8">
            
            
            {/* Основной контент */}
            <div className="flex-1">
              <div>
                <button
                    onClick={() => router.back()}
                    className="text-[#8E51FF] hover:underline inline-flex items-center gap-1 text-sm pt-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                   Назад к организации
                </button>
              </div>
              
              {/* Контент вкладки "Команда" */}
              {activeTab === "team" && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Управление командой</h2>
                      <p className="text-gray-500 text-sm mt-1">Добавление и управление сотрудниками организации</p>
                    </div>
                    
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Добавить члена команды
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="text-center py-12">
                        <svg className="w-10 h-10 animate-spin text-[#8E51FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <p className="text-gray-500">Загрузка...</p>
                      </div>
                    ) : members.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500">В команде пока нет сотрудников</p>
                      </div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">ФИО</th>
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Роль</th>
                            <th className="text-left py-3 px-4 text-gray-500 font-medium">Дата добавления</th>
                            <th className="text-center py-3 px-4 text-gray-500 font-medium">Действия</th>
                          </tr>
                        </thead>
                        <tbody>
                          {members.map((member) => (
                            <tr key={member.user_id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 font-medium text-gray-800">{member.fullname}</td>
                              <td className="py-3 px-4 text-gray-600">{member.email}</td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {getRoleBadge(member.role)}
                                  <select
                                    value={member.role}
                                    onChange={(e) => handleRoleChange(member, e.target.value)}
                                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white focus:border-[#8E51FF] outline-none"
                                    disabled={submitting}
                                  >
                                    <option value="admin">Администратор</option>
                                    <option value="methodist">Методист</option>
                                  </select>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-gray-500">{formatDate(member.joined_at)}</td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  title="Удалить"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>

      {/* Модальное окно добавления члена команды */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Добавить члена команды</h3>
            <p className="text-gray-500 text-sm mb-4">Введите email пользователя, который уже зарегистрирован на платформе</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => {
                  setNewMemberEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="user@example.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-[#8E51FF]"
              />
              {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 outline-none focus:border-[#8E51FF]"
              >
                <option value="methodist">Методист</option>
                <option value="admin">Администратор</option>
              </select>
              <p className="text-gray-400 text-xs mt-1">
                Администраторы могут управлять командой, методисты — создавать олимпиады
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewMemberEmail('');
                  setEmailError('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleAddMember}
                disabled={submitting}
                className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Добавление...' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {isDeleteModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-red-800 mb-2">Удаление пользователя</h3>
            <p className="text-gray-600 mb-4">
              Вы уверены, что хотите удалить пользователя <strong>{selectedMember.fullname}</strong> из команды?
              {selectedMember.role === 'admin' && members.filter(m => m.role === 'admin').length === 1 && (
                <span className="text-red-600 block mt-2">Это последний администратор. Вы не сможете удалить его.</span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedMember(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteMember}
                disabled={submitting || (selectedMember.role === 'admin' && members.filter(m => m.role === 'admin').length === 1)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {submitting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}