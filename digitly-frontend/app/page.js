import Link from 'next/link';

export default function PasswordRecoveryEmail() {
  return (  
    <div>
      {/* Первый блок*/}
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
        style={{ backgroundImage: "url('/main_page.png')" }}>
        
        {/* Бинарный фон на весь блок */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: "url('chifra/binary_001.png')" }} />
        
        {/* Верхняя панель с лого и кнопками*/}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
          
          {/* Логотип слева */}
          <div>
            <img 
              src="chifra/logo_chifra.png" 
              alt="Цифра" 
              className="w-16 sm:w-20 md:w-24 h-auto"
            />  
          </div>
          
          {/* Кнопки */}
          <div className="flex items-center gap-5">
            <Link href="/olympiads" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Олимпиады</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/methodics" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Методочки</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/login" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans"
              style={{ height: '44px', width: '108px' }}>
              <span className="font-sans">Вход</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        {/* Большая картинка по центру */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <img 
            src="chifra/chifra_olympiad.png" 
            alt="Цифра Центр онлайн олимпиад" 
            className="max-w-[717px] w-full h-auto px-4"
          />  
        </div>
      </div>
      
      {/* Второй блок*/}
      <div className="min-h-screen flex flex-col p-4" 
        style={{ backgroundColor: '#EDE9FE' }}>
        
        {/* Верхняя панель второго блока*/}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4">
          
          {/* Логотип слева */}
          <div>
            <img 
              src="chifra/logo_chifra_black.png" 
              alt="Цифра" 
              className="w-16 sm:w-20 md:w-24 h-auto"
            />  
          </div>
          
          {/* Кнопки */}
          <div className="flex items-center gap-5">
            <Link href="/olympiads" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans shadow-sm"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Олимпиады</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/methodics" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans shadow-sm"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Методочки</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/login" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans shadow-sm"
              style={{ height: '44px', width: '108px' }}>
              <span className="font-sans">Вход</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        {/* Контейнер для центрирования карточек */}
        <div className="flex-1 flex justify-center items-center">
          
          {/* Внутренний контейнер с фиксированной шириной */}
          <div className="w-full max-w-[1328px] px-4 sm:px-6 md:px-8">
            
            {/* Заголовок "Преимущества" */}
            <p className="font-bold text-3xl sm:text-4xl md:text-6xl mb-6 md:mb-8 font-sans">
              Преимущества
            </p>
            
            {/* Контейнер для двух колонок */}
            <div className="flex flex-wrap gap-8 font-sans">
              
              {/* Левая колонка — карточка "Сотрудничество" */}
              <div className="bg-white rounded-xl flex flex-col justify-end flex-1 min-w-[300px] relative" 
                   style={{ height: '481px' }}>
                {/* Круг в правом верхнем углу */}
                <div className="absolute top-4 right-4 bg-violet-500 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                  <img 
                    src="chifra/check_mark.png" 
                    alt="галочка" 
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                  />
                </div>
                <div className="p-6">
                  <p className="font-bold text-xl sm:text-2xl md:text-3xl mb-2 font-sans">Сотрудничество</p>
                  <p className="text-sm sm:text-base md:text-xl font-sans">Сотрудничество включает взаимодействие с работодателями и социальными партнерами для разработки образовательных программ.</p>
                </div>
              </div>
              
              {/* Правая колонка — две карточки друг под другом */}
              <div className="flex flex-col gap-8 flex-1 min-w-[300px]">
                
                {/* Карточка "Нет ограничений" */}
                <div className="bg-white rounded-xl flex flex-col justify-end relative" 
                     style={{ height: '227px' }}>
                  {/* Круг в правом верхнем углу */}
                  <div className="absolute top-4 right-4 bg-violet-500 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <img 
                      src="chifra/check_mark.png" 
                      alt="галочка" 
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-bold text-xl sm:text-2xl md:text-3xl mb-2 font-sans">Нет ограничений</p>
                    <p className="text-sm sm:text-base md:text-xl font-sans">Нет ограничений в плане обучения и прохождения, нет ограничений по времени, учитесь в своем удобном темпе, олимпиады открыты и днем и ночью.</p>
                  </div>
                </div>
                
                {/* Карточка "Легкость" */}
                <div className="bg-white rounded-xl flex flex-col justify-end relative" 
                     style={{ height: '227px' }}>
                  {/* Круг в правом верхнем углу */}
                  <div className="absolute top-4 right-4 bg-violet-500 rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <img 
                      src="chifra/check_mark.png" 
                      alt="галочка" 
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-bold text-xl sm:text-2xl md:text-3xl mb-2">Легкость</p>
                    <p className="text-sm sm:text-base md:text-xl font-sans">Не нужно много знаний чтобы понять как проходить олимпиады. У нас все легко и просто. Учитесь, развивайтесь и узнавайте мир вместе с нами!</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Третий блок*/}
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
        style={{ backgroundImage: "url('/main_page.png')" }}>

        {/* Бинарный фон на весь блок*/}
        <div className="absolute inset-0 bg-contain bg-center bg-no-repeat m-4" 
          style={{ backgroundImage: "url('chifra/binary_002.png')" }} />
        
        {/* Верхняя панель с лого и кнопками*/}
        <div className="absolute top-4 left-0 right-0 z-20 flex justify-between items-center px-4 sm:px-6 md:px-8">
          
          {/* Логотип слева */}
          <div>
            <img 
              src="chifra/logo_chifra.png" 
              alt="Цифра" 
              className="w-16 sm:w-20 md:w-24 h-auto"
            />  
          </div>
          
          {/* Кнопки */}
          <div className="flex items-center gap-5">
            <Link href="/olympiads" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Олимпиады</span>
              <img 
                src="chifra/arrow.png" 
                alt="стрелка" 
                className="w-4 h-4" 
              />
            </Link>

            <Link href="/methodics" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Методочки</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/login" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans"
              style={{ height: '44px', width: '108px' }}>
              <span className="font-sans">Вход</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="h-screen flex items-center justify-center flex-wrap gap-8 text-white">
          <div className="backdrop-blur-xs rounded-xl bg-violet-800/60 m-8 flex flex-col justify-center items-center"
              style={{ height: '186px', width: '280px' }}>
              <img 
                src="chifra/smailey_people.png" 
                alt="стрелка" 
                className="w-8 h-8 mt-4" 
              />
              <p className="mt-4 font-sans text-3xl sm:text-4xl md:text-5xl">Число</p>
              <p className="mt-4 font-sans">Студентов</p>
          </div>
          <div className="backdrop-blur-xs rounded-xl bg-violet-800/60 m-8 flex flex-col justify-center items-center"
              style={{ height: '186px', width: '280px' }}>
              <img 
                src="chifra/smailey_check_paper.png" 
                alt="стрелка" 
                className="w-8 h-8 mt-4" 
              />
              <p className="mt-4 font-sans text-3xl sm:text-4xl md:text-5xl">Число</p>
              <p className="mt-4 font-sans">Олимпиад</p>
          </div>
          <div className="backdrop-blur-xs rounded-xl bg-violet-800/60 m-8 flex flex-col justify-center items-center"
              style={{ height: '186px', width: '280px' }}>
                <img 
                src="chifra/smailey_handsnake.png" 
                alt="стрелка" 
                className="w-8 h-8 mt-4" 
              />
              <p className="mt-4 font-sans text-3xl sm:text-4xl md:text-5xl">Число</p>
              <p className="mt-4 font-sans">Партнеров</p>
          </div>
          <div className="backdrop-blur-xs rounded-xl bg-violet-800/60 m-8 flex flex-col justify-center items-center"
              style={{ height: '186px', width: '280px' }}>
                <img 
                src="chifra/smailey_heart.png" 
                alt="стрелка" 
                className="w-8 h-8  mt-4" 
              />
              <p className="mt-4 font-sans text-3xl sm:text-4xl md:text-5xl">Число</p>
              <p className="mt-4 font-sans">Лет вместе</p>
          </div>
        </div>
      </div>

    {/* четвертый блок */}
      <div className="min-h-screen flex flex-col p-4" 
        style={{ backgroundColor: '#EDE9FE' }}>
          {/* Верхняя панель*/}
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4">
          
          {/* Логотип слева */}
          <div>
            <img 
              src="chifra/logo_chifra_black.png" 
              alt="Цифра" 
              className="w-16 sm:w-20 md:w-24 h-auto"
            />  
          </div>
          
          {/* Кнопки */}
          <div className="flex items-center gap-5">
            <Link href="/olympiads" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans shadow-sm"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Олимпиады</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/methodics" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans shadow-sm"
              style={{ height: '44px', width: '127px' }}>
              <span className="font-sans">Методочки</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>

            <Link href="/login" 
              className="bg-white rounded-xl flex items-center justify-center gap-2 font-sans shadow-sm"
              style={{ height: '44px', width: '108px' }}>
              <span className="font-sans">Вход</span>
              <img src="chifra/arrow.png" alt="стрелка" className="w-4 h-4" />
            </Link>
          </div>
    </div>
  );
}