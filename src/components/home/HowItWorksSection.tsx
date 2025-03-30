
import { PackageIcon, CameraIcon } from 'lucide-react';
import { CalendarIconComponent } from './CalendarIconComponent';

export const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="chip mb-3">Простой процесс</span>
          <h2 className="heading-2 mb-4">Как работает аренда</h2>
          <p className="body-text max-w-2xl">
            Аренда оборудования у нас - это простой и беспроблемный процесс. Выполните следующие действия, чтобы приобрести оборудование, необходимое для вашего следующего проекта.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Выберите оборудование",
              description: "Просмотрите наш обширный каталог и выберите оборудование, необходимое для вашего проекта.",
              icon: <PackageIcon className="h-8 w-8 text-primary" />,
            },
            {
              title: "Забронируйте даты",
              description: "Выберите предпочтительные даты получения и возврата в нашем календаре доступности.",
              icon: <CalendarIconComponent />,
            },
            {
              title: "Получите и создавайте",
              description: "Заберите оборудование в нашем пункте выдачи и приступайте к реализации своего проекта.",
              icon: <CameraIcon className="h-8 w-8 text-primary" />,
            },
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 rounded-xl glass-card">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
