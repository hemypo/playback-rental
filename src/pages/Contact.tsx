
import { useState } from "react";
import { MailIcon, MapPinIcon, PhoneIcon, SendIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setIsSubmitting(false);
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="heading-1 mb-6">Связаться с нами</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
          У вас есть вопросы по поводу нашей услуги проката оборудования? Свяжитесь с нашей командой.
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Наше местоположение</h3>
                    <p className="text-muted-foreground">
                    Г.Кемерово <br />
                    ул. Демьяна Бедного, 6 
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Телефон</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+79999999999" className="hover:text-primary transition-colors">
                        +7 (999) 999-99-99
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MailIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">E-mail</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:PlaybackRental@yandex.ru" className="hover:text-primary transition-colors">
                      PlaybackRental@yandex.ru
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="font-medium mb-3">График работы</h3>
                <div className="space-y-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Будние:</span>
                    <span>9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Выходные:</span>
                    <span>10:00 - 19:00</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-soft p-8 subtle-ring">
              <h2 className="heading-3 mb-6">Отправьте нам сообщение</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Имя
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Телефон
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Сообщение
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formState.message}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                     Отправка...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-4 w-4 mr-2" />
                      Отправить
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Посетите наш офис</h2>
            <p className="body-text max-w-2xl mx-auto">
            Мы удобно расположены в самом центре города. Приходите в наш выставочный зал, чтобы лично ознакомиться с нашим оборудованием.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto h-96 rounded-xl overflow-hidden subtle-ring">
            <div className="w-full h-full bg-white">
              {/* This would be replaced with an actual map integration */}
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center p-8">
                  <MapPinIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Карта в процессе</h3>
                  <p className="text-muted-foreground max-w-md">
                  Мы работаем над созданием интерактивной карты. А пока
                  вы можете найти нас по адресу Г.Кемерово ул. Демьяна Бедного, 6 
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
