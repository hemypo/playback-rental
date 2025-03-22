
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BitrixIntegration from '@/components/BitrixIntegration';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="heading-2 mb-6">Панель администратора</h1>
      
      <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
          <TabsTrigger value="products">Товары</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Всего товаров</CardTitle>
                <CardDescription>Количество доступных товаров</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">8</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Активные аренды</CardTitle>
                <CardDescription>Количество текущих аренд</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">4</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Доход за месяц</CardTitle>
                <CardDescription>Общий доход за текущий месяц</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">$1,250</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <BitrixIntegration />
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Управление товарами</CardTitle>
              <CardDescription>Добавление, редактирование и удаление товаров для аренды</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Здесь будет управление товарами.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Интеграция с Битрикс24</CardTitle>
              <CardDescription>Настройка и управление интеграцией с Битрикс24</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Настройки API</h3>
                  <p className="text-muted-foreground mb-4">
                    Настройте параметры API для подключения к вашему Битрикс24.
                  </p>
                  <BitrixIntegration showControls={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
