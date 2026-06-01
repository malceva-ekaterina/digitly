"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";



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
              <div className="flex items-center gap-2">Личный кабинет</div>
            </button>
            <button onClick={() => handleNavigation('/profile/security')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">Безопасность</div>
            </button>
            <button onClick={() => handleNavigation('/profile/settings')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2">Настройки</div>
            </button>
            <div className="border-t border-gray-100"></div>
            <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <div className="flex items-center gap-2">Выйти</div>
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

// КОМПОНЕНТ ШАПКИ 
function Header() {
  return (
    <div className="w-full h-[278px] relative" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}>
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
        <div><Link href="/"><img src="/chifra/logo_chifra.png" alt="Цифра" className="hidden sm:block w-12 sm:w-16 md:w-20 lg:w-24 h-auto cursor-pointer" /></Link></div>
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          <Link href="/olympiads" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
            <span>Олимпиады</span><img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </Link>
          <Link href="/methodics" className="bg-white rounded-xl flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 font-sans font-medium shadow-sm whitespace-nowrap text-[13px] sm:text-sm md:text-base lg:text-[15px] px-3 sm:px-4 md:px-4 lg:px-5 py-1.5 sm:py-1.5 md:py-2 lg:py-1.5 hover:bg-gray-50 transition-colors">
            <span>Методочки</span><img src="/chifra/arrow.png" alt="стрелка" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-4 lg:h-4" />
          </Link>
          <ProfileButton />
        </div>
      </div>
      <div className='absolute bottom-4 left-0 right-0'>
        <p className='font-sans text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold p-4'>Регистрация ОО</p>
      </div>
    </div>
  );
}

// Валидация ИНН (10 или 12 цифр + контрольная сумма)
const validateINNFormat = (inn) => {
  const innStr = String(inn).trim();
  if (!/^\d+$/.test(innStr)) return 'ИНН должен содержать только цифры';
  if (innStr.length !== 10 && innStr.length !== 12) return 'ИНН должен содержать 10 или 12 цифр';
  
  if (innStr.length === 10) {
    const coefficients = [2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(innStr[i]) * coefficients[i];
    const control = sum % 11 % 10;
    if (control !== parseInt(innStr[9])) return 'Неверный ИНН (не совпадает контрольная сумма)';
    return null;
  }
  
  if (innStr.length === 12) {
    const coefficients1 = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    const coefficients2 = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8];
    let sum1 = 0, sum2 = 0;
    for (let i = 0; i < 10; i++) {
      sum1 += parseInt(innStr[i]) * coefficients1[i];
      sum2 += parseInt(innStr[i]) * coefficients2[i];
    }
    const control1 = sum1 % 11 % 10;
    const control2 = sum2 % 11 % 10;
    if (control1 !== parseInt(innStr[10]) || control2 !== parseInt(innStr[11])) {
      return 'Неверный ИНН (не совпадает контрольная сумма)';
    }
    return null;
  }
  return null;
};

export default function InstitutionApplyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    inn: '',
    website: 'https://',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  //ВАЛИДАЦИЯ ИНН 
  const [innChecking, setInnChecking] = useState(false);
  const [innAvailable, setInnAvailable] = useState(null);
  const [existingInstitution, setExistingInstitution] = useState(null);
  let debounceTimer = null;

  const checkINN = async (inn) => {
    if (!inn || inn.length < 10) {
      setInnAvailable(null);
      setExistingInstitution(null);
      return;
    }
    
    // проверяем формат ИНН
    const formatError = validateINNFormat(inn);
    if (formatError) {
      setInnAvailable(false);
      setExistingInstitution(null);
      return;
    }
    
    setInnChecking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/institutions/check-inn?inn=${inn}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.available) {
        setInnAvailable(true);
        setExistingInstitution(null);
      } else {
        setInnAvailable(false);
        setExistingInstitution(data.institution);
      }
    } catch (err) {
      console.error('Ошибка проверки ИНН:', err);
      setInnAvailable(null);
    } finally {
      setInnChecking(false);
    }
  };

  const handleInnChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, inn: value }));
    if (errors.inn) setErrors(prev => ({ ...prev, inn: '' }));
    
    // Debounce 500ms
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      checkINN(value);
    }, 500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, file: 'Можно загрузить только PDF, JPG или PNG' }));
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: 'Файл не должен превышать 10MB' }));
        return;
      }
      setFile(selectedFile);
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Введите название организации';
    
    if (!formData.inn.trim()) newErrors.inn = 'Введите ИНН';
    else {
      const formatError = validateINNFormat(formData.inn);
      if (formatError) newErrors.inn = formatError;
      else if (innAvailable === false) newErrors.inn = 'Этот ИНН уже зарегистрирован';
    }
    
    if (!formData.website.trim()) newErrors.website = 'Введите сайт организации';
    else if (!/^https?:\/\//.test(formData.website)) newErrors.website = 'Сайт должен начинаться с http:// или https://';
    if (!file) newErrors.file = 'Загрузите скан заявления от директора';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('inn', formData.inn);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('application_scan', file);
      
      const response = await fetch('/api/v1/institutions/apply', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        showToast('Заявка успешно отправлена на модерацию', 'success');
      } else {
        throw new Error(data.message || 'Ошибка при отправке заявки');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Заявка на рассмотрении</h2>
            <p className="text-gray-600 mb-6">
              Ваша заявка на регистрацию образовательной организации отправлена на модерацию.
              Мы уведомим вас о решении по электронной почте и в личном кабинете.
            </p>
            <Link href="/profile" className="inline-block bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white px-6 py-2.5 rounded-lg">
              Вернуться в профиль
            </Link>
          </div>
        </div>
        <div className="w-full h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
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
      
      <div className="flex-1 bg-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">Регистрация образовательной организации</h1>
            <p className="text-gray-500 text-sm mt-1">Заполните форму для регистрации вашей организации</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Полное наименование ОО <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ГАПОУ СО «Нижнетагильский торгово-экономический колледж»"
                className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            {/*ПОЛЕ ИНН С REAL-TIME ВАЛИДАЦИЕЙ*/}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ИНН <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="inn"
                  value={formData.inn}
                  onChange={handleInnChange}
                  placeholder="1234567890 (10 или 12 цифр)"
                  className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all pr-10 ${
                    errors.inn ? 'border-red-500' : 
                    innAvailable === true ? 'border-green-500' : 
                    innAvailable === false ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                  }`}
                  maxLength="12"
                />
                {/* Индикатор загрузки */}
                {innChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                )}
                {/* Иконка успеха */}
                {innAvailable === true && !innChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {/* Иконка ошибки */}
                {innAvailable === false && !innChecking && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
              
              {errors.inn && <p className="text-red-500 text-sm mt-1">{errors.inn}</p>}
              
              {/* Сообщение о занятом ИНН с предложением подать заявку на вступление */}
              {innAvailable === false && existingInstitution && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-300">
                  <p className="text-yellow-800 text-sm">
                    ОО с таким ИНН уже зарегистрирована: <strong>{existingInstitution.name}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/institutions/join')}
                    className="mt-2 text-[#8E51FF] hover:underline text-sm font-medium inline-flex items-center gap-1"
                  >
                    Подать заявку на вступление как методист
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
              
              <p className="text-gray-400 text-xs mt-1">ИНН должен содержать 10 или 12 цифр</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сайт организации <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.ru"
                className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
                  errors.website ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                }`}
              />
              {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Скан заявления от директора <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 text-center ${
                errors.file ? 'border-red-500' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600">{file ? file.name : 'Нажмите для выбора файла'}</p>
                  <p className="text-gray-400 text-sm mt-1">PDF, JPG, PNG до 10MB</p>
                </label>
              </div>
              {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading || innAvailable === false}
              className="w-full bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white py-3 rounded-xl font-medium text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Отправка...' : 'Отправить заявку'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 py-3 rounded-xl font-medium text-lg transition-all mt-2"
            >
              ← Назад
            </button>
          </form>
        </div>
      </div>
      
      <div className="w-full h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}