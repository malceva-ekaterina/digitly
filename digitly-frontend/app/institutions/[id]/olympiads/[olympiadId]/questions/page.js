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
          Вопросы: {olympiadTitle || 'Олимпиада'}
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

const MOCK_QUESTION_BANK = [
  { id: 1, text: "Что такое HTML?", type: "single", subject_id: 3, difficulty: "easy", options: ["Язык разметки", "Язык программирования", "База данных"], correct_answer: "Язык разметки" },
  { id: 2, text: "Какие из перечисленных являются языками программирования?", type: "multiple", subject_id: 3, difficulty: "medium", options: ["Python", "HTML", "JavaScript", "CSS"], correct_answer: ["Python", "JavaScript"] },
  { id: 3, text: "Сколько будет 2 + 2?", type: "number", subject_id: 1, difficulty: "easy", correct_answer: "4" },
  { id: 4, text: "Объясните принцип работы алгоритма сортировки пузырьком", type: "essay", subject_id: 3, difficulty: "hard" },
  { id: 5, text: "Что такое переменная в программировании?", type: "single", subject_id: 3, difficulty: "easy", options: ["Контейнер для данных", "Функция", "Цикл"], correct_answer: "Контейнер для данных" },
  { id: 6, text: "Сопоставьте языки программирования и их типы", type: "matching", subject_id: 3, difficulty: "medium", pairs: [
    { left: "Python", right: "Интерпретируемый" },
    { left: "Java", right: "Компилируемый" },
    { left: "JavaScript", right: "Скриптовый" }
  ]},
];

const MOCK_OLYMPIAD_QUESTIONS = [
  { id: 1, question_id: 1, text: "Что такое HTML?", type: "single", weight: 5, order: 1, difficulty: "easy" },
  { id: 2, question_id: 3, text: "Сколько будет 2 + 2?", type: "number", weight: 3, order: 2, difficulty: "easy" },
  { id: 3, question_id: 2, text: "Какие из перечисленных являются языками программирования?", type: "multiple", weight: 4, order: 3, difficulty: "medium" },
  { id: 4, question_id: 4, text: "Объясните принцип работы алгоритма сортировки пузырьком", type: "essay", weight: 8, order: 4, difficulty: "hard" },
  { id: 5, question_id: 5, text: "Что такое переменная в программировании?", type: "single", weight: 3, order: 5, difficulty: "easy" },
];

export default function OlympiadQuestionsPage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = params?.id;
  const olympiadId = params?.olympiadId;
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [olympiadStatus, setOlympiadStatus] = useState('draft');
  const [olympiadTitle, setOlympiadTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionBank, setQuestionBank] = useState([]);
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [draggedItem, setDraggedItem] = useState(null);
  const totalScore = questions.reduce((sum, q) => sum + (q.weight || 0), 0);
  
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'single',
    difficulty: 'easy',
    subject_id: 3,
    options: ['', ''],
    correct_answer: '',
    pairs: [{ left: '', right: '' }],
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // ========== ОТПРАВКА НА МОДЕРАЦИЮ ==========
  const handleSubmitForModeration = async () => {
    if (questions.length < 5) {
      showToast('Минимальное количество вопросов для отправки на модерацию — 5', 'error');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmitForModeration = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      if (isTestMode) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOlympiadStatus('pending_moderation');
        showToast('Олимпиада отправлена на модерацию (тестовый режим)', 'success');
        setSubmitting(false);
        return;
      }
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/v1/olympiads/${olympiadId}/submit-for-moderation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка при отправке на модерацию');
      }
      setOlympiadStatus('pending_moderation');
      showToast('Олимпиада отправлена на модерацию', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSubjects();
  }, [olympiadId]);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (isTestMode) {
        setOlympiadTitle('Тестовая олимпиада');
        setOlympiadStatus('draft');
        setQuestions(MOCK_OLYMPIAD_QUESTIONS);
        setQuestionBank(MOCK_QUESTION_BANK);
        setLoading(false);
        return;
      }
      
      const [olympiadRes, questionsRes, bankRes] = await Promise.all([
        fetch(`/api/v1/olympiads/${olympiadId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/v1/olympiads/${olympiadId}/questions`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/v1/institutions/${institutionId}/questions`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      if (olympiadRes.ok) {
        const data = await olympiadRes.json();
        setOlympiadTitle(data.title);
        setOlympiadStatus(data.status || 'draft');
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
      fetchData();
    } catch (err) {
      showToast('Ошибка при добавлении вопросов', 'error');
    } finally {
      setLoading(false);
    }
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
    
    setLoading(true);
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
          difficulty: newQuestion.difficulty,
          subject_id: newQuestion.subject_id,
          ...metadata,
        };
        
        setQuestionBank([...questionBank, createdQuestion]);
        
        const newOlympiadQuestion = {
          id: Date.now() + 1000,
          question_id: createdQuestion.id,
          text: createdQuestion.text,
          type: createdQuestion.type,
          weight: 5,
          order: questions.length + 1,
          difficulty: createdQuestion.difficulty,
        };
        setQuestions([...questions, newOlympiadQuestion]);
        
        showToast('Вопрос создан и добавлен в олимпиаду', 'success');
        setIsCreateModalOpen(false);
        resetNewQuestionForm();
        setLoading(false);
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
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

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
      
      showToast('Вопрос удалён из олимпиады', 'success');
      fetchData();
    } catch (err) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  const handleWeightChange = async (questionId, weight) => {
    if (olympiadStatus !== 'draft') {
      showToast('Нельзя изменять вес вопросов после отправки на модерацию', 'error');
      return;
    }
    const newWeight = parseInt(weight) || 0;
    
    if (isTestMode) {
      setQuestions(questions.map(q => 
        q.id === questionId ? { ...q, weight: newWeight } : q
      ));
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
      showToast('Вес обновлён', 'success');
    } catch (err) {
      console.error('Ошибка обновления веса:', err);
    }
  };

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

  const filteredQuestions = questionBank.filter(q => {
    if (filterType && q.type !== filterType) return false;
    if (filterSubject && q.subject_id !== parseInt(filterSubject)) return false;
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false;
    return true;
  });

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

  const isReadOnly = olympiadStatus !== 'draft';
  const isPendingModeration = olympiadStatus === 'pending_moderation';

  const goToDashboard = () => {
    router.push(`/institutions/${institutionId}/dashboard`);
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
      
      <Header olympiadTitle={olympiadTitle} status={olympiadStatus} />
      
      <div className="flex-1 bg-gray-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
            {/* Кнопка "Назад к олимпиаде"*/}
            {!isPendingModeration && (
              <button
                onClick={() => router.back()}
                className="text-[#8E51FF] hover:underline inline-flex items-center gap-1 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Назад к олимпиаде
              </button>
            )}
            
            {isPendingModeration && (
              <button
                onClick={goToDashboard}
                className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                На главную ОО
              </button>
            )}
            
            {!isReadOnly && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="border border-[#8E51FF] text-[#8E51FF] hover:bg-[#8E51FF] hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Создать вопрос
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить из банка
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">Вопросы олимпиады</h2>
              <p className="text-gray-500 text-sm mt-1">
                {questions.length} вопросов. Перетаскивайте для изменения порядка
              </p>
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Общая сумма баллов: </span>
                <span className="font-bold text-[#312C85]">{totalScore}</span>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <svg className="w-10 h-10 animate-spin text-[#8E51FF] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p className="text-gray-500">Загрузка вопросов...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 mb-4">В олимпиаде пока нет вопросов</p>
                {!isReadOnly && (
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="text-[#8E51FF] hover:underline"
                    >
                      Создать первый вопрос
                    </button>
                    <span className="text-gray-300">или</span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-[#8E51FF] hover:underline"
                    >
                      Добавить из банка
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    draggable={!isReadOnly}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`p-5 ${!isReadOnly ? 'hover:bg-gray-50 cursor-move' : ''} transition-colors`}
                  >
                    <div className="flex items-start gap-4">
                      {!isReadOnly && (
                        <div className="cursor-grab text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-gray-500 text-sm">
                            {getQuestionTypeName(question.type)}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(question.difficulty)} bg-gray-100`}>
                            {getDifficultyName(question.difficulty)}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium">{question.text}</p>
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

          {/* Кнопка отправки на модерацию (только для черновиков) */}
          {olympiadStatus === 'draft' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmitForModeration}
                disabled={submitting || questions.length < 5}
                className={`bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-6 py-3 rounded-xl text-base font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {submitting ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Отправить на модерацию
                  </>
                )}
              </button>
            </div>
          )}

        
          {olympiadStatus === 'pending_moderation' && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <div className="flex flex-col items-center gap-4">
                <p className="text-blue-800 font-medium text-lg">
                  Олимпиада отправлена на модерацию.
                </p>
                <p className="text-blue-700">
                  Вы не можете редактировать вопросы до решения модератора.
                </p>
                <button
                  onClick={goToDashboard}
                  className="mt-4 bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  На главную ОО
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <div className="w-full h-[100px] md:h-[209px]" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>

      {/* Модальное окно подтверждения отправки на модерацию */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-xl font-bold text-gray-800">Отправить на модерацию</h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                После отправки на модерацию вы не сможете изменять вопросы до принятия решения модератором.
              </p>
              <p className="text-gray-600 font-medium">
                Количество вопросов: {questions.length}
              </p>
              <p className="text-gray-600 mb-6">
                Общая сумма баллов: {totalScore}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmSubmitForModeration}
                  className="bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Отправить
                </button>
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