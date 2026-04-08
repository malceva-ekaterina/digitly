export default function PasswordRecoveryEmail() {
  return (  
    <div className="min-h-screen bg-cover bg-center bg-no-repeat grid place-items-center p-4" 
      style={{ backgroundImage: "url('/bagraund.png')" }}>

      <div className = "flex flex-col items-center w-full max-w-[639px] mx-auto">
        <div className="bg-white rounded-4xl w-full px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16">
          <div className="flex flex-col items-center">

            <img 
              src="/lock.png" 
              alt="Иконка замка" 
              className = "w-6 sm:w-7 md:w-8"
            />

            <p className = "text-center font-sans font-bold text-2xl sm:text-3xl md:text-4xl">Восстановление пароля</p>
            
            <form action="/restore/new-password" method="POST" className="w-full flex flex-col items-center">

              <div className="w-full max-w-[384px]">
                <p className="font-sans text-xl mb-1 text-left mt-4">Email</p>
              </div>

              <input  
                type="email"
                name="email" 
                placeholder="Введите Email"  
                required 
                className = "border-2 border-gray-200 rounded-xl pl-4  hover:border-gray-300 outline-none w-full max-w-[384px] text-xs sm:text-sm md:text-base" 
                style={{ height: '40px' }}
               />

              <button 
              type="submit" 
              className="px-6 py-2 rounded-xl bg-red-300 font-sans text-white hover:bg-red-400 transition-colors mt-4">Отправить</button>

            </form>
          </div>      
        </div>
      </div>
    </div>
  );
}