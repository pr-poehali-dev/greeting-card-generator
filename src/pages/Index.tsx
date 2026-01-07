import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

type Holiday = 'newyear' | 'birthday' | 'valentine';

interface Template {
  id: number;
  title: string;
  holiday: Holiday;
  bgColor: string;
  emoji: string;
}

interface Sticker {
  emoji: string;
  id: string;
  position: { x: number; y: number };
  size: number;
}

interface TextSettings {
  position: { x: number; y: number };
  isDragging: boolean;
}

const Index = () => {
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday>('newyear');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [greetingText, setGreetingText] = useState('');
  const [exportFormat, setExportFormat] = useState('png');
  const [exportQuality, setExportQuality] = useState('high');
  const [textSize, setTextSize] = useState(24);
  const [selectedFont, setSelectedFont] = useState('cormorant');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [draggedStickerId, setDraggedStickerId] = useState<string | null>(null);
  const [customBgColor, setCustomBgColor] = useState('from-blue-100 to-purple-100');
  const [textSettings, setTextSettings] = useState<TextSettings>({ 
    position: { x: 50, y: 50 }, 
    isDragging: false 
  });
  const [isExporting, setIsExporting] = useState(false);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

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

  const bgColorOptions = [
    { label: 'Зимнее небо', value: 'from-blue-100 to-purple-100' },
    { label: 'Золотой закат', value: 'from-amber-100 to-yellow-100' },
    { label: 'Ночная магия', value: 'from-indigo-100 to-blue-100' },
    { label: 'Розовая мечта', value: 'from-pink-100 to-rose-100' },
    { label: 'Лиловый туман', value: 'from-purple-100 to-pink-100' },
    { label: 'Персиковый рассвет', value: 'from-orange-100 to-amber-100' },
    { label: 'Алая страсть', value: 'from-red-100 to-pink-100' },
    { label: 'Нежная весна', value: 'from-rose-100 to-red-100' },
    { label: 'Мятная свежесть', value: 'from-emerald-100 to-teal-100' },
    { label: 'Лавандовые поля', value: 'from-violet-100 to-purple-100' },
  ];

  const fonts = [
    { value: 'cormorant', label: 'Cormorant (элегантный)', family: 'Cormorant, serif' },
    { value: 'opensans', label: 'Open Sans (классический)', family: 'Open Sans, sans-serif' },
    { value: 'cursive', label: 'Рукописный', family: 'cursive' },
    { value: 'serif', label: 'С засечками', family: 'serif' },
  ];

  const stickersByHoliday = {
    newyear: ['❄️', '⛄', '🎄', '🎅', '🎁', '✨', '⭐', '🌟', '🔔', '🕯️', '🎊', '🎉'],
    birthday: ['🎂', '🎈', '🎉', '🎊', '🎁', '🧁', '🍰', '🎀', '🥳', '🪅', '🎇', '🎆'],
    valentine: ['❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💓', '😍', '🥰', '😘', '🌹', '💐', '👼', '💑', '💏'],
  };

  const filteredTemplates = templates.filter(t => t.holiday === selectedHoliday);

  const holidays = [
    { id: 'newyear' as Holiday, name: 'Новый год', icon: 'Snowflake', color: 'text-blue-600' },
    { id: 'birthday' as Holiday, name: 'День рождения', icon: 'Cake', color: 'text-pink-600' },
    { id: 'valentine' as Holiday, name: 'День влюбленных', icon: 'Heart', color: 'text-red-600' },
  ];

  const openEditor = (template: Template) => {
    setSelectedTemplate(template);
    setGreetingText('');
    setStickers([]);
    setTextSize(24);
    setSelectedFont('cormorant');
    setCustomBgColor(template.bgColor);
    setTextSettings({ position: { x: 50, y: 50 }, isDragging: false });
    setIsEditorOpen(true);
  };

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      emoji,
      id: Date.now().toString(),
      position: { x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 },
      size: 48,
    };
    setStickers([...stickers, newSticker]);
  };

  const removeSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStickers(stickers.filter(s => s.id !== id));
  };

  const handleStickerMouseDown = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDraggedStickerId(id);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!previewRef.current) return;

    const rect = previewRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    if (draggedStickerId) {
      setStickers(stickers.map(s => 
        s.id === draggedStickerId 
          ? { ...s, position: { x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) } }
          : s
      ));
    }

    if (textSettings.isDragging) {
      setTextSettings(prev => ({
        ...prev,
        position: { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggedStickerId(null);
    setTextSettings(prev => ({ ...prev, isDragging: false }));
  };

  const handleTextMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTextSettings(prev => ({ ...prev, isDragging: true }));
  };

  const handleStickerWheel = (id: string, e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -4 : 4;
    setStickers(stickers.map(s => 
      s.id === id 
        ? { ...s, size: Math.max(24, Math.min(120, s.size + delta)) }
        : s
    ));
  };

  const updateStickerSize = (id: string, newSize: number) => {
    setStickers(stickers.map(s => 
      s.id === id ? { ...s, size: newSize } : s
    ));
  };

  const generateCardBlob = async (): Promise<Blob | null> => {
    if (!exportRef.current) return null;

    try {
      const scale = exportQuality === 'high' ? 3 : exportQuality === 'medium' ? 2 : 1;
      const canvas = await html2canvas(exportRef.current, {
        scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          `image/${exportFormat}`,
          exportFormat === 'jpeg' ? 0.95 : 1
        );
      });
    } catch (error) {
      console.error('Generation error:', error);
      return null;
    }
  };

  const handleExport = async () => {
    if (!exportRef.current || !selectedTemplate) {
      toast.error('Ошибка', { description: 'Не удалось создать открытку' });
      return;
    }

    setIsExporting(true);
    toast.info('Генерация открытки...', { description: 'Пожалуйста, подождите' });

    const blob = await generateCardBlob();
    
    if (!blob) {
      toast.error('Ошибка экспорта', { description: 'Не удалось создать файл' });
      setIsExporting(false);
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `открытка-${selectedTemplate.title.toLowerCase().replace(/\s+/g, '-')}.${exportFormat}`;
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Готово!', { description: `Открытка сохранена как ${fileName}` });
    setIsExporting(false);
  };

  const handleShare = async () => {
    if (!exportRef.current || !selectedTemplate) {
      toast.error('Ошибка', { description: 'Нет открытки для отправки' });
      return;
    }

    setIsExporting(true);
    toast.info('Подготовка к отправке...', { description: 'Пожалуйста, подождите' });

    const blob = await generateCardBlob();
    
    if (!blob) {
      toast.error('Ошибка', { description: 'Не удалось подготовить открытку' });
      setIsExporting(false);
      return;
    }

    const fileName = `открытка-${selectedTemplate.title.toLowerCase().replace(/\s+/g, '-')}.${exportFormat}`;
    const file = new File([blob], fileName, { type: `image/${exportFormat}` });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: `Праздничная открытка: ${selectedTemplate.title}`,
          text: greetingText || 'Поздравляю!',
          files: [file],
        });
        toast.success('Отправлено!', { description: 'Открытка успешно отправлена' });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Ошибка', { description: 'Не удалось отправить' });
        }
      }
    } else {
      const url = URL.createObjectURL(blob);
      const shareText = `${greetingText || 'Поздравляю!'} — открытка создана в Праздничных открытках`;
      
      const emailSubject = encodeURIComponent(`Праздничная открытка: ${selectedTemplate.title}`);
      const emailBody = encodeURIComponent(`${shareText}\n\nСмотрите во вложении!`);
      
      window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`, '_blank');
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Подготовлено!', { description: 'Открытка скачана, открыто письмо email' });
    }

    setIsExporting(false);
  };

  const selectedFontFamily = fonts.find(f => f.value === selectedFont)?.family || 'Cormorant, serif';

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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Редактор открытки</DialogTitle>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Предпросмотр</h4>
                <div className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
                  <Icon name="Move" size={12} className="inline mr-1" />
                  Перетаскивайте элементы
                </div>
              </div>
              {selectedTemplate && (
                <div 
                  ref={previewRef}
                  className={`aspect-[4/3] bg-gradient-to-br ${customBgColor} rounded-lg flex items-center justify-center relative shadow-lg overflow-hidden select-none touch-none`}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchMove={handleMouseMove}
                  onTouchEnd={handleMouseUp}
                >
                  <div className="text-9xl mb-8 animate-float pointer-events-none">{selectedTemplate.emoji}</div>
                  
                  {stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className="absolute cursor-move group"
                      style={{
                        left: `${sticker.position.x}%`,
                        top: `${sticker.position.y}%`,
                        fontSize: `${sticker.size}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onMouseDown={(e) => handleStickerMouseDown(sticker.id, e)}
                      onTouchStart={(e) => handleStickerMouseDown(sticker.id, e)}
                      onWheel={(e) => handleStickerWheel(sticker.id, e)}
                    >
                      <div className="relative">
                        {sticker.emoji}
                        <button
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={(e) => removeSticker(sticker.id, e)}
                        >
                          <Icon name="X" size={14} className="text-white" />
                        </button>
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <input
                            type="range"
                            min="24"
                            max="120"
                            value={sticker.size}
                            onChange={(e) => updateStickerSize(sticker.id, parseInt(e.target.value))}
                            className="w-20 h-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {greetingText && (
                    <div 
                      className="absolute cursor-move group"
                      style={{
                        left: `${textSettings.position.x}%`,
                        top: `${textSettings.position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      onMouseDown={handleTextMouseDown}
                      onTouchStart={handleTextMouseDown}
                    >
                      <p 
                        className="text-center text-primary/90 bg-white/75 backdrop-blur-sm rounded-lg p-6 shadow-lg group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                        style={{ 
                          fontSize: `${textSize}px`,
                          fontFamily: selectedFontFamily,
                          fontWeight: 600,
                        }}
                      >
                        {greetingText}
                      </p>
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Icon name="Move" size={16} className="text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                <p><Icon name="MousePointer" size={12} className="inline mr-1" />Перетаскивайте элементы мышью или пальцем</p>
                <p><Icon name="Maximize2" size={12} className="inline mr-1" />Наведите на стикер и используйте ползунок для изменения размера</p>
                <p><Icon name="Scroll" size={12} className="inline mr-1" />Прокрутите колесико мыши на стикере для быстрого изменения размера</p>
              </div>
            </div>

            <div>
              <Tabs defaultValue="design" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="design">Дизайн</TabsTrigger>
                  <TabsTrigger value="text">Текст</TabsTrigger>
                  <TabsTrigger value="stickers">Стикеры</TabsTrigger>
                  <TabsTrigger value="export">Экспорт</TabsTrigger>
                </TabsList>

                <TabsContent value="design" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Цвет фона</label>
                    <Select value={customBgColor} onValueChange={setCustomBgColor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bgColorOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded bg-gradient-to-r ${option.value} border`}></div>
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-accent/50 rounded-lg space-y-2 text-sm">
                    <p className="font-medium">Советы по дизайну:</p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Выбирайте контрастные цвета для читаемости</li>
                      <li>• Не перегружайте открытку стикерами</li>
                      <li>• Размещайте текст в центре или внизу</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
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
                    <label className="block text-sm font-medium mb-2">Шрифт</label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            <span style={{ fontFamily: font.family }}>{font.label}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Размер текста: {textSize}px
                    </label>
                    <Slider
                      value={[textSize]}
                      onValueChange={(value) => setTextSize(value[0])}
                      min={16}
                      max={48}
                      step={2}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="stickers" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Тематические стикеры
                      <span className="text-xs text-muted-foreground ml-2">(нажмите чтобы добавить)</span>
                    </label>
                    <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                      {selectedTemplate && stickersByHoliday[selectedTemplate.holiday].map((emoji, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-14 text-3xl hover:scale-110 transition-transform"
                          onClick={() => addSticker(emoji)}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {stickers.length > 0 && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        Добавлено стикеров: {stickers.length}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => setStickers([])}
                      >
                        <Icon name="Trash2" size={14} />
                        Удалить все
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
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
                        <SelectItem value="high">Высокое (лучшее качество)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button 
                      onClick={handleExport} 
                      size="lg" 
                      className="w-full gap-2"
                      disabled={isExporting}
                    >
                      {isExporting ? (
                        <>
                          <Icon name="Loader2" size={18} className="animate-spin" />
                          Генерация...
                        </>
                      ) : (
                        <>
                          <Icon name="Download" size={18} />
                          Скачать открытку
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleShare}
                      variant="outline" 
                      size="lg" 
                      className="w-full gap-2"
                      disabled={isExporting}
                    >
                      <Icon name="Share2" size={18} />
                      Поделиться
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed -left-[9999px] -top-[9999px]">
        {selectedTemplate && (
          <div 
            ref={exportRef}
            className={`w-[1200px] h-[900px] bg-gradient-to-br ${customBgColor} flex items-center justify-center relative`}
            style={{ fontFamily: selectedFontFamily }}
          >
            <div className="text-[180px] absolute" style={{ top: '45%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              {selectedTemplate.emoji}
            </div>
            
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="absolute"
                style={{
                  left: `${sticker.position.x}%`,
                  top: `${sticker.position.y}%`,
                  fontSize: `${sticker.size * 2}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {sticker.emoji}
              </div>
            ))}
            
            {greetingText && (
              <div 
                className="absolute"
                style={{
                  left: `${textSettings.position.x}%`,
                  top: `${textSettings.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <p 
                  className="text-center text-primary/90 bg-white/75 backdrop-blur-sm rounded-lg p-12 shadow-lg"
                  style={{ 
                    fontSize: `${textSize * 2}px`,
                    fontFamily: selectedFontFamily,
                    fontWeight: 600,
                  }}
                >
                  {greetingText}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-purple-100 mt-20">
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>© 2026 Праздничные открытки. Создавайте моменты радости</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;