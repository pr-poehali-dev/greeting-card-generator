import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

type Holiday = 'newyear' | 'birthday' | 'valentine';

interface Template {
  id: number;
  title: string;
  holiday: Holiday;
  bgColor: string;
  emoji: string;
}

const Index = () => {
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday>('newyear');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [greetingText, setGreetingText] = useState('');
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState('high');

  const templates: Template[] = [
    { id: 1, title: 'Снежная сказка', holiday: 'newyear', bgColor: 'from-blue-100 to-purple-100', emoji: '❄️' },
    { id: 2, title: 'Золотые огни', holiday: 'newyear', bgColor: 'from-amber-100 to-yellow-100', emoji: '✨' },
    { id: 3, title: 'Зимнее волшебство', holiday: 'newyear', bgColor: 'from-indigo-100 to-blue-100', emoji: '🎄' },
    { id: 4, title: 'Праздничный торт', holiday: 'birthday', bgColor: 'from-pink-100 to-rose-100', emoji: '🎂' },
    { id: 5, title: 'Воздушные шары', holiday: 'birthday', bgColor: 'from-purple-100 to-pink-100', emoji: '🎈' },
    { id: 6, title: 'Конфетти', holiday: 'birthday', bgColor: 'from-orange-100 to-amber-100', emoji: '🎉' },
    { id: 7, title: 'Романтика', holiday: 'valentine', bgColor: 'from-red-100 to-pink-100', emoji: '❤️' },
    { id: 8, title: 'Любовь в сердцах', holiday: 'valentine', bgColor: 'from-pink-100 to-purple-100', emoji: '💕' },
    { id: 9, title: 'Нежность', holiday: 'valentine', bgColor: 'from-rose-100 to-red-100', emoji: '💖' },
  ];

  const filteredTemplates = templates.filter(t => t.holiday === selectedHoliday);

  const holidays = [
    { id: 'newyear' as Holiday, name: 'Новый год', icon: 'Snowflake', color: 'text-blue-600' },
    { id: 'birthday' as Holiday, name: 'День рождения', icon: 'Cake', color: 'text-pink-600' },
    { id: 'valentine' as Holiday, name: 'День влюбленных', icon: 'Heart', color: 'text-red-600' },
  ];

  const openEditor = (template: Template) => {
    setSelectedTemplate(template);
    setGreetingText('');
    setIsEditorOpen(true);
  };

  const handleExport = () => {
    alert(`Открытка экспортирована в формате ${exportFormat.toUpperCase()} с качеством ${exportQuality}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Sparkles" size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-primary">Праздничные открытки</h1>
            </div>
            <nav className="flex gap-4">
              <Button variant="ghost" className="gap-2">
                <Icon name="Home" size={18} />
                <span>Главная</span>
              </Button>
              <Button variant="ghost" className="gap-2">
                <Icon name="Image" size={18} />
                <span>Галерея</span>
              </Button>
              <Button variant="ghost" className="gap-2">
                <Icon name="Share2" size={18} />
                <span>Поделиться</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-primary mb-4">Создайте уникальную открытку</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Выберите праздник, настройте дизайн и поделитесь теплыми пожеланиями с близкими
          </p>
        </section>

        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8">Выберите праздник</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {holidays.map((holiday) => (
              <Card
                key={holiday.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  selectedHoliday === holiday.id ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setSelectedHoliday(holiday.id)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                    holiday.id === 'newyear' ? 'from-blue-100 to-purple-100' :
                    holiday.id === 'birthday' ? 'from-pink-100 to-orange-100' :
                    'from-red-100 to-pink-100'
                  } flex items-center justify-center animate-float`}>
                    <Icon name={holiday.icon} size={32} className={holiday.color} />
                  </div>
                  <h4 className="text-xl font-semibold">{holiday.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-3xl font-bold text-center mb-8">Шаблоны открыток</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <Card
                key={template.id}
                className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openEditor(template)}
              >
                <CardContent className="p-0">
                  <div className={`h-64 bg-gradient-to-br ${template.bgColor} flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-8xl animate-float">{template.emoji}</div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button size="lg" className="gap-2">
                        <Icon name="Edit" size={18} />
                        Редактировать
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-center">{template.title}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Редактор открытки</DialogTitle>
          </DialogHeader>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Предпросмотр</h4>
              {selectedTemplate && (
                <div className={`aspect-[4/3] bg-gradient-to-br ${selectedTemplate.bgColor} rounded-lg flex items-center justify-center relative shadow-lg`}>
                  <div className="text-9xl mb-8">{selectedTemplate.emoji}</div>
                  {greetingText && (
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <p className="text-2xl font-semibold text-center text-primary/80 bg-white/70 backdrop-blur-sm rounded-lg p-6">
                        {greetingText}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Текст поздравления</label>
                <Textarea
                  placeholder="Введите текст поздравления..."
                  value={greetingText}
                  onChange={(e) => setGreetingText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Формат экспорта</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="gif">GIF (анимация)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Качество</label>
                <Select value={exportQuality} onValueChange={setExportQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкое (быстрая загрузка)</SelectItem>
                    <SelectItem value="medium">Среднее</SelectItem>
                    <SelectItem value="high">Высокое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleExport} className="flex-1 gap-2">
                  <Icon name="Download" size={18} />
                  Экспортировать
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Icon name="Share2" size={18} />
                  Поделиться
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>© 2026 Праздничные открытки. Создавайте моменты радости</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
