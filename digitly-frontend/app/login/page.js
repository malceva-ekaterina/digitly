// Добавьте эту функцию в ProfileButton перед fetchCurrentUser
const checkLocalStorageAuth = () => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      console.log('Using localStorage auth fallback');
      setIsAuthenticated(true);
      setUserName(userData.name || userData.fullname || userData.email?.split('@')[0] || 'Пользователь');
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};

// Измените fetchCurrentUser:
const fetchCurrentUser = async () => {
  // Сначала пробуем localStorage как fallback
  if (checkLocalStorageAuth()) {
    setLoading(false);
    // Все равно пробуем обновить данные с сервера в фоне
    fetchCurrentUserFromServer();
    return;
  }
  
  await fetchCurrentUserFromServer();
};

const fetchCurrentUserFromServer = async () => {
  try {
    console.log('=== Fetching user from server ===');
    await fetchCsrfToken();
    
    const response = await fetch('/api/v1/user', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('User data received:', userData);
      setIsAuthenticated(true);
      setUserName(userData.name || userData.fullname || userData.email?.split('@')[0] || 'Пользователь');
      localStorage.setItem('user', JSON.stringify(userData));
    } else if (response.status === 401) {
      // Если сервер вернул 401, проверяем localStorage
      if (!checkLocalStorageAuth()) {
        setIsAuthenticated(false);
        setUserName('');
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    // При ошибке сети пробуем localStorage
    checkLocalStorageAuth();
  } finally {
    setLoading(false);
  }
};