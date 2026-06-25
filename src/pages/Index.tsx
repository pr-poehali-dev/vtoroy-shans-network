import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

type Role = 'seeker' | 'mentor';
type Screen = 'feed' | 'profile' | 'goals' | 'chat' | 'ai';

const AVATAR_SEEKER = 'https://cdn.poehali.dev/projects/ea32a82f-3b6c-41de-bc3b-41c8574efbf5/files/4179292c-7e7a-409e-ad70-698a29e743a0.jpg';
const AVATAR_MENTOR = 'https://cdn.poehali.dev/projects/ea32a82f-3b6c-41de-bc3b-41c8574efbf5/files/57fe0b27-08a4-4487-bcc6-451ec43561be.jpg';

const FEED = [
  { id: 1, role: 'mentor' as Role, name: 'Андрей Соколов', avatar: AVATAR_MENTOR, time: '2 часа назад', tag: 'Я могу научить', text: 'Беру 2 человек в наставничество по продуктовому дизайну. Покажу процесс от идеи до релиза, дам реальные задачи из своего стартапа.', rating: 4.9 },
  { id: 2, role: 'seeker' as Role, name: 'Мария Лебедева', avatar: AVATAR_SEEKER, time: '4 часа назад', tag: 'Мне нужна помощь', text: 'Ищу человека, который поможет вернуться в профессию после декрета. Раньше работала в маркетинге, хочу разобраться, с чего начать сегодня.', rating: 4.7 },
  { id: 3, role: 'mentor' as Role, name: 'Игорь Власов', avatar: AVATAR_MENTOR, time: 'вчера', tag: 'Я могу включить в стартап', text: 'Запускаю проект в сфере EdTech. Нужны мотивированные ребята без опыта, но с горящими глазами. Научу всему по ходу дела.', rating: 5.0 },
];

const PROFILE = {
  role: 'seeker' as Role,
  name: 'Мария Лебедева',
  avatar: AVATAR_SEEKER,
  bio: 'Возвращаюсь к себе после паузы. Ищу направление, поддержку и людей, которым по пути.',
  rating: 4.7,
  reviews: 12,
  goals: ['Найти наставника в маркетинге', 'Собрать первое портфолио', 'Получить оффер на стажировку'],
  achievements: ['Прошла курс по основам SMM', 'Сделала 3 учебных проекта', 'Получила первый отклик работодателя'],
};

const initialSteps = [
  { id: 1, text: 'Определить нишу и направление', done: true },
  { id: 2, text: 'Найти наставника в ленте', done: true },
  { id: 3, text: 'Составить план обучения на месяц', done: false },
  { id: 4, text: 'Сделать первый проект в портфолио', done: false },
  { id: 5, text: 'Откликнуться на 5 вакансий', done: false },
];

const CHATS = [
  { id: 1, name: 'Андрей Соколов', avatar: AVATAR_MENTOR, last: 'Давай созвонимся завтра в 18:00', unread: 2 },
  { id: 2, name: 'Игорь Власов', avatar: AVATAR_MENTOR, last: 'Скинул тебе тестовое задание', unread: 0 },
];

const MESSAGES = [
  { mine: false, text: 'Привет! Видел твой запрос про возвращение в маркетинг. Могу помочь.' },
  { mine: true, text: 'Здравствуйте! Это было бы здорово, спасибо что откликнулись 🙏' },
  { mine: false, text: 'Давай созвонимся завтра в 18:00, обсудим план?' },
];

function RoleBadge({ role }: { role: Role }) {
  return role === 'mentor' ? (
    <Badge className="bg-mentor/15 text-mentor hover:bg-mentor/15 border-0 rounded-full font-medium">Наставник</Badge>
  ) : (
    <Badge className="bg-seeker/15 text-seeker hover:bg-seeker/15 border-0 rounded-full font-medium">Ищущий</Badge>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-foreground/70">
      <Icon name="Star" size={14} className="text-primary fill-primary" />
      {value.toFixed(1)}
    </span>
  );
}

export default function Index() {
  const [registered, setRegistered] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [screen, setScreen] = useState<Screen>('feed');
  const [steps, setSteps] = useState(initialSteps);
  const [aiInput, setAiInput] = useState('');

  const toggleStep = (id: number) =>
    setSteps((s) => s.map((st) => (st.id === id ? { ...st, done: !st.done } : st)));

  const doneCount = steps.filter((s) => s.done).length;
  const progress = Math.round((doneCount / steps.length) * 100);

  if (!registered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-background">
        <div className="w-full max-w-lg animate-fade-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
              <Icon name="Sparkles" size={26} className="text-primary" />
            </div>
            <h1 className="text-5xl font-display font-semibold tracking-tight">Второй шанс</h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Место, где находят себя — и помогают найти другим
            </p>
          </div>

          <div className="bg-card rounded-3xl p-8 shadow-sm border border-border">
            <p className="text-sm font-medium text-muted-foreground mb-3">Кто вы сегодня?</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {([
                { r: 'seeker' as Role, icon: 'Compass', title: 'Ищущий', desc: 'Нужна поддержка и путь' },
                { r: 'mentor' as Role, icon: 'HandHeart', title: 'Наставник', desc: 'Готов учить и вести' },
              ]).map((opt) => (
                <button
                  key={opt.r}
                  onClick={() => setRole(opt.r)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all hover-lift ${
                    role === opt.r ? 'border-primary bg-primary/5' : 'border-border bg-background'
                  }`}
                >
                  <Icon name={opt.icon} size={24} className={role === opt.r ? 'text-primary' : 'text-foreground/60'} />
                  <p className="font-display text-xl font-semibold mt-3">{opt.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>

            <Input
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3 h-12 rounded-xl"
            />
            <Input placeholder="Email" type="email" className="mb-5 h-12 rounded-xl" />

            <Button
              disabled={!role}
              onClick={() => setRegistered(true)}
              className="w-full h-12 rounded-xl text-base"
            >
              Начать путь
              <Icon name="ArrowRight" size={18} className="ml-1" />
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6">
            Наставники проходят проверку по портфолио и отзывам
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <span className="font-display text-2xl font-semibold">Второй шанс</span>
          </div>
          <RoleBadge role={role!} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 pb-28">
        {screen === 'feed' && <Feed />}
        {screen === 'profile' && <Profile />}
        {screen === 'goals' && (
          <Goals steps={steps} toggleStep={toggleStep} progress={progress} doneCount={doneCount} />
        )}
        {screen === 'chat' && <Chat />}
        {screen === 'ai' && <AI role={role!} aiInput={aiInput} setAiInput={setAiInput} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-2 grid grid-cols-5">
          {([
            { s: 'feed' as Screen, icon: 'Newspaper', label: 'Лента' },
            { s: 'goals' as Screen, icon: 'Target', label: 'Цели' },
            { s: 'ai' as Screen, icon: 'Sparkles', label: 'AI' },
            { s: 'chat' as Screen, icon: 'MessageCircle', label: 'Чат' },
            { s: 'profile' as Screen, icon: 'User', label: 'Профиль' },
          ]).map((item) => (
            <button
              key={item.s}
              onClick={() => setScreen(item.s)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors ${
                screen === item.s ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Feed() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-display font-semibold mb-1">Лента</h2>
      <p className="text-muted-foreground mb-6">Те, кто ищет, и те, кто готов помочь</p>
      <div className="space-y-4">
        {FEED.map((post) => (
          <article key={post.id} className="bg-card rounded-2xl border border-border p-6 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-11 h-11">
                <AvatarImage src={post.avatar} className="object-cover" />
                <AvatarFallback>{post.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{post.name}</span>
                  <Stars value={post.rating} />
                </div>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              <RoleBadge role={post.role} />
            </div>
            <p
              className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
                post.role === 'mentor' ? 'text-mentor' : 'text-seeker'
              }`}
            >
              {post.tag}
            </p>
            <p className="text-foreground/90 leading-relaxed mb-4">{post.text}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full">
                <Icon name="MessageCircle" size={15} className="mr-1" /> Написать
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">
                <Icon name="Heart" size={15} className="mr-1" /> Откликнуться
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div className="animate-fade-in">
      <div className="bg-card rounded-3xl border border-border p-8 text-center mb-6">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={PROFILE.avatar} className="object-cover" />
          <AvatarFallback>{PROFILE.name[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-3xl font-display font-semibold">{PROFILE.name}</h2>
        <div className="flex items-center justify-center gap-3 mt-2 mb-3">
          <RoleBadge role={PROFILE.role} />
          <span className="inline-flex items-center gap-1 text-sm text-foreground/70">
            <Icon name="Star" size={15} className="text-primary fill-primary" />
            {PROFILE.rating} · {PROFILE.reviews} отзывов
          </span>
        </div>
        <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{PROFILE.bio}</p>
        <Button variant="outline" className="rounded-full mt-5">
          <Icon name="Pencil" size={15} className="mr-1" /> Редактировать
        </Button>
      </div>

      <div className="grid gap-6">
        <section className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-semibold flex items-center gap-2">
              <Icon name="Target" size={18} className="text-seeker" /> Мои цели
            </h3>
            <button className="text-sm text-primary font-medium">Добавить</button>
          </div>
          <ul className="space-y-2">
            {PROFILE.goals.map((g, i) => (
              <li key={i} className="flex items-center gap-3 text-foreground/90">
                <span className="w-1.5 h-1.5 rounded-full bg-seeker" /> {g}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-xl font-display font-semibold flex items-center gap-2 mb-4">
            <Icon name="Award" size={18} className="text-mentor" /> Достижения
          </h3>
          <div className="flex flex-wrap gap-2">
            {PROFILE.achievements.map((a, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground rounded-full px-3 py-1.5 text-sm"
              >
                <Icon name="Check" size={14} /> {a}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-xl font-display font-semibold flex items-center gap-2 mb-4">
            <Icon name="MessageSquareQuote" size={18} className="text-primary" /> Отзывы
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Андрей Соколов</span>
                <Stars value={5.0} />
              </div>
              <p className="text-sm text-muted-foreground">Очень мотивированная, схватывает на лету. Рекомендую.</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">Игорь Власов</span>
                <Stars value={4.5} />
              </div>
              <p className="text-sm text-muted-foreground">Ответственный подход, всегда на связи.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Goals({
  steps,
  toggleStep,
  progress,
  doneCount,
}: {
  steps: typeof initialSteps;
  toggleStep: (id: number) => void;
  progress: number;
  doneCount: number;
}) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-display font-semibold mb-1">Мои цели</h2>
      <p className="text-muted-foreground mb-6">Каждый выполненный шаг — это достижение</p>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-2xl font-semibold">Вернуться в маркетинг</h3>
          <span className="text-sm font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-6">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ul className="space-y-1">
          {steps.map((step) => (
            <li
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className="flex items-center gap-3 py-3 px-3 -mx-3 rounded-xl cursor-pointer hover:bg-muted/60 transition-colors"
            >
              <Checkbox checked={step.done} className="pointer-events-none" />
              <span className={step.done ? 'line-through text-muted-foreground' : 'text-foreground/90'}>
                {step.text}
              </span>
            </li>
          ))}
        </ul>

        {doneCount === steps.length && (
          <p className="text-center text-mentor font-medium mt-4">
            🎉 Цель достигнута! Она появится в ваших достижениях
          </p>
        )}
      </div>

      <Button variant="outline" className="w-full rounded-xl mt-4 h-12">
        <Icon name="Plus" size={18} className="mr-1" /> Создать новую цель
      </Button>
    </div>
  );
}

function Chat() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-display font-semibold mb-6">Сообщения</h2>

      <div className="space-y-2 mb-8">
        {CHATS.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 hover-lift cursor-pointer"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={c.avatar} className="object-cover" />
              <AvatarFallback>{c.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted-foreground truncate">{c.last}</p>
            </div>
            {c.unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {c.unread}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Avatar className="w-9 h-9">
            <AvatarImage src={AVATAR_MENTOR} className="object-cover" />
            <AvatarFallback>А</AvatarFallback>
          </Avatar>
          <span className="font-medium">Андрей Соколов</span>
        </div>
        <div className="p-4 space-y-3">
          {MESSAGES.map((m, i) => (
            <div key={i} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.mine
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 border-t border-border">
          <Input placeholder="Сообщение..." className="rounded-full h-11 border-0 bg-muted" />
          <Button size="icon" className="rounded-full h-11 w-11 shrink-0">
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AI({
  role,
  aiInput,
  setAiInput,
}: {
  role: Role;
  aiInput: string;
  setAiInput: (v: string) => void;
}) {
  const seekerPrompts = ['Сгенерируй идеи, чем мне заняться', 'Составь план на месяц', 'С чего начать обучение?'];
  const mentorPrompts = ['Помоги описать мой опыт', 'Сформулируй предложение для ленты', 'Как лучше вести ученика?'];
  const prompts = role === 'seeker' ? seekerPrompts : mentorPrompts;

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <Icon name="Sparkles" size={26} className="text-primary" />
        </div>
        <h2 className="text-3xl font-display font-semibold">AI-помощник</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {role === 'seeker'
            ? 'Поможет найти идеи и составить план движения вперёд'
            : 'Поможет описать ваш опыт и сформулировать предложения'}
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="bg-muted/60 rounded-xl p-4 mb-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            <span className="font-medium text-primary">AI: </span>
            {role === 'seeker'
              ? 'Привет! Расскажи, что тебя волнует, и я помогу превратить это в конкретные шаги и идеи.'
              : 'Привет! Расскажи о своём опыте, и я помогу красиво описать его, чтобы тебя нашли ученики.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => setAiInput(p)}
              className="text-sm bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <Textarea
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="Напишите свой запрос..."
          className="rounded-xl min-h-24 mb-3 resize-none"
        />
        <Button className="w-full rounded-xl h-12">
          <Icon name="Sparkles" size={18} className="mr-1" /> Сгенерировать
        </Button>
      </div>
    </div>
  );
}
