import { useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

type Role = 'seeker' | 'mentor';
type Screen = 'profile' | 'feed' | 'goals' | 'chat' | 'ai';

const AVATAR_SEEKER = 'https://cdn.poehali.dev/projects/ea32a82f-3b6c-41de-bc3b-41c8574efbf5/files/4179292c-7e7a-409e-ad70-698a29e743a0.jpg';
const AVATAR_MENTOR = 'https://cdn.poehali.dev/projects/ea32a82f-3b6c-41de-bc3b-41c8574efbf5/files/57fe0b27-08a4-4487-bcc6-451ec43561be.jpg';

type Post = {
  id: number;
  kind: 'post' | 'achievement' | 'goal';
  time: string;
  text: string;
};

const initialPosts: Post[] = [
  { id: 1, kind: 'post', time: 'Сегодня, 10:24', text: 'Сегодня решилась написать первому наставнику. Страшно, но я двигаюсь вперёд. Кажется, это и есть мой второй шанс.' },
  { id: 2, kind: 'achievement', time: 'Вчера, 19:00', text: 'Получила первый отклик работодателя' },
  { id: 3, kind: 'goal', time: '2 дня назад', text: 'Новая цель: собрать первое портфолио' },
  { id: 4, kind: 'post', time: '3 дня назад', text: 'Закончила курс по основам SMM. Голова кругом от новой информации, но я горжусь собой.' },
];

const FEED = [
  { id: 1, role: 'mentor' as Role, name: 'Андрей Соколов', avatar: AVATAR_MENTOR, time: '2 часа назад', tag: 'Я могу научить', text: 'Беру 2 человек в наставничество по продуктовому дизайну. Покажу процесс от идеи до релиза, дам реальные задачи из своего стартапа.', rating: 4.9 },
  { id: 2, role: 'seeker' as Role, name: 'Мария Лебедева', avatar: AVATAR_SEEKER, time: '4 часа назад', tag: 'Мне нужна помощь', text: 'Ищу человека, который поможет вернуться в профессию после декрета. Раньше работала в маркетинге, хочу разобраться, с чего начать сегодня.', rating: 4.7 },
  { id: 3, role: 'mentor' as Role, name: 'Игорь Власов', avatar: AVATAR_MENTOR, time: 'вчера', tag: 'Я могу включить в стартап', text: 'Запускаю проект в сфере EdTech. Нужны мотивированные ребята без опыта, но с горящими глазами. Научу всему по ходу дела.', rating: 5.0 },
];

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

const NAV: { s: Screen; icon: string; label: string }[] = [
  { s: 'profile', icon: 'User', label: 'Моя страница' },
  { s: 'feed', icon: 'Newspaper', label: 'Лента' },
  { s: 'goals', icon: 'Target', label: 'Цели' },
  { s: 'chat', icon: 'MessageCircle', label: 'Сообщения' },
  { s: 'ai', icon: 'Sparkles', label: 'AI-помощник' },
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
  const [screen, setScreen] = useState<Screen>('profile');
  const [steps, setSteps] = useState(initialSteps);
  const [aiInput, setAiInput] = useState('');

  const [avatar, setAvatar] = useState<string>(AVATAR_SEEKER);
  const [bio, setBio] = useState('Возвращаюсь к себе после паузы. Ищу направление, поддержку и людей, которым по пути.');
  const [posts, setPosts] = useState<Post[]>(initialPosts);

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

  const displayName = name.trim() || 'Мария Лебедева';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto flex">
        <aside className="hidden md:flex flex-col sticky top-0 h-screen w-64 shrink-0 border-r border-border px-4 py-6">
          <div className="flex items-center gap-2 px-3 mb-8">
            <Icon name="Sparkles" size={22} className="text-primary" />
            <span className="font-display text-2xl font-semibold">Второй шанс</span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <button
                key={item.s}
                onClick={() => setScreen(item.s)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${
                  screen === item.s
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
                {item.s === 'chat' && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    2
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 px-3 pt-4 border-t border-border">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatar} className="object-cover" />
              <AvatarFallback>{displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground">{role === 'mentor' ? 'Наставник' : 'Ищущий'}</p>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <header className="md:hidden sticky top-0 z-20 bg-background/85 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <span className="font-display text-xl font-semibold">Второй шанс</span>
          </header>

          <main className="px-4 sm:px-8 py-8 pb-28 md:pb-8">
            {screen === 'profile' && (
              <Profile
                role={role!}
                name={displayName}
                avatar={avatar}
                setAvatar={setAvatar}
                bio={bio}
                setBio={setBio}
                posts={posts}
                setPosts={setPosts}
              />
            )}
            {screen === 'feed' && <Feed />}
            {screen === 'goals' && (
              <Goals steps={steps} toggleStep={toggleStep} progress={progress} doneCount={doneCount} />
            )}
            {screen === 'chat' && <Chat />}
            {screen === 'ai' && <AI role={role!} aiInput={aiInput} setAiInput={setAiInput} />}
          </main>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-background/90 backdrop-blur-md border-t border-border">
        <div className="px-2 py-2 grid grid-cols-5">
          {NAV.map((item) => (
            <button
              key={item.s}
              onClick={() => setScreen(item.s)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 transition-colors ${
                screen === item.s ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Profile({
  role,
  name,
  avatar,
  setAvatar,
  bio,
  setBio,
  posts,
  setPosts,
}: {
  role: Role;
  name: string;
  avatar: string;
  setAvatar: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  posts: Post[];
  setPosts: (v: Post[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [editBio, setEditBio] = useState(false);
  const [draft, setDraft] = useState(bio);
  const [newPost, setNewPost] = useState('');

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const publish = () => {
    if (!newPost.trim()) return;
    setPosts([{ id: Date.now(), kind: 'post', time: 'Только что', text: newPost.trim() }, ...posts]);
    setNewPost('');
  };

  return (
    <div className="animate-fade-in grid lg:grid-cols-[260px_1fr] gap-6 items-start">
      <div className="space-y-4 lg:sticky lg:top-6">
        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="relative w-fit mx-auto group">
            <Avatar className="w-40 h-40 rounded-2xl">
              <AvatarImage src={avatar} className="object-cover" />
              <AvatarFallback className="rounded-2xl text-3xl">{name[0]}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 rounded-2xl bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-primary-foreground"
            >
              <Icon name="Camera" size={26} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>

          <h2 className="text-2xl font-display font-semibold text-center mt-4">{name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <RoleBadge role={role} />
            <Stars value={4.7} />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl mt-4"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="Camera" size={15} className="mr-1.5" /> Сменить фото
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-muted-foreground">О себе</p>
            <button onClick={() => { setDraft(bio); setEditBio(!editBio); }} className="text-primary">
              <Icon name={editBio ? 'X' : 'Pencil'} size={15} />
            </button>
          </div>
          {editBio ? (
            <div>
              <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} className="rounded-xl text-sm min-h-24 mb-2" />
              <Button size="sm" className="w-full rounded-xl" onClick={() => { setBio(draft); setEditBio(false); }}>
                Сохранить
              </Button>
            </div>
          ) : (
            <p className="text-sm text-foreground/80 leading-relaxed">{bio}</p>
          )}
        </div>

        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <Icon name="Award" size={15} className="text-mentor" /> Достижения
          </p>
          <div className="flex flex-wrap gap-2">
            {['Курс по SMM', '3 проекта', 'Первый отклик'].map((a) => (
              <span key={a} className="inline-flex items-center gap-1 bg-accent text-accent-foreground rounded-full px-2.5 py-1 text-xs">
                <Icon name="Check" size={12} /> {a}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
            <Icon name="Target" size={15} className="text-seeker" /> Цели
          </p>
          <ul className="space-y-2 text-sm">
            {['Найти наставника', 'Собрать портфолио', 'Получить оффер'].map((g) => (
              <li key={g} className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-seeker shrink-0" /> {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="font-medium mb-3 flex items-center gap-2">
            <Icon name="PenLine" size={17} className="text-primary" /> Мой блог
          </p>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Расскажите о себе, своём пути или новом достижении..."
            className="rounded-xl min-h-20 resize-none mb-3"
          />
          <div className="flex justify-end">
            <Button onClick={publish} disabled={!newPost.trim()} className="rounded-xl">
              <Icon name="Send" size={15} className="mr-1.5" /> Опубликовать
            </Button>
          </div>
        </div>

        {posts.map((p) => (
          <article key={p.id} className="bg-card rounded-2xl border border-border p-5 hover-lift">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={avatar} className="object-cover" />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{p.time}</p>
              </div>
            </div>

            {p.kind === 'achievement' && (
              <div className="flex items-start gap-3 bg-mentor/10 rounded-xl p-3 mb-1">
                <Icon name="Award" size={20} className="text-mentor mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mentor mb-0.5">Новое достижение</p>
                  <p className="text-foreground/90">{p.text}</p>
                </div>
              </div>
            )}
            {p.kind === 'goal' && (
              <div className="flex items-start gap-3 bg-seeker/10 rounded-xl p-3 mb-1">
                <Icon name="Target" size={20} className="text-seeker mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-seeker mb-0.5">Новая цель</p>
                  <p className="text-foreground/90">{p.text}</p>
                </div>
              </div>
            )}
            {p.kind === 'post' && <p className="text-foreground/90 leading-relaxed">{p.text}</p>}

            <div className="flex gap-4 mt-3 pt-3 border-t border-border text-muted-foreground text-sm">
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Icon name="Heart" size={16} /> 12
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={16} /> 3
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Feed() {
  return (
    <div className="animate-fade-in max-w-2xl">
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
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-3xl font-display font-semibold mb-1">Мои цели</h2>
      <p className="text-muted-foreground mb-6">Каждый выполненный шаг — это достижение</p>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-2xl font-semibold">Вернуться в маркетинг</h3>
          <span className="text-sm font-medium text-primary">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden mb-6">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
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
    <div className="animate-fade-in max-w-2xl">
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
    <div className="animate-fade-in max-w-2xl">
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
