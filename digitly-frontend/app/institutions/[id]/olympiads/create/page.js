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
          {institutionName || 'Создание олимпиады'}
        </p>
      </div>
    </div>
  );
}

// ========== МОКОВЫЕ ДАННЫЕ ДЛЯ СПРАВОЧНИКОВ ==========
const MOCK_SUBJECTS = [
  { id: 1, name: "Математика" },
  { id: 2, name: "Русский язык" },
  { id: 3, name: "Информатика" },
  { id: 4, name: "Физика" },
  { id: 5, name: "Химия" },
  { id: 6, name: "Биология" },
  { id: 7, name: "История" },
  { id: 8, name: "Обществознание" },
  { id: 9, name: "Английский язык" },
  { id: 10, name: "Литература" },
];

const MOCK_AGE_GROUPS = [
  { id: 1, name: "1-4 классы (7-10 лет)" },
  { id: 2, name: "5-9 классы (11-15 лет)" },
  { id: 3, name: "10-11 классы (16-18 лет)" },
  { id: 4, name: "Студенты (18-25 лет)" },
  { id: 5, name: "Без ограничений" },
];

export default function CreateOlympiadPage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id;
  
  const [loading, setLoading] = useState(false);
  const [institutionName, setInstitutionName] = useState('');
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [ageGroups, setAgeGroups] = useState(MOCK_AGE_GROUPS);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'permanent',
    subject_id: '',
    age_group_id: '',
    price_minor: 0,
  });
  
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    fetchSubjects();
    fetchAgeGroups();
    fetchInstitution();
  }, [institutionId]);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/subjects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки предметов:', err);
    }
  };

  const fetchAgeGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/age-groups', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAgeGroups(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки возрастных групп:', err);
    }
  };

  const fetchInstitution = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/institutions/${institutionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInstitutionName(data.name);
      }
    } catch (err) {
      console.error('Ошибка загрузки организации:', err);
      setInstitutionName("Образовательная организация");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, price_minor: value >= 0 ? value : 0 }));
    if (errors.price_minor) setErrors(prev => ({ ...prev, price_minor: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Введите название олимпиады';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Название не должно превышать 255 символов';
    }
    
    if (formData.description && formData.description.length > 5000) {
      newErrors.description = 'Описание не должно превышать 5000 символов';
    }
    
    if (!formData.subject_id) {
      newErrors.subject_id = 'Выберите предмет';
    }
    
    if (!formData.age_group_id) {
      newErrors.age_group_id = 'Выберите возрастную группу';
    }
    
    if (formData.price_minor < 0) {
      newErrors.price_minor = 'Цена не может быть отрицательной';
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // ТЕСТОВЫЙ РЕЖИМ
      if (isTestMode) {
        const testId = Date.now();
        const testOlympiad = {
          id: testId,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          subject_id: parseInt(formData.subject_id),
          age_group_id: parseInt(formData.age_group_id),
          price_minor: formData.price_minor,
          status: 'draft',
          created_at: new Date().toISOString()
        };
        
        // Сохраняем в localStorage для тестового режима
        const existingOlympiads = JSON.parse(localStorage.getItem('test_olympiads') || '[]');
        existingOlympiads.push(testOlympiad);
        localStorage.setItem('test_olympiads', JSON.stringify(existingOlympiads));
        
        showToast('Черновик олимпиады создан (тестовый режим)', 'success');
        
        // ⭐ НОВАЯ ЛОГИКА: постоянная олимпиада → на страницу вопросов
        //                временная олимпиада → на страницу расписания
        setTimeout(() => {
          if (formData.type === 'scheduled') {
            router.push(`/institutions/${institutionId}/olympiads/${testId}/schedule?mock=true`);
          } else {
            // Для постоянной олимпиады перенаправляем на страницу вопросов
            router.push(`/institutions/${institutionId}/olympiads/${testId}/questions?mock=true`);
          }
        }, 1000);
        setLoading(false);
        return;
      }
      
      // РЕАЛЬНЫЙ API
      const token = localStorage.getItem('token');
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        subject_id: parseInt(formData.subject_id),
        age_group_id: parseInt(formData.age_group_id),
        price_minor: formData.price_minor,
      };
      
      const response = await fetch(`/api/v1/institutions/${institutionId}/olympiads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast('Черновик олимпиады создан', 'success');
        
        // ⭐ НОВАЯ ЛОГИКА: постоянная олимпиада → на страницу вопросов
        //                временная олимпиада → на страницу расписания
        setTimeout(() => {
          if (formData.type === 'scheduled') {
            router.push(`/institutions/${institutionId}/olympiads/${data.id}/schedule`);
          } else {
            // Для постоянной олимпиады перенаправляем на страницу вопросов
            router.push(`/institutions/${institutionId}/olympiads/${data.id}/questions`);
          }
        }, 1000);
      } else {
        throw new Error(data.message || 'Ошибка при создании олимпиады');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
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
        <div className="max-w-3xl mx-auto">
          
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="text-[#8E51FF] hover:underline inline-flex items-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад к олимпиадам
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">Создание олимпиады</h1>
              <p className="text-gray-500 text-sm mt-1">Заполните основные настройки олимпиады</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название олимпиады <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Введите название олимпиады"
                  className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
                    errors.title ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                <p className="text-gray-400 text-xs mt-1">Максимум 255 символов</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Опишите олимпиаду, правила участия, формат проведения..."
                  rows={6}
                  className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all resize-y ${
                    errors.description ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  {formData.description.length}/5000 символов
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип олимпиады
                </label>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="permanent"
                      checked={formData.type === 'permanent'}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8E51FF] focus:ring-[#8E51FF]"
                    />
                    <span className="text-sm text-gray-700">Постоянная</span>
                    <span className="text-xs text-gray-400">(доступна всегда)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="scheduled"
                      checked={formData.type === 'scheduled'}
                      onChange={handleChange}
                      className="w-4 h-4 text-[#8E51FF] focus:ring-[#8E51FF]"
                    />
                    <span className="text-sm text-gray-700">Временная</span>
                    <span className="text-xs text-gray-400">(ограниченные даты)</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Предмет <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
                      errors.subject_id ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                    }`}
                  >
                    <option value="">Выберите предмет</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                  {errors.subject_id && <p className="text-red-500 text-sm mt-1">{errors.subject_id}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Возрастная группа <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="age_group_id"
                    value={formData.age_group_id}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
                      errors.age_group_id ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                    }`}
                  >
                    <option value="">Выберите возрастную группу</option>
                    {ageGroups.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                  {errors.age_group_id && <p className="text-red-500 text-sm mt-1">{errors.age_group_id}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Цена участия <span className="text-gray-400 text-xs">(₽)</span>
                </label>
                <input
                  type="number"
                  name="price_minor"
                  value={formData.price_minor}
                  onChange={handlePriceChange}
                  min="0"
                  step="1"
                  className={`w-full max-w-[200px] px-4 py-2 border-2 rounded-xl outline-none transition-all ${
                    errors.price_minor ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                  }`}
                />
                {errors.price_minor && <p className="text-red-500 text-sm mt-1">{errors.price_minor}</p>}
                <p className="text-gray-400 text-xs mt-1">
                  0 ₽ — бесплатная олимпиада. После создания цену нельзя изменить.
                </p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  Создать черновик
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