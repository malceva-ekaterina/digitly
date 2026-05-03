"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function AddCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  // Форматирование номера карты (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Форматирование срока действия (MM/YY)
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  // ВАЛИДАЦИЯ КАРТЫ 
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (!cleanNumber) return 'Введите номер карты';
    if (!/^\d+$/.test(cleanNumber)) return 'Номер карты может содержать только цифры';
    if (cleanNumber.length !== 16) return 'Номер карты должен содержать 16 цифр';
    
    const firstDigit = cleanNumber[0];
    const firstTwoDigits = parseInt(cleanNumber.substring(0, 2));
    const firstFourDigits = parseInt(cleanNumber.substring(0, 4));
    const firstSixDigits = parseInt(cleanNumber.substring(0, 6));
    
    // Карта МИР 
    if (firstFourDigits >= 2200 && firstFourDigits <= 2204) {
      return null;
    }
    
    //  НСПК 
    if (firstFourDigits >= 2000 && firstFourDigits <= 2099) {
      return null;
    }
    
    // UnionPay 
    if (firstDigit === '6' && firstTwoDigits >= 62 && firstTwoDigits <= 71) {
      return null;
    }
    
    //  JCB (
    if (firstFourDigits === 3528 || firstFourDigits === 3589 || firstSixDigits === 180000) {
      return null;
    }
    
    //  Mastercard (
    const mastercardRanges = ['51', '52', '53', '54', '55', '22', '23', '24', '25', '26', '27'];
    const isMastercard = mastercardRanges.some(range => cleanNumber.startsWith(range));
    if (isMastercard) {
      // BIN-диапазоны Mastercard
      const russianMastercard = [
        510097, 510098, 510099, 511292, 511293, 511294, 511295, 511296,
        520088, 520089, 520090, 520091, 520092, 520093, 520094, 530078,
        540065, 540066, 540067, 540068, 540069, 550033, 550034, 550035,
        2221, 2222, 2223, 2224, 2225, 2226, 2227, 2228, 2229
      ];
      const isRussian = russianMastercard.some(bin => cleanNumber.toString().startsWith(bin.toString()));
      if (isRussian) return null;
      return 'Карты Mastercard принимаются только от российских банков';
    }
    
    // Visa 
    if (firstDigit === '4') {
      // Российские BIN-диапазоны Visa
      const russianVisa = [
        401363, 401364, 401365, 401366, 401367, 401368, 401369,
        430836, 430837, 430838, 430839, 430840, 430841, 430842,
        445198, 445199, 445200, 445201, 445202,
        459990, 459991, 459992, 459993, 459994,
        488511, 488512, 488513, 488514, 488515
      ];
      const isRussian = russianVisa.some(bin => cleanNumber.toString().startsWith(bin.toString()));
      if (isRussian) return null;
      return 'Карты Visa принимаются только от российских банков';
    }
    
    return 'Поддерживаются только карты МИР, UnionPay, JCB и карты российских банков (Mastercard/Visa)';
  };

  // Валидация срока действия
  const validateExpiryDate = (date) => {
    if (!date) return 'Введите срок действия';
    if (!/^\d{2}\/\d{2}$/.test(date)) return 'Неверный формат (MM/YY)';
    
    const [month, year] = date.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return 'Месяц должен быть от 01 до 12';
    if (yearNum < currentYear) return 'Срок действия карты истёк';
    if (yearNum === currentYear && monthNum < currentMonth) return 'Срок действия карты истёк';
    if (yearNum > currentYear + 10) return 'Слишком дальний срок действия (максимум 10 лет)';
    
    return null;
  };

  // Валидация CVV
  const validateCVV = (cvv) => {
    if (!cvv) return 'Введите CVV/CVC код';
    if (!/^\d+$/.test(cvv)) return 'CVV может содержать только цифры';
    if (cvv.length !== 3) return 'CVV должен содержать 3 цифры';
    return null;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
    const error = validateCardNumber(formatted);
    setErrors({ ...errors, cardNumber: error });
  };

  const handleExpiryDateChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData({ ...formData, expiryDate: formatted });
    const error = validateExpiryDate(formatted);
    setErrors({ ...errors, expiryDate: error });
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setFormData({ ...formData, cvv: value });
    const error = validateCVV(value);
    setErrors({ ...errors, cvv: error });
  };

  const validateForm = () => {
    const cardError = validateCardNumber(formData.cardNumber);
    const expiryError = validateExpiryDate(formData.expiryDate);
    const cvvError = validateCVV(formData.cvv);
    
    setErrors({
      cardNumber: cardError,
      expiryDate: expiryError,
      cvv: cvvError
    });
    
    return !cardError && !expiryError && !cvvError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Пожалуйста, исправьте ошибки в форме', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
      const bank = detectBank(cleanCardNumber);
      
      const response = await fetch('/api/v1/profile/cards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          card_number: cleanCardNumber,
          expiry_date: formData.expiryDate,
          cvv: formData.cvv,
          bank: bank
        })
      });
      
      if (response.ok) {
        showToast('Карта успешно привязана', 'success');
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка при привязке карты');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Определение банка по первым цифрам
  const detectBank = (cardNumber) => {
    const firstDigit = cardNumber[0];
    const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
    const firstFourDigits = parseInt(cardNumber.substring(0, 4));
    
    if (firstFourDigits >= 2200 && firstFourDigits <= 2204) return 'МИР';
    if (firstDigit === '6' && firstTwoDigits >= 62 && firstTwoDigits <= 71) return 'UnionPay';
    if (firstFourDigits === 3528 || firstFourDigits === 3589) return 'JCB';
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5' && firstTwoDigits >= 51 && firstTwoDigits <= 55) return 'Mastercard';
    return 'Другая';
  };

  // Определение иконки платёжной системы
  const getCardIcon = () => {
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    const firstFourDigits = parseInt(cardNumber.substring(0, 4));
    
    if (firstFourDigits >= 2200 && firstFourDigits <= 2204) {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#2A3579"/>
          <text x="12" y="17" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">МИР</text>
        </svg>
      );
    }
    if (cardNumber.startsWith('6')) {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#E60000"/>
          <text x="12" y="17" textAnchor="middle" fill="#fff" fontSize="8">银联</text>
        </svg>
      );
    }
    if (cardNumber.startsWith('4')) {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#1A1F71"/>
          <text x="12" y="17" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">VISA</text>
        </svg>
      );
    }
    if (cardNumber.startsWith('5')) {
      return (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#EB001B"/>
          <text x="12" y="17" textAnchor="middle" fill="#fff" fontSize="8">Mastercard</text>
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#4B5563"/>
        <text x="12" y="17" textAnchor="middle" fill="#fff" fontSize="8">💳</text>
      </svg>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {toast.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {toast.message}
        </div>
      )}
      
      {/* Шапка */}
      <div className="w-full h-[200px] relative" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}>
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
          <button 
            onClick={() => router.back()}
            className="bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center gap-2 px-4 py-2 text-white hover:bg-white/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться назад
          </button>
          <Link href="/">
            <img src="/chifra/logo_chifra.png" alt="Цифра" className="w-16 sm:w-24 h-auto" />
          </Link>
        </div>
        <div className='absolute bottom-4 left-0 right-0'>
          <p className='font-sans text-white text-3xl sm:text-4xl md:text-5xl font-bold p-4'>Привязать новую карту</p>
        </div>
      </div>

      {/* Форма привязки карты */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full">
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Превью карты */}
            <div className="relative p-6 bg-gradient-to-r from-[#312C85] to-[#8E51FF]">
              <div className="absolute top-4 right-4">
                {getCardIcon()}
              </div>
              <div className="text-white">
                <div className="text-sm opacity-75 mb-2">•••• •••• ••••</div>
                <div className="text-xl font-mono tracking-wider">
                  {formData.cardNumber || '____ ____ ____ ____'}
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <div className="text-xs opacity-75">Срок действия</div>
                    <div className="font-mono">{formData.expiryDate || 'MM/YY'}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">CVV</div>
                    <div className="font-mono">{formData.cvv ? '•••' : '***'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Номер карты */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Номер карты <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                    errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                  }`}
                  maxLength="19"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">МИР</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">UnionPay</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">JCB</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Visa (РФ)</span>
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Mastercard (РФ)</span>
                </div>
              </div>
              
              {/* Срок действия и CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Срок действия <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={handleExpiryDateChange}
                    placeholder="MM/YY"
                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                      errors.expiryDate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                    }`}
                    maxLength="5"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV/CVC <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.cvv}
                      onChange={handleCVVChange}
                      placeholder="***"
                      className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${
                        errors.cvv ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#8E51FF]'
                      }`}
                      maxLength="3"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 group">
                      <svg className="w-5 h-5 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg p-2 whitespace-nowrap z-10">
                        3 цифры на обороте карты
                      </div>
                    </div>
                  </div>
                  {errors.cvv && (
                    <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">3 цифры на обороте карты</p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#312C85] to-[#8E51FF] hover:from-[#8E51FF] hover:to-[#312C85] text-white py-3 rounded-xl font-medium text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  'Привязать карту'
                )}
              </button>
              
              <div className="text-center text-xs text-gray-400">
                <div className="flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Данные карты защищены и не передаются третьим лицам</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="w-full h-[100px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #312C85, #8E51FF)'}}></div>
    </div>
  );
}