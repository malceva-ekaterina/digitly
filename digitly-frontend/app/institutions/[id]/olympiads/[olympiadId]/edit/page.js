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
function Header({ olympiadTitle, status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'pending_moderation': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'draft': return 'Черновик';
      case 'pending_moderation': return 'На модерации';
      case 'approved': return 'Одобрена';
      case 'rejected': return 'Отклонена';
      default: return status || 'Черновик';
    }
  };

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
          Редактирование: {olympiadTitle || 'Олимпиада'}
        </p>
        {status && (
          <div className="absolute bottom-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ========== КОМПОНЕНТ ДАТАПИКЕРА ==========
function DateTimePicker({ label, value, onChange, minDate, maxDate, error, required, disabled }) {
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
        disabled={disabled}
        className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        } ${
          error ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

// ========== ТИПЫ ВОПРОСОВ ==========
const QUESTION_TYPES = [
  { id: 'single', name: 'Одиночный выбор' },
  { id: 'multiple', name: 'Множественный выбор' },
  { id: 'number', name: 'Числовой ответ' },
  { id: 'text', name: 'Текстовый ответ' },
  { id: 'essay', name: 'Эссе' },
  { id: 'matching', name: 'Сопоставление' },
];

const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Лёгкий', color: 'text-green-600' },
  { id: 'medium', name: 'Средний', color: 'text-yellow-600' },
  { id: 'hard', name: 'Сложный', color: 'text-red-600' },
];

// ========== МОКОВЫЕ ДАННЫЕ ==========
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

const MOCK_QUESTION_BANK = [
  { id: 1, text: "Что такое HTML?", type: "single", subject_id: 3, difficulty: "easy", options: ["Язык разметки", "Язык программирования", "База данных"], correct_answer: "Язык разметки" },
  { id: 2, text: "Какие из перечисленных являются языками программирования?", type: "multiple", subject_id: 3, difficulty: "medium", options: ["Python", "HTML", "JavaScript", "CSS"], correct_answer: ["Python", "JavaScript"] },
  { id: 3, text: "Сколько будет 2 + 2?", type: "number", subject_id: 1, difficulty: "easy", correct_answer: "4" },
  { id: 4, text: "Объясните принцип работы алгоритма сортировки пузырьком", type: "essay", subject_id: 3, difficulty: "hard" },
  { id: 5, text: "Что такое переменная в программировании?", type: "single", subject_id: 3, difficulty: "easy", options: ["Контейнер для данных", "Функция", "Цикл"], correct_answer: "Контейнер для данных" },
];

const MOCK_QUESTIONS = [
  { id: 1, text: "Что такое HTML?", type: "single", type_name: "Одиночный выбор", difficulty: "easy", weight: 5, subject_id: 3 },
  { id: 2, text: "Сколько будет 2 + 2?", type: "number", type_name: "Числовой ответ", difficulty: "easy", weight: 3, subject_id: 1 },
  { id: 3, text: "Какие из перечисленных являются языками программирования?", type: "multiple", type_name: "Множественный выбор", difficulty: "medium", weight: 4, subject_id: 3 },
];

export default function EditOlympiadPage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id;
  const olympiadId = params?.olympiadId;
  
  // Состояния для основной информации
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [olympiadStatus, setOlympiadStatus] = useState('draft');
  const [olympiadType, setOlympiadType] = useState('permanent');
  const [hasSales, setHasSales] = useState(false);
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [ageGroups, setAgeGroups] = useState(MOCK_AGE_GROUPS);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'permanent',
    subject_id: '',
    age_group_id: '',
    price_minor: 0,
  });
  
  const [errors, setErrors] = useState({});
  
  // Состояния для расписания
  const [hasEssayQuestions, setHasEssayQuestions] = useState(false);
  const [schedule, setSchedule] = useState({
    registration_start_at: '',
    registration_end_at: '',
    participation_start_at: '',
    participation_end_at: '',
    review_start_at: '',
    review_end_at: '',
  });
  const [scheduleErrors, setScheduleErrors] = useState({});
  
  // Состояния для вопросов
  const [questions, setQuestions] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Форма создания нового вопроса
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single',
    difficulty: 'easy',
    subject_id: 3,
    options: ['', ''],
    correct_answer: '',
    pairs: [{ left: '', right: '' }],
  });
  
  const totalScore = questions.reduce((sum, q) => sum + (q.weight || 0), 0);
  
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Сброс формы нового вопроса
  const resetNewQuestionForm = () => {
    setNewQuestion({
      text: '',
      type: 'single',
      difficulty: 'easy',
      subject_id: 3,
      options: ['', ''],
      correct_answer: '',
      pairs: [{ left: '', right: '' }],
    });
  };

  // Загрузка всех данных
  useEffect(() => {
    fetchAllData();
  }, [olympiadId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isTestMode) {
        const statusParam = new URLSearchParams(window.location.search).get('status');
        const isScheduled = new URLSearchParams(window.location.search).get('type') === 'scheduled';
        
        setOlympiadStatus(statusParam === 'approved' ? 'approved' : 'draft');
        setHasSales(false);
        setOlympiadType(isScheduled ? 'scheduled' : 'permanent');
        setFormData({
          title: isScheduled ? 'Тестовая временная олимпиада' : 'Тестовая постоянная олимпиада',
          description: 'Описание тестовой олимпиады',
          type: isScheduled ? 'scheduled' : 'permanent',
          subject_id: 3,
          age_group_id: 2,
          price_minor: 0,
        });
        setHasEssayQuestions(true);
        setSchedule({
          registration_start_at: '2025-06-01T00:00',
          registration_end_at: '2025-06-10T23:59',
          participation_start_at: '2025-06-11T00:00',
          participation_end_at: '2025-06-20T23:59',
          review_start_at: '2025-06-21T00:00',
          review_end_at: '2025-06-30T23:59',
        });
        setQuestions(MOCK_QUESTIONS);
        setQuestionBank(MOCK_QUESTION_BANK);
        setLoading(false);
        return;
      }
      
      const [olympiadRes, questionsRes, bankRes] = await Promise.all([
        fetch(`/api/v1/olympiads/${olympiadId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/v1/olympiads/${olympiadId}/questions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`/api/v1/institutions/${institutionId}/questions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      if (olympiadRes.ok) {
        const data = await olympiadRes.json();
        setOlympiadStatus(data.status);
        setHasSales(data.has_sales || false);
        setOlympiadType(data.type);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          type: data.type,
          subject_id: data.subject_id || '',
          age_group_id: data.age_group_id || '',
          price_minor: data.price_minor || 0,
        });
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
      
      if (questionsRes.ok) {
        const data = await questionsRes.json();
        setQuestions(data);
      }
      
      if (bankRes.ok) {
        const data = await bankRes.json();
        setQuestionBank(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Основная информация - валидация
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Введите название олимпиады';
    if (!formData.subject_id) newErrors.subject_id = 'Выберите предмет';
    if (!formData.age_group_id) newErrors.age_group_id = 'Выберите возрастную группу';
    if (formData.price_minor < 0) newErrors.price_minor = 'Цена не может быть отрицательной';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Расписание - валидация
  const validateSchedule = () => {
    const newErrors = {};
    if (!schedule.registration_start_at) newErrors.registration_start_at = 'Укажите дату начала регистрации';
    if (!schedule.registration_end_at) newErrors.registration_end_at = 'Укажите дату окончания регистрации';
    if (!schedule.participation_start_at) newErrors.participation_start_at = 'Укажите дату начала участия';
    if (!schedule.participation_end_at) newErrors.participation_end_at = 'Укажите дату окончания участия';
    
    if (hasEssayQuestions) {
      if (!schedule.review_start_at) newErrors.review_start_at = 'Укажите дату начала проверки эссе';
      if (!schedule.review_end_at) newErrors.review_end_at = 'Укажите дату окончания проверки эссе';
    }
    setScheduleErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Сохранение всех данных
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (olympiadType === 'scheduled' && !validateSchedule()) return;
    
    if (olympiadStatus === 'approved' && !hasSales) {
      setShowConfirmModal(true);
      return;
    }
    
    await saveAll();
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (olympiadStatus === 'approved' && !hasSales) {
          setOlympiadStatus('draft');
          showToast('Олимпиада переведена в черновик. Требуется повторная модерация.', 'info');
        } else {
          showToast('Изменения сохранены', 'success');
        }
        setSaving(false);
        setShowConfirmModal(false);
        setTimeout(() => router.back(), 1000);
        return;
      }
      
      const response = await fetch(`/api/v1/olympiads/${olympiadId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          type: formData.type,
          subject_id: parseInt(formData.subject_id),
          age_group_id: parseInt(formData.age_group_id),
          price_minor: formData.price_minor,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (formData.type === 'scheduled') {
          await fetch(`/api/v1/olympiads/${olympiadId}/schedule`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(schedule),
          });
        }
        
        if (data.status === 'draft' && olympiadStatus === 'approved') {
          showToast('Олимпиада переведена в черновик. Требуется повторная модерация.', 'info');
          setOlympiadStatus('draft');
        } else {
          showToast('Изменения сохранены', 'success');
        }
        setShowConfirmModal(false);
        setTimeout(() => router.back(), 1000);
      } else if (response.status === 403) {
        showToast(data.message || 'Изменения запрещены, олимпиада уже продана', 'error');
      } else {
        throw new Error(data.message || 'Ошибка при сохранении');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'type') setOlympiadType(value);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setFormData(prev => ({ ...prev, price_minor: value >= 0 ? value : 0 }));
    if (errors.price_minor) setErrors(prev => ({ ...prev, price_minor: '' }));
  };

  const handleDateChange = (field, value) => {
    setSchedule(prev => ({ ...prev, [field]: value }));
    if (scheduleErrors[field]) setScheduleErrors(prev => ({ ...prev, [field]: '' }));
  };

  const getMinDateFor = (field) => {
    switch (field) {
      case 'registration_end_at': return schedule.registration_start_at;
      case 'participation_start_at': return schedule.registration_end_at;
      case 'participation_end_at': return schedule.participation_start_at;
      case 'review_start_at': return schedule.participation_end_at;
      case 'review_end_at': return schedule.review_start_at;
      default: return undefined;
    }
  };

  // ========== ФУНКЦИИ ДЛЯ ВОПРОСОВ ==========
  const getQuestionTypeName = (type) => {
    return QUESTION_TYPES.find(t => t.id === type)?.name || type;
  };

  const getDifficultyColor = (difficulty) => {
    return DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.color || 'text-gray-600';
  };

  const getDifficultyName = (difficulty) => {
    return DIFFICULTY_LEVELS.find(d => d.id === difficulty)?.name || difficulty;
  };

  const getSubjectName = (subjectId) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Не указан';
  };

  const handleWeightChange = async (questionId, weight) => {
    const newWeight = parseInt(weight) || 0;
    if (isTestMode) {
      setQuestions(questions.map(q => q.id === questionId ? { ...q, weight: newWeight } : q));
      showToast('Вес обновлён', 'success');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/olympiads/${olympiadId}/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ weight: newWeight }),
      });
      setQuestions(questions.map(q => q.id === questionId ? { ...q, weight: newWeight } : q));
      showToast('Вес обновлён', 'success');
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  const handleRemoveQuestion = async (questionId) => {
    if (olympiadStatus !== 'draft') {
      showToast('Нельзя изменять вопросы после отправки на модерацию', 'error');
      return;
    }
    if (!confirm('Удалить вопрос из олимпиады?')) return;
    
    if (isTestMode) {
      setQuestions(questions.filter(q => q.id !== questionId));
      showToast('Вопрос удалён из олимпиады', 'success');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/olympiads/${olympiadId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setQuestions(questions.filter(q => q.id !== questionId));
      showToast('Вопрос удалён', 'success');
      fetchAllData();
    } catch (err) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  const handleAddQuestions = async () => {
    if (selectedQuestions.length === 0) {
      showToast('Выберите вопросы для добавления', 'error');
      return;
    }
    
    setLoading(true);
    try {
      if (isTestMode) {
        const newQuestions = selectedQuestions.map((qId, idx) => {
          const bankQ = questionBank.find(q => q.id === qId);
          return {
            id: Date.now() + idx,
            question_id: qId,
            text: bankQ?.text || 'Новый вопрос',
            type: bankQ?.type || 'single',
            weight: 5,
            order: questions.length + idx + 1,
            difficulty: bankQ?.difficulty || 'easy',
            subject_id: bankQ?.subject_id || 3,
          };
        });
        setQuestions([...questions, ...newQuestions]);
        showToast(`Добавлено ${selectedQuestions.length} вопросов`, 'success');
        setIsModalOpen(false);
        setSelectedQuestions([]);
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      for (const questionId of selectedQuestions) {
        await fetch(`/api/v1/olympiads/${olympiadId}/questions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question_id: questionId, weight: 5 }),
        });
      }
      
      showToast(`Добавлено ${selectedQuestions.length} вопросов`, 'success');
      setIsModalOpen(false);
      setSelectedQuestions([]);
      fetchAllData();
    } catch (err) {
      showToast('Ошибка при добавлении', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ========== ФУНКЦИИ ДЛЯ СОЗДАНИЯ ВОПРОСА ==========
  const addOption = () => {
    setNewQuestion({
      ...newQuestion,
      options: [...newQuestion.options, '']
    });
  };

  const removeOption = (index) => {
    if (newQuestion.options.length <= 2) {
      showToast('Должно быть минимум 2 варианта ответа', 'error');
      return;
    }
    const newOptions = [...newQuestion.options];
    newOptions.splice(index, 1);
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const updateNewQuestionOption = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const addMatchingPair = () => {
    setNewQuestion({
      ...newQuestion,
      pairs: [...newQuestion.pairs, { left: '', right: '' }]
    });
  };

  const removeMatchingPair = (index) => {
    const newPairs = [...newQuestion.pairs];
    newPairs.splice(index, 1);
    setNewQuestion({ ...newQuestion, pairs: newPairs });
  };

  const updateMatchingPair = (index, field, value) => {
    const newPairs = [...newQuestion.pairs];
    newPairs[index][field] = value;
    setNewQuestion({ ...newQuestion, pairs: newPairs });
  };

  const handleMultipleCorrectChange = (optionValue, checked) => {
    let currentCorrect = newQuestion.correct_answer || [];
    if (checked) {
      currentCorrect.push(optionValue);
    } else {
      currentCorrect = currentCorrect.filter(v => v !== optionValue);
    }
    setNewQuestion({ ...newQuestion, correct_answer: currentCorrect });
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.text.trim()) {
      showToast('Введите текст вопроса', 'error');
      return;
    }
    
    if (newQuestion.type === 'single' && !newQuestion.correct_answer) {
      showToast('Укажите правильный ответ', 'error');
      return;
    }
    
    if (newQuestion.type === 'multiple' && (!newQuestion.correct_answer || newQuestion.correct_answer.length === 0)) {
      showToast('Укажите правильные ответы', 'error');
      return;
    }
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      let metadata = {};
      
      if (newQuestion.type === 'single' || newQuestion.type === 'multiple') {
        metadata.options = newQuestion.options.filter(o => o.trim());
        metadata.correct_answer = newQuestion.correct_answer;
      }
      
      if (newQuestion.type === 'number') {
        metadata.correct_answer = newQuestion.correct_answer;
      }
      
      if (newQuestion.type === 'matching') {
        metadata.pairs = newQuestion.pairs.filter(p => p.left.trim() && p.right.trim());
      }
      
      if (isTestMode) {
        const createdQuestion = {
          id: Date.now(),
          text: newQuestion.text,
          type: newQuestion.type,
          type_name: getQuestionTypeName(newQuestion.type),
          difficulty: newQuestion.difficulty,
          subject_id: newQuestion.subject_id,
          weight: 5,
          ...metadata,
        };
        
        setQuestionBank([...questionBank, createdQuestion]);
        setQuestions([...questions, createdQuestion]);
        
        showToast('Вопрос создан и добавлен в олимпиаду', 'success');
        setIsCreateModalOpen(false);
        resetNewQuestionForm();
        setSaving(false);
        return;
      }
      
      const createResponse = await fetch(`/api/v1/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: newQuestion.type,
          text: newQuestion.text,
          difficulty: newQuestion.difficulty,
          subject_id: newQuestion.subject_id,
          metadata: metadata,
        }),
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Ошибка при создании вопроса');
      }
      
      const createdQuestion = await createResponse.json();
      
      const addResponse = await fetch(`/api/v1/olympiads/${olympiadId}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question_id: createdQuestion.id, weight: 5 }),
      });
      
      if (!addResponse.ok) {
        throw new Error('Вопрос создан, но не добавлен в олимпиаду');
      }
      
      showToast('Вопрос создан и добавлен в олимпиаду', 'success');
      setIsCreateModalOpen(false);
      resetNewQuestionForm();
      fetchAllData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Drag-and-drop для вопросов
  const handleDragStart = (e, index) => {
    if (olympiadStatus !== 'draft') return;
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || olympiadStatus !== 'draft') return;
    
    if (draggedItem !== index) {
      const newQuestions = [...questions];
      const [movedItem] = newQuestions.splice(draggedItem, 1);
      newQuestions.splice(index, 0, movedItem);
      setQuestions(newQuestions);
      setDraggedItem(index);
    }
  };

  const handleDragEnd = async () => {
    if (olympiadStatus !== 'draft') {
      setDraggedItem(null);
      return;
    }
    if (isTestMode) {
      setDraggedItem(null);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/v1/olympiads/${olympiadId}/questions/reorder`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: questions.map((q, idx) => ({ id: q.id, order: idx + 1 })) }),
      });
    } catch (err) {
      console.error('Ошибка сохранения порядка:', err);
    }
    setDraggedItem(null);
  };

  const filteredQuestions = questionBank.filter(q => {
    if (filterType && q.type !== filterType) return false;
    if (filterSubject && q.subject_id !== parseInt(filterSubject)) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    return true;
  });

  const isReadOnly = olympiadStatus !== 'draft';
  const isApprovedWithSales = olympiadStatus === 'approved' && hasSales;
  const canEdit = !isReadOnly && !isApprovedWithSales;
  const isScheduled = formData.type === 'scheduled';

  if (loading) {
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
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
        } text-white animate-in slide-in-from-right-5`}>
          {toast.message}
        </div>
      )}
      
      <Header olympiadTitle={formData.title} status={olympiadStatus} />
      
      <div className="flex-1 bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="text-[#8E51FF] hover:underline inline-flex items-center gap-1 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Назад
            </button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* ========== БЛОК 1: ОСНОВНАЯ ИНФОРМАЦИЯ ========== */}
            <div className="border-b border-gray-200">
              <div className="px-6 py-4 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">Основная информация</h2>
              </div>
              <div className="p-6">
                
                {olympiadStatus === 'approved' && !hasSales && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Внимание!</p>
                        <p className="text-sm text-yellow-700">Эта олимпиада уже одобрена. После редактирования она будет переведена в черновик и потребует повторной модерации.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isApprovedWithSales && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-red-800">Изменения запрещены</p>
                        <p className="text-sm text-red-700">Олимпиада уже продана. Изменение настроек невозможно.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {isReadOnly && olympiadStatus !== 'approved' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Олимпиада на модерации</p>
                        <p className="text-sm text-blue-700">Редактирование недоступно до принятия решения модератором.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {olympiadStatus === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-red-800">Олимпиада отклонена</p>
                        <p className="text-sm text-red-700">Исправьте ошибки и отправьте на повторную модерацию.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Название олимпиады <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={!canEdit}
                      className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.title ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'}`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      disabled={!canEdit}
                      className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all resize-y ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.description ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'}`}
                      placeholder="Опишите олимпиаду, правила участия..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Тип олимпиады</label>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <label className={`flex items-center gap-2 ${!canEdit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                        <input
                          type="radio"
                          name="type"
                          value="permanent"
                          checked={formData.type === 'permanent'}
                          onChange={handleChange}
                          disabled={!canEdit}
                          className="w-4 h-4 text-[#8E51FF]"
                        />
                        <span className="text-sm text-gray-700">Постоянная</span>
                        <span className="text-xs text-gray-400">(доступна всегда)</span>
                      </label>
                      <label className={`flex items-center gap-2 ${!canEdit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                        <input
                          type="radio"
                          name="type"
                          value="scheduled"
                          checked={formData.type === 'scheduled'}
                          onChange={handleChange}
                          disabled={!canEdit}
                          className="w-4 h-4 text-[#8E51FF]"
                        />
                        <span className="text-sm text-gray-700">Временная</span>
                        <span className="text-xs text-gray-400">(ограниченные даты)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Предмет <span className="text-red-500">*</span></label>
                      <select
                        name="subject_id"
                        value={formData.subject_id}
                        onChange={handleChange}
                        disabled={!canEdit}
                        className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.subject_id ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'}`}
                      >
                        <option value="">Выберите предмет</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      {errors.subject_id && <p className="text-red-500 text-sm mt-1">{errors.subject_id}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Возрастная группа <span className="text-red-500">*</span></label>
                      <select
                        name="age_group_id"
                        value={formData.age_group_id}
                        onChange={handleChange}
                        disabled={!canEdit}
                        className={`w-full px-4 py-2 border-2 rounded-xl outline-none transition-all ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.age_group_id ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'}`}
                      >
                        <option value="">Выберите возрастную группу</option>
                        {ageGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      {errors.age_group_id && <p className="text-red-500 text-sm mt-1">{errors.age_group_id}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена участия <span className="text-gray-400 text-xs">(₽)</span></label>
                    <input
                      type="number"
                      name="price_minor"
                      value={formData.price_minor}
                      onChange={handlePriceChange}
                      min="0"
                      step="1"
                      disabled={!canEdit}
                      className={`w-full max-w-[200px] px-4 py-2 border-2 rounded-xl outline-none transition-all ${!canEdit ? 'bg-gray-100 cursor-not-allowed' : ''} ${errors.price_minor ? 'border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'}`}
                    />
                    {errors.price_minor && <p className="text-red-500 text-sm mt-1">{errors.price_minor}</p>}
                    <p className="text-gray-400 text-xs mt-1">0 ₽ — бесплатная олимпиада. Цену нельзя изменить после создания.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* ========== БЛОК 2: РАСПИСАНИЕ (только для временных олимпиад) ========== */}
            {isScheduled && (
              <div className="border-b border-gray-200">
                <div className="px-6 py-4 bg-gray-50">
                  <h2 className="text-lg font-bold text-gray-800">Расписание</h2>
                </div>
                <div className="p-6 space-y-6">
                  
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs">1</span>
                      Регистрация участников
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <DateTimePicker
                        label="Дата и время начала"
                        value={schedule.registration_start_at}
                        onChange={(e) => handleDateChange('registration_start_at', e.target.value)}
                        error={scheduleErrors.registration_start_at}
                        required
                        disabled={!canEdit}
                      />
                      <DateTimePicker
                        label="Дата и время окончания"
                        value={schedule.registration_end_at}
                        onChange={(e) => handleDateChange('registration_end_at', e.target.value)}
                        minDate={getMinDateFor('registration_end_at')}
                        error={scheduleErrors.registration_end_at}
                        required
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs">2</span>
                      Участие (прохождение олимпиады)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <DateTimePicker
                        label="Дата и время начала"
                        value={schedule.participation_start_at}
                        onChange={(e) => handleDateChange('participation_start_at', e.target.value)}
                        minDate={getMinDateFor('participation_start_at')}
                        error={scheduleErrors.participation_start_at}
                        required
                        disabled={!canEdit}
                      />
                      <DateTimePicker
                        label="Дата и время окончания"
                        value={schedule.participation_end_at}
                        onChange={(e) => handleDateChange('participation_end_at', e.target.value)}
                        minDate={getMinDateFor('participation_end_at')}
                        error={scheduleErrors.participation_end_at}
                        required
                        disabled={!canEdit}
                      />
                    </div>
                  </div>
                  
                  {hasEssayQuestions && (
                    <div className="border border-gray-200 rounded-xl p-5">
                      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs">3</span>
                        Проверка эссе
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <DateTimePicker
                          label="Дата и время начала"
                          value={schedule.review_start_at}
                          onChange={(e) => handleDateChange('review_start_at', e.target.value)}
                          minDate={getMinDateFor('review_start_at')}
                          error={scheduleErrors.review_start_at}
                          required
                          disabled={!canEdit}
                        />
                        <DateTimePicker
                          label="Дата и время окончания"
                          value={schedule.review_end_at}
                          onChange={(e) => handleDateChange('review_end_at', e.target.value)}
                          minDate={getMinDateFor('review_end_at')}
                          error={scheduleErrors.review_end_at}
                          required
                          disabled={!canEdit}
                        />
                      </div>
                    </div>
                  )}
                  
                  {!hasEssayQuestions && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-700">В олимпиаде нет вопросов типа «Эссе». Результаты будут доступны сразу после завершения олимпиады.</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Хронология:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Регистрация:</span>
                        <span className="text-gray-800 text-xs">
                          {schedule.registration_start_at ? new Date(schedule.registration_start_at).toLocaleString() : '—'} → {schedule.registration_end_at ? new Date(schedule.registration_end_at).toLocaleString() : '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Участие:</span>
                        <span className="text-gray-800 text-xs">
                          {schedule.participation_start_at ? new Date(schedule.participation_start_at).toLocaleString() : '—'} → {schedule.participation_end_at ? new Date(schedule.participation_end_at).toLocaleString() : '—'}
                        </span>
                      </div>
                      {hasEssayQuestions && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">Проверка эссе:</span>
                          <span className="text-gray-800 text-xs">
                            {schedule.review_start_at ? new Date(schedule.review_start_at).toLocaleString() : '—'} → {schedule.review_end_at ? new Date(schedule.review_end_at).toLocaleString() : '—'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* ========== БЛОК 3: ВОПРОСЫ ========== */}
            <div className="border-b border-gray-200">
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                <h2 className="text-lg font-bold text-gray-800">Вопросы олимпиады</h2>
                {canEdit && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="border border-[#8E51FF] text-[#8E51FF] hover:bg-[#8E51FF] hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Создать вопрос
                    </button>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Добавить из банка
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-sm text-gray-500">{questions.length} вопросов. Перетаскивайте для изменения порядка</p>
                  <p className="text-sm font-medium">Общая сумма баллов: <span className="text-[#312C85] font-bold">{totalScore}</span></p>
                </div>
                
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>В олимпиаде пока нет вопросов</p>
                    {canEdit && (
                      <div className="flex gap-3 justify-center mt-3">
                        <button onClick={() => setIsCreateModalOpen(true)} className="text-[#8E51FF] hover:underline text-sm">
                          Создать первый вопрос
                        </button>
                        <span className="text-gray-300">или</span>
                        <button onClick={() => setIsModalOpen(true)} className="text-[#8E51FF] hover:underline text-sm">
                          Добавить из банка
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 border rounded-xl overflow-hidden">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        draggable={!isReadOnly}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`p-4 ${!isReadOnly ? 'hover:bg-gray-50 cursor-move' : ''} transition-colors`}
                      >
                        <div className="flex flex-wrap items-start gap-4">
                          {!isReadOnly && (
                            <div className="cursor-grab text-gray-400 hover:text-gray-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="text-xs text-gray-500">{index + 1}.</span>
                              <span className="text-sm text-gray-500">{getQuestionTypeName(question.type)}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)} bg-gray-100`}>
                                {getDifficultyName(question.difficulty)}
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium break-words">{question.text}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-gray-500">Вес:</span>
                              <input
                                type="number"
                                defaultValue={question.weight}
                                onBlur={(e) => handleWeightChange(question.id, e.target.value)}
                                className="w-16 px-2 py-1 border rounded-lg text-center text-sm"
                                min="1"
                                step="1"
                                disabled={isReadOnly}
                              />
                              <span className="text-sm text-gray-500">баллов</span>
                            </div>
                            {!isReadOnly && (
                              <button
                                onClick={() => handleRemoveQuestion(question.id)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                title="Удалить вопрос"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
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
            
            {/* Кнопки сохранения */}
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-4">
              {canEdit ? (
                <>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-all"
                  >
                    Отмена
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.back()}
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition-all"
                >
                  Назад
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[100px] md:h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
      
      {/* Модальное окно подтверждения */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">Подтверждение редактирования</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Эта олимпиада уже одобрена. После редактирования она будет переведена в черновик и потребует повторной модерации. Вы уверены, что хотите продолжить?</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Отмена</button>
                <button onClick={saveAll} className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white px-4 py-2 rounded-lg">Продолжить</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно выбора вопросов из банка */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Выбрать вопросы из банка</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
              >
                <option value="">Все типы</option>
                {QUESTION_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
              >
                <option value="">Все предметы</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
              >
                <option value="">Все уровни</option>
                {DIFFICULTY_LEVELS.map(level => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredQuestions.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Нет вопросов по выбранным фильтрам</p>
                ) : (
                  filteredQuestions.map((question) => (
                    <label key={question.id} className="flex items-start gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedQuestions.includes(question.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuestions([...selectedQuestions, question.id]);
                          } else {
                            setSelectedQuestions(selectedQuestions.filter(id => id !== question.id));
                          }
                        }}
                        className="mt-0.5 w-4 h-4 text-[#8E51FF] rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-gray-500">{getQuestionTypeName(question.type)}</span>
                          <span className="text-xs text-gray-500">{getSubjectName(question.subject_id)}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)} bg-gray-100`}>
                            {getDifficultyName(question.difficulty)}
                          </span>
                        </div>
                        <p className="text-gray-800">{question.text}</p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleAddQuestions}
                disabled={selectedQuestions.length === 0}
                className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                Добавить выбранные ({selectedQuestions.length})
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Модальное окно создания нового вопроса */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Создать новый вопрос</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип вопроса *</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value, correct_answer: e.target.value === 'multiple' ? [] : '' })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                >
                  {QUESTION_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Предмет *</label>
                <select
                  value={newQuestion.subject_id}
                  onChange={(e) => setNewQuestion({ ...newQuestion, subject_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сложность *</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                >
                  {DIFFICULTY_LEVELS.map(level => (
                    <option key={level.id} value={level.id}>{level.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Текст вопроса *</label>
                <textarea
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                  placeholder="Введите текст вопроса..."
                />
              </div>
              
              {(newQuestion.type === 'single' || newQuestion.type === 'multiple') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Варианты ответов</label>
                  <div className="space-y-2">
                    {newQuestion.options.map((opt, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateNewQuestionOption(idx, e.target.value)}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                          placeholder={`Вариант ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="text-red-500 hover:text-red-700 px-2"
                          title="Удалить вариант"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addOption}
                    className="mt-2 text-sm text-[#8E51FF] hover:underline"
                  >
                    + Добавить вариант ответа
                  </button>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {newQuestion.type === 'single' ? 'Правильный ответ *' : 'Правильные ответы *'}
                    </label>
                    {newQuestion.type === 'single' ? (
                      <select
                        value={newQuestion.correct_answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                      >
                        <option value="">Выберите правильный ответ</option>
                        {newQuestion.options.filter(o => o.trim()).map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="space-y-2">
                        {newQuestion.options.filter(o => o.trim()).map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={(newQuestion.correct_answer || []).includes(opt)}
                              onChange={(e) => handleMultipleCorrectChange(opt, e.target.checked)}
                              className="w-4 h-4 text-[#8E51FF] rounded"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {newQuestion.type === 'number' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Правильный ответ *</label>
                  <input
                    type="number"
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                    placeholder="Введите правильный числовой ответ"
                  />
                </div>
              )}
              
              {newQuestion.type === 'matching' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Пары для сопоставления</label>
                  <div className="space-y-3">
                    {newQuestion.pairs.map((pair, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          value={pair.left}
                          onChange={(e) => updateMatchingPair(idx, 'left', e.target.value)}
                          placeholder="Левая колонка"
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                        />
                        <span className="text-gray-400 self-center">→</span>
                        <input
                          type="text"
                          value={pair.right}
                          onChange={(e) => updateMatchingPair(idx, 'right', e.target.value)}
                          placeholder="Правая колонка"
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl outline-none focus:border-[#8E51FF]"
                        />
                        {newQuestion.pairs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMatchingPair(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addMatchingPair}
                    className="mt-2 text-sm text-[#8E51FF] hover:underline"
                  >
                    + Добавить пару
                  </button>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateQuestion}
                disabled={!newQuestion.text.trim()}
                className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                Создать и добавить в олимпиаду
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}