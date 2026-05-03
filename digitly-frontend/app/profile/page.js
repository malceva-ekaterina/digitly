"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { z } from "zod";

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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Личный кабинет
              </div>
            </button>
            <button onClick={() => handleNavigation('/profile/security')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Безопасность
              </div>
            </button>
            <button onClick={() => handleNavigation('/profile/settings')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Настройки
              </div>
            </button>
            <div className="border-t border-gray-100"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
        <p className='font-sans text-white text-5xl sm:text-6xl md:text-7xl font-bold p-4'>Личный кабинет</p>
      </div>
    </div>
  );
}

// Схема валидации для профиля (личные данные)
const profileValidationSchema = z.object({
  fullname: z.string()
    .min(2, 'ФИО должно содержать минимум 2 символа')
    .max(150, 'ФИО слишком длинное')
    .regex(/^[а-яА-ЯёЁa-zA-Z\s\-]+$/, 'ФИО может содержать только буквы, пробелы и дефис'),
  birth_date: z.string()
    .optional()
    .refine((val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val), 'Неверный формат даты. Используйте ГГГГ-ММ-ДД')
    .refine((val) => !val || new Date(val) < new Date(), 'Дата рождения не может быть в будущем'),
  study_place: z.string()
    .max(255, 'Место учёбы слишком длинное (максимум 255 символов)')
    .optional(),
  study_grade: z.string()
    .max(100, 'Класс/группа слишком длинная (максимум 100 символов)')
    .optional()
});

// Схема валидации для параметров входа
const loginValidationSchema = z.object({
  phone_number: z.string()
    .min(11, 'Номер телефона должен содержать минимум 11 цифр')
    .max(15, 'Номер телефона слишком длинный')
    .regex(/^[\d+\-\s]+$/, 'Телефон может содержать только цифры, + и -'),
  email: z.string()
    .email('Введите корректный email (пример: user@example.com)')
    .min(5, 'Email слишком короткий')
    .max(255, 'Email слишком длинный'),
  password: z.string()
    .optional()
    .refine((val) => !val || val.length >= 8, {
      message: 'Пароль должен быть минимум 8 символов'
    })
    .refine((val) => !val || /^(?=.*[A-Za-z])(?=.*\d)/.test(val), {
      message: 'Пароль должен содержать хотя бы одну букву и одну цифру'
    })
});



export default function Profile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);
  const [results, setResults] = useState([]);
  
  const [editForm, setEditForm] = useState({
    fullname: '',
    birth_date: '',
    study_place: '',
    study_grade: '',
    phone_number: '',
    email: '',
    password: ''
  });
  
  const [profileErrors, setProfileErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Проверка авторизации
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const validateProfileForm = () => {
    try {
      profileValidationSchema.parse(editForm);
      setProfileErrors({});
      return true;
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setProfileErrors(errors);
      return false;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/v1/profile', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки профиля');
        
        const data = await response.json();
        setProfileData(data);
        setEditForm({
          fullname: data.fullname || '',
          birth_date: data.birth_date?.split('T')[0] || '',
          study_place: data.study_place || '',
          study_grade: data.study_grade || '',
          phone_number: data.phone_number || '',
          email: data.email || '',
          password: ''
        });
      } catch (err) {
        showToast('Ошибка загрузки профиля', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/v1/profile/cards', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCards(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки карт:', err);
      }
    };
    fetchCards();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/v1/profile/payments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setPayments(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки платежей:', err);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await fetch('/api/v1/profile/results', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Ошибка загрузки результатов:', err);
      }
    };
    fetchResults();
  }, []);

  const handleSave = async () => {
    if (!validateProfileForm()) {
      const errorMessages = Object.values(profileErrors).join(', ');
      showToast(`Пожалуйста, исправьте ошибки: ${errorMessages}`, 'error');
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: editForm.fullname,
          birth_date: editForm.birth_date,
          study_place: editForm.study_place,
          study_grade: editForm.study_grade
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Ошибка сохранения');
      }
      
      setProfileData(data);
      setEditMode(false);
      showToast('Данные успешно сохранены', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditForm({
      fullname: profileData?.fullname || '',
      birth_date: profileData?.birth_date?.split('T')[0] || '',
      study_place: profileData?.study_place || '',
      study_grade: profileData?.study_grade || '',
      phone_number: profileData?.phone_number || '',
      email: profileData?.email || '',
      password: ''
    });
    setProfileErrors({});
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
    showToast('Вы вышли из системы', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Загрузка профиля...</div>
      </div>
    );
  }

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

      <div className="flex flex-col md:flex-row gap-8 p-8">
        
      <nav className='rounded-xl w-full md:w-[280px] bg-white p-4 shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] h-fit'>
        <button 
          onClick={() => setActiveTab("personal")}
          className={`w-full text-left p-3 rounded-xl font-sans transition-all ${
            activeTab === "personal" ? "bg-[#FFE4E6]" : "hover:bg-gray-100"
          }`}
        >
          Персональные данные
        </button>
        <button 
          onClick={() => setActiveTab("payments")}
          className={`w-full text-left p-3 rounded-xl font-sans transition-all mt-2 ${
            activeTab === "payments" ? "bg-[#FFE4E6]" : "hover:bg-gray-100"
          }`}
        >
          Платежи
        </button>
        <button 
          onClick={() => setActiveTab("results")}
          className={`w-full text-left p-3 rounded-xl font-sans transition-all mt-2 ${
            activeTab === "results" ? "bg-[#FFE4E6]" : "hover:bg-gray-100"
          }`}
        >
          Результаты
        </button>
        <button 
          onClick={() => router.push('/profile/institutions')}
          className="w-full text-left p-3 rounded-xl font-sans transition-all mt-2 hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            Мои организации
          </div>
        </button>
      </nav>

        <div className="flex-1">
          {activeTab === "personal" && (
            <PersonalDataTab 
              profileData={profileData}
              editMode={editMode}
              setEditMode={setEditMode}
              editForm={editForm}
              setEditForm={setEditForm}
              onSave={handleSave}
              onCancelEdit={handleCancelEdit}
              saving={saving}
              cards={cards}
              setCards={setCards}
              profileErrors={profileErrors}
              setProfileErrors={setProfileErrors}
            />
          )}
          {activeTab === "payments" && (
            <PaymentsTab 
              cards={cards}
              setCards={setCards}
              payments={payments}
            />
          )}
          {activeTab === "results" && (
            <ResultsTab results={results} />
          )}
        </div>
        
      </div>
      <div className="w-full h-[209px] mt-auto flex-shrink-0" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}

// Компонент загрузки аватара
function AvatarUpload({ avatarUrl, onAvatarChange, onAvatarDelete }) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(avatarUrl || null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      onAvatarChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить аватар?')) {
      setPreview(null);
      onAvatarDelete();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed transition-all ${
          dragActive ? 'border-[#8E51FF] bg-[#8E51FF]/10' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Аватар" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 mt-3">
        <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors">
          Выбрать файл
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
        {preview && (
          <button 
            onClick={handleDelete}
            className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Удалить
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">Перетащите изображение или нажмите для выбора</p>
    </div>
  );
}

// СТРАНИЦА "ПЕРСОНАЛЬНЫЕ ДАННЫЕ"
function PersonalDataTab({ profileData, editMode, setEditMode, editForm, setEditForm, onSave, onCancelEdit, saving, cards, setCards, profileErrors, setProfileErrors }) {
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", bank: "" });
  const [avatarPreview, setAvatarPreview] = useState(profileData?.avatar_url || null);
  
  const [editLoginMode, setEditLoginMode] = useState(false);
  const [loginForm, setLoginForm] = useState({
    phone_number: editForm.phone_number,
    email: editForm.email,
    password: ""
  });
  const [loginErrors, setLoginErrors] = useState({});
  
  const [fullnameError, setFullnameError] = useState('');

  const validateFullname = (value) => {
    if (!value || value.trim() === '') {
      setFullnameError('ФИО обязательно для заполнения');
      return false;
    }
    if (value.length < 2) {
      setFullnameError('ФИО должно содержать минимум 2 символа');
      return false;
    }
    if (value.length > 150) {
      setFullnameError('ФИО слишком длинное (максимум 150 символов)');
      return false;
    }
    if (!/^[а-яА-ЯёЁa-zA-Z\s\-]+$/.test(value)) {
      setFullnameError('ФИО может содержать только буквы, пробелы и дефис');
      return false;
    }
    setFullnameError('');
    return true;
  };

  const validateLoginForm = () => {
    try {
      const schema = z.object({
        phone_number: z.string()
          .min(11, 'Номер телефона должен содержать минимум 11 цифр')
          .max(15, 'Номер телефона слишком длинный')
          .regex(/^[\d+\-\s]+$/, 'Телефон может содержать только цифры, + и -'),
        email: z.string()
          .email('Введите корректный email (пример: user@example.com)')
          .min(5, 'Email слишком короткий')
          .max(255, 'Email слишком длинный'),
        password: z.string()
          .optional()
          .refine((val) => !val || val.length >= 8, {
            message: 'Пароль должен быть минимум 8 символов'
          })
          .refine((val) => !val || /^(?=.*[A-Za-z])(?=.*\d)/.test(val), {
            message: 'Пароль должен содержать хотя бы одну букву и одну цифру'
          })
      });
      schema.parse(loginForm);
      setLoginErrors({});
      return true;
    } catch (error) {
      const errors = {};
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      setLoginErrors(errors);
      return false;
    }
  };

  const handleFullnameChange = (e) => {
    const value = e.target.value;
    setEditForm({ ...editForm, fullname: value });
    validateFullname(value);
    if (profileErrors.fullname) {
      setProfileErrors({ ...profileErrors, fullname: "" });
    }
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    if (profileErrors[e.target.name]) {
      setProfileErrors({ ...profileErrors, [e.target.name]: "" });
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
    if (loginErrors[name]) {
      setLoginErrors({ ...loginErrors, [name]: "" });
    }
  };

  const handleSaveLogin = () => {
    if (!validateLoginForm()) {
      const errorMessages = Object.values(loginErrors).join(', ');
      alert(`Ошибки валидации: ${errorMessages}`);
      return;
    }
    
    setEditForm({ 
      ...editForm, 
      phone_number: loginForm.phone_number,
      email: loginForm.email
    });
    
    if (loginForm.password) {
      alert("Пароль изменён");
    }
    
    setEditLoginMode(false);
    setLoginErrors({});
  };

  const handleAvatarChange = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/profile/avatar', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setAvatarPreview(data.avatar_url);
        alert("Аватар обновлён");
      } else {
        alert("Ошибка загрузки аватара");
      }
    } catch (error) {
      alert("Ошибка соединения");
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/profile/avatar', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setAvatarPreview(null);
        alert("Аватар удалён");
      } else {
        alert("Ошибка удаления");
      }
    } catch (error) {
      alert("Ошибка соединения");
    }
  };

  const handleAddCard = () => {
    if (!newCard.number.trim()) {
      alert("Введите номер карты");
      return;
    }
    if (!newCard.bank.trim()) {
      alert("Введите название банка");
      return;
    }
    if (newCard.number.replace(/\s/g, '').length !== 16) {
      alert("Номер карты должен содержать 16 цифр");
      return;
    }
    setCards([...cards, { id: Date.now(), number: newCard.number, bank: newCard.bank }]);
    setNewCard({ number: "", bank: "" });
    setShowCardForm(false);
  };

  const handleDeleteCard = (id) => {
    if (confirm('Удалить эту карту?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const nameParts = editForm.fullname?.split(' ') || [];
  const lastName = nameParts[0] || '—';
  const firstName = nameParts[1] || '—';
  const middleName = nameParts[2] || '—';
  
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Не указано';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return `${age} лет`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      <div className="flex-1 flex flex-col gap-6">
        
        <div className="bg-white rounded-xl shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] p-6">
          
          <AvatarUpload 
            avatarUrl={avatarPreview}
            onAvatarChange={handleAvatarChange}
            onAvatarDelete={handleAvatarDelete}
          />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Личные данные</h2>
            {!editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="text-sm text-[#8E51FF] hover:underline"
              >
                Редактировать
              </button>
            )}
          </div>

          {editMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Имя</label>
                  <input name="first_name" value={firstName} onChange={(e) => {
                    setEditForm({ ...editForm, fullname: `${lastName} ${e.target.value} ${middleName}`.trim() });
                    validateFullname(`${lastName} ${e.target.value} ${middleName}`.trim());
                  }} className="w-full border rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Дата рождения</label>
                  <input type="date" name="birth_date" value={editForm.birth_date} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" />
                  {profileErrors.birth_date && <p className="text-red-500 text-xs mt-1">{profileErrors.birth_date}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Фамилия</label>
                  <input name="last_name" value={lastName} onChange={(e) => {
                    setEditForm({ ...editForm, fullname: `${e.target.value} ${firstName} ${middleName}`.trim() });
                    validateFullname(`${e.target.value} ${firstName} ${middleName}`.trim());
                  }} className="w-full border rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Возраст</label>
                  <input value={calculateAge(editForm.birth_date)} disabled className="w-full bg-gray-100 border rounded-lg p-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Отчество</label>
                  <input name="middle_name" value={middleName} onChange={(e) => {
                    setEditForm({ ...editForm, fullname: `${lastName} ${firstName} ${e.target.value}`.trim() });
                    validateFullname(`${lastName} ${firstName} ${e.target.value}`.trim());
                  }} className="w-full border rounded-lg p-2 text-sm" />
                </div>
              </div>
              {fullnameError && <p className="text-red-500 text-xs mt-1">{fullnameError}</p>}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Место учёбы/работы</label>
                <input name="study_place" value={editForm.study_place} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" />
                {profileErrors.study_place && <p className="text-red-500 text-xs mt-1">{profileErrors.study_place}</p>}
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Класс/группа</label>
                <input name="study_grade" value={editForm.study_grade} onChange={handleChange} className="w-full border rounded-lg p-2 text-sm" />
                {profileErrors.study_grade && <p className="text-red-500 text-xs mt-1">{profileErrors.study_grade}</p>}
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={onSave} disabled={saving || !!fullnameError} className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button onClick={onCancelEdit} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <p className="text-xs text-gray-400">Имя</p>
              <p className="text-sm font-medium">{firstName}</p>
              <p className="text-xs text-gray-400">Дата рождения</p>
              <p className="text-sm font-medium">{editForm.birth_date ? new Date(editForm.birth_date).toLocaleDateString('ru-RU') : 'Не указано'}</p>
              <p className="text-xs text-gray-400">Фамилия</p>
              <p className="text-sm font-medium">{lastName}</p>
              <p className="text-xs text-gray-400">Отчество</p>
              <p className="text-sm font-medium">{middleName}</p>
              <p className="text-xs text-gray-400">Возраст</p>
              <p className="text-sm font-medium">{calculateAge(editForm.birth_date)}</p>
              <p className="text-xs text-gray-400">Место учёбы/работы</p>
              <p className="text-sm font-medium col-span-1">{editForm.study_place || 'Не указано'}</p>
              <p className="text-xs text-gray-400">Класс/группа</p>
              <p className="text-sm font-medium col-span-1">{editForm.study_grade || 'Не указано'}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Параметры для входа</h2>
            {!editLoginMode && (
              <button 
                onClick={() => {
                  setLoginForm({
                    phone_number: editForm.phone_number,
                    email: editForm.email,
                    password: ""
                  });
                  setEditLoginMode(true);
                  setLoginErrors({});
                }}
                className="text-sm text-[#8E51FF] hover:underline"
              >
                Редактировать
              </button>
            )}
          </div>

          {editLoginMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Номер телефона <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(минимум 11 цифр)</span>
                </label>
                <input 
                  type="text" 
                  name="phone_number" 
                  value={loginForm.phone_number || ''} 
                  onChange={handleLoginChange} 
                  placeholder="+7 (999) 123-45-67"
                  className={`w-full border-2 rounded-xl px-4 py-2 outline-none ${
                    loginErrors.phone_number ? 'border-red-500' : 'border-gray-200'
                  } focus:border-[#8E51FF]`}
                  style={{ height: '40px' }}
                />
                {loginErrors.phone_number && <p className="text-red-500 text-xs mt-1">{loginErrors.phone_number}</p>}
                <p className="text-gray-400 text-xs mt-1">Пример: +7 999 123-45-67 или 89991234567</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Почта <span className="text-red-500">*</span>
                  <span className="text-gray-400 text-xs ml-2">(пример: user@example.com)</span>
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={loginForm.email || ''} 
                  onChange={handleLoginChange} 
                  placeholder="your@email.com"
                  className={`w-full border-2 rounded-xl px-4 py-2 outline-none ${
                    loginErrors.email ? 'border-red-500' : 'border-gray-200'
                  } focus:border-[#8E51FF]`}
                  style={{ height: '40px' }}
                />
                {loginErrors.email && <p className="text-red-500 text-xs mt-1">{loginErrors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Новый пароль 
                  <span className="text-gray-400 text-xs ml-2">(оставьте пустым, если не хотите менять)</span>
                </label>
                <input 
                  type="password" 
                  name="password" 
                  value={loginForm.password} 
                  onChange={handleLoginChange} 
                  placeholder="Минимум 8 символов, буквы и цифры"
                  className={`w-full border-2 rounded-xl px-4 py-2 outline-none ${
                    loginErrors.password ? 'border-red-500' : 'border-gray-200'
                  } focus:border-[#8E51FF]`}
                  style={{ height: '40px' }}
                />
                {loginErrors.password && <p className="text-red-500 text-xs mt-1">{loginErrors.password}</p>}
                {!loginErrors.password && loginForm.password && loginForm.password.length > 0 && loginForm.password.length < 8 && (
                  <p className="text-yellow-500 text-xs mt-1"> Пароль слишком короткий (нужно минимум 8 символов)</p>
                )}
                {!loginErrors.password && loginForm.password && loginForm.password.length >= 8 && !/(?=.*[A-Za-z])(?=.*\d)/.test(loginForm.password) && (
                  <p className="text-yellow-500 text-xs mt-1"> Пароль должен содержать хотя бы одну букву и одну цифру</p>
                )}
              </div>
              
              <div className="flex gap-2 pt-2">
                <button onClick={handleSaveLogin} className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm">
                  Сохранить
                </button>
                <button onClick={() => setEditLoginMode(false)} className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <p className="text-xs text-gray-400">Номер телефона</p>
              <p className="text-sm font-medium">{editForm.phone_number || 'Не указан'}</p>
              <p className="text-xs text-gray-400">Пароль</p>
              <p className="text-sm font-medium">**********</p>
              <p className="text-xs text-gray-400">Почта</p>
              <p className="text-sm font-medium">{editForm.email || 'Не указана'}</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[400px]">
        <div className="bg-white rounded-xl shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Банковские карты</h2>
          <div className="space-y-3">
            {cards.map((card) => (
              <div key={card.id} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium tracking-wider">{card.number}</p>
                  <p className="text-xs text-gray-500">{card.bank}</p>
                </div>
                <button 
                  onClick={() => handleDeleteCard(card.id)}
                  className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white rounded-lg p-1 px-3 transition flex items-center gap-1 text-xs"
                  title="Удалить карту"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Удалить
                </button>
              </div>
            ))}
            
            {!showCardForm && (
              <Link 
                href="/profile/bankcard"
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 text-gray-500 hover:border-[#8E51FF] hover:text-[#8E51FF] transition-colors text-sm text-center block"
              >
                + Привязать карту
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// СТРАНИЦА "ПЛАТЕЖИ"
function PaymentsTab({ cards, setCards, payments }) {
  const [showCardForm, setShowCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", bank: "" });

  const handleAddCard = () => {
    if (!newCard.number.trim()) {
      alert("Введите номер карты");
      return;
    }
    if (!newCard.bank.trim()) {
      alert("Введите название банка");
      return;
    }
    if (newCard.number.replace(/\s/g, '').length !== 16) {
      alert("Номер карты должен содержать 16 цифр");
      return;
    }
    setCards([...cards, { id: Date.now(), number: newCard.number, bank: newCard.bank }]);
    setNewCard({ number: "", bank: "" });
    setShowCardForm(false);
  };

  const handleDeleteCard = (id) => {
    if (confirm('Удалить эту карту?')) {
      setCards(cards.filter(card => card.id !== id));
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'оплачено':
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'ошибка при оплате':
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'в обработке':
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'Оплачено';
      case 'failed':
        return 'Ошибка при оплате';
      case 'pending':
        return 'В обработке';
      default:
        return status || '—';
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      
      <div className="w-full xl:w-[400px]">
        <div className="bg-white rounded-xl shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Банковские карты</h2>
          <div className="space-y-3">
            {cards.length === 0 ? (
              <p className="text-gray-500 text-center py-4">У вас пока нет привязанных карт</p>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="border rounded-lg p-3 flex justify-between items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium tracking-wider break-words">{card.number}</p>
                    <p className="text-xs text-gray-500">{card.bank}</p>
                  </div>
                  <button 
                    onClick={() => handleDeleteCard(card.id)}
                    className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white rounded-lg p-1 px-3 transition flex items-center gap-1 text-xs"
                    title="Удалить карту"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Удалить
                  </button>
                </div>
              ))
            )}
            
            {!showCardForm && (
              <button 
                onClick={() => setShowCardForm(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-3 text-gray-500 hover:border-[#8E51FF] hover:text-[#8E51FF] transition-colors text-sm"
              >
                + Привязать карту
              </button>
            )}

            {showCardForm && (
              <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
                <input 
                  type="text" 
                  placeholder="Номер карты (16 цифр)"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                  maxLength="19"
                />
                <input 
                  type="text" 
                  placeholder="Банк (МИР, Visa, Mastercard)"
                  value={newCard.bank}
                  onChange={(e) => setNewCard({ ...newCard, bank: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm"
                />
                <div className="flex gap-2">
                  <button 
                    onClick={handleAddCard}
                    className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    Добавить
                  </button>
                  <button 
                    onClick={() => setShowCardForm(false)}
                    className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 text-sm"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">История платежей</h2>
          
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">У вас пока нет платежей</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <span className="text-gray-500 text-xs">Номер</span>
                      <p className="font-medium text-sm sm:text-base">{payment.id || payment.order_id || '—'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 text-xs">Сумма</span>
                      <p className="font-medium text-sm sm:text-base">{payment.amount} ₽</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-xs">Купленные элементы</span>
                    <p className="font-medium text-sm sm:text-base break-words">{payment.item || payment.description || '—'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">Статус</span>
                    <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${getStatusClass(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// СТРАНИЦА "РЕЗУЛЬТАТЫ"
function ResultsTab({ results }) {
  const getMedalColor = (medal) => {
    switch (medal?.toLowerCase()) {
      case 'золото':
      case 'gold':
        return 'text-yellow-500';
      case 'серебро':
      case 'silver':
        return 'text-gray-400';
      case 'бронза':
      case 'bronze':
        return 'text-amber-600';
      default:
        return 'text-gray-500';
    }
  };

  const getMedalText = (medal) => {
    switch (medal?.toLowerCase()) {
      case 'gold':
        return 'Золото';
      case 'silver':
        return 'Серебро';
      case 'bronze':
        return 'Бронза';
      default:
        return medal || '—';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0px_0px_25px_10px_rgba(0,0,0,0.1)] p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Результаты олимпиад</h2>
      
      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-8">У вас пока нет результатов олимпиад</p>
      ) : (
        <div className="space-y-3">
          {results.map((result, idx) => (
            <div key={idx} className="border rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start gap-3 hover:shadow-md transition-shadow">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 text-sm sm:text-base break-words">
                  {result.title || result.olympiad_name || '—'}
                </h3>
                <p className="text-sm text-gray-500 mt-2">Баллы: {result.score || result.points || '—'}</p>
                <button className="text-sm text-[#8E51FF] hover:underline mt-2">
                  Посмотреть ответы
                </button>
              </div>
              <div className="flex justify-start w-full sm:w-auto sm:justify-end">
                <div className={`text-xl sm:text-2xl font-bold ${getMedalColor(result.medal)} whitespace-nowrap`}>
                  {getMedalText(result.medal)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}