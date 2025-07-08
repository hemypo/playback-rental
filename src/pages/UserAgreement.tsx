const UserAgreement = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="heading-2 mb-8">Пользовательское соглашение</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="mb-6">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">1. Общие положения</h2>
            <p className="mb-4">
              Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между 
              ООО «PlayBack Rental» (далее — «Компания») и пользователями сайта playbackrental.ru 
              (далее — «Пользователи») при оказании услуг аренды фото и видео оборудования.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">2. Предмет соглашения</h2>
            <p className="mb-4">
              Компания предоставляет Пользователям возможность аренды профессионального фото и видео оборудования 
              на условиях, изложенных в настоящем Соглашении.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">3. Права и обязанности сторон</h2>
            <h3 className="text-lg font-semibold mb-3">3.1. Компания обязуется:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Предоставить оборудование в рабочем состоянии</li>
              <li>Обеспечить техническую поддержку в период аренды</li>
              <li>Соблюдать конфиденциальность персональных данных</li>
            </ul>
            
            <h3 className="text-lg font-semibold mb-3">3.2. Пользователь обязуется:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Бережно обращаться с арендованным оборудованием</li>
              <li>Возвратить оборудование в оговоренные сроки</li>
              <li>Компенсировать ущерб в случае порчи или утери</li>
              <li>Предоставить достоверную информацию при регистрации</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">4. Условия аренды</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Минимальный срок аренды — 1 день</li>
              <li>Залог составляет 50% от стоимости оборудования</li>
              <li>Возврат залога осуществляется в течение 3 рабочих дней</li>
              <li>При повреждении оборудования стоимость ремонта удерживается из залога</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">5. Ответственность</h2>
            <p className="mb-4">
              Пользователь несет полную материальную ответственность за арендованное оборудование 
              с момента его получения до момента возврата.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">6. Заключительные положения</h2>
            <p className="mb-4">
              Соглашение вступает в силу с момента регистрации Пользователя на сайте или 
              первого заказа услуг Компании.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="heading-3 mb-4">7. Контактная информация</h2>
            <ul className="list-none pl-6 mb-4">
              <li>Email: PlaybackRental@yandex.ru</li>
              <li>Телефон: +7 (923) 530-30-20</li>
              <li>Адрес: г. Кемерово, ул. Демьяна Бедного, 6</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserAgreement;