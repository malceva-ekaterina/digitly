"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function InstitutionSwitcher() {
  const [institutions, setInstitutions] = useState([]);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/profile/institutions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data);
        
        // Загружаем сохранённую организацию или берём первую
        const savedId = localStorage.getItem('current_institution_id');
        let institution = null;
        
        if (savedId) {
          institution = data.find(i => i.institution_id === parseInt(savedId));
        }
        
        if (!institution && data.length > 0) {
          institution = data[0];
        }
        
        if (institution) {
          setCurrentInstitution(institution);
          localStorage.setItem('current_institution_id', institution.institution_id);
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки организаций:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchInstitution = (institution) => {
    setCurrentInstitution(institution);
    localStorage.setItem('current_institution_id', institution.institution_id);
    setIsOpen(false);
    // Перезагружаем страницу для обновления контекста
    window.location.reload();
  };

  // Если загрузка или нет организаций - не показываем
  if (loading || institutions.length === 0) {
    return null;
  }

  // Если только одна организация - не показываем дропдаун, только название
  if (institutions.length === 1) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-1.5 text-white text-sm font-medium">
        {currentInstitution?.name || institutions[0]?.name}
      </div>
    );
  }

  // Несколько организаций - показываем дропдаун
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 px-4 py-1.5 text-white text-sm font-medium hover:bg-white/30 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        <span className="max-w-[200px] truncate">{currentInstitution?.name || 'Выберите ОО'}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg overflow-hidden z-50">
          <div className="py-2">
            {institutions.map((inst) => (
              <button
                key={inst.institution_id}
                onClick={() => handleSwitchInstitution(inst)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  currentInstitution?.institution_id === inst.institution_id
                    ? 'bg-[#FFE4E6] text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate flex-1">{inst.name}</span>
                  {currentInstitution?.institution_id === inst.institution_id && (
                    <svg className="w-4 h-4 text-green-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {inst.role === 'admin' ? 'Администратор' : 'Методист'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}