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

const AVATAR_MENTOR_DEMO = 'https://cdn.poehali.dev/projects/ea32a82f-3b6c-41de-bc3b-41c8574efbf5/files/57fe0b27-08a4-4487-bcc6-451ec43561be.jpg';
const AVATAR_SEEKER_DEMO = 'https://cdn.poehali.dev/projects/ea32a82f-3b6c-41de-bc3b-41c8574efbf5/files/4179292c-7e7a-409e-ad70-698a29e743a0.jpg';

type Post = { id: number; kind: 'post' | 'achievement' | 'goal'; time: string; text: string };
type Step = { id: number; text: string; done: boolean };
type Goal = { id: number; title: string; steps: Step[] };

const NAV: { s: Screen; icon: string; label: string }[] = [
  { s: 'profile', icon: 'User', label: 'Моя страница' },
  { s: 'feed', icon: 'Newspaper', label: 'Лента' },
  { s: 'goals', icon: 'Target', label: 'Цели' },
  { s: 'chat', icon: 'MessageCircle', label: 'Сообщения' },
  { s: 'ai', icon: 'Sparkles', label: 'AI-помощник' },
];

const DEMO_FEED = [
  { id: 1, role: 'mentor' as Role, name: 'Андрей Соколов', avatar: AVATAR_MENTOR_DEMO, time: '2 часа назад', tag: 'Я могу научить', text: 'Беру 2 человек в наставничество по продуктовому дизайну. Покажу процесс от идеи до релиза.', rating: 4.9 },
  { id: 2, role: 'seeker' as Role, name: 'Игорь Власов', avatar: AVATAR_SEEKER_DEMO, time: 'вчера', tag: 'Мне нужна помощь', text: 'Ищу наставника после 5 лет в найме. Хочу запустить своё дело, но не знаю с чего начать.', rating: 4.6 },
  { id: 3, role: 'mentor' as Role, name: 'Елена Новикова', avatar: AVATAR_MENTOR_DEMO, time: '3 дня назад', tag: 'Я могу включить в стартап', text: 'Запускаю EdTech-проект. Нужны мотивированные ребята. Научу всему по ходу дела.', rating: 5.0 },
];

const DEMO_CHATS = [
  { id: 1, name: 'Андрей Соколов', avatar: AVATAR_MENTOR_DEMO, last: 'Давай созвонимся завтра в 18:00', unread: 2 },
  { id: 2, name: 'Елена Новикова', avatar: AVATAR_MENTOR_DEMO, last: 'Скинула тебе материалы', unread: 0 },
];

function RoleBadge({ role }: { role: Role }) {
  return role === 'mentor' ? (
    <Badge className="bg-mentor/15 text-mentor hover:bg-mentor/15 border-0 rounded-full font-medium text-xs">Наставник</Badge>
  ) : (
    <Badge className="bg-seeker/15 text-seeker hover:bg-seeker/15 border-0 rounded-full font-medium text-xs">Ищущий</Badge>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-foreground/60">
      <Icon name="Star" size={13} className="text-primary fill-primary" />
      {value.toFixed(1)}
    </span>
  );
}

function now() {
  return new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

export default function Index() {
  const [onboardStep, setOnboardStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [firstGoalTitle, setFirstGoalTitle] = useState('');

  const [screen, setScreen] = useState<Screen>('profile');
  const [posts, setPosts] = useState<Post[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [editBio, setEditBio] = useState(false);
  const [draftBio, setDraftBio] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const onboardFileRef = useRef<HTMLInputElement>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(URL.createObjectURL(file));
  };

  const finishOnboard = () => {
    if (firstGoalTitle.trim()) {
      const newGoal: Goal = {
        id: Date.now(),
        title: firstGoalTitle.trim(),
        steps: [],
      };
      setGoals([newGoal]);
      setPosts([{ id: Date.now(), kind: 'goal', time: `Сегодня, ${now()}`, text: firstGoalTitle.trim() }]);
    }
    setOnboardStep(4);
  };

  const toggleStep = (goalId: number, stepId: number) => {
    setGoals((gs) =>
      gs.map((g) =>
        g.id === goalId
          ? { ...g, steps: g.steps.map((s) => (s.id === stepId ? { ...s, done: !s.done } : s)) }
          : g
      )
    );
  };

  const addStep = (goalId: number, text: string) => {
    setGoals((gs) =>
      gs.map((g) =>
        g.id === goalId
          ? { ...g, steps: [...g.steps, { id: Date.now(), text, done: false }] }
          : g
      )
    );
  };

  const addGoal = (title: string) => {
    const newGoal: Goal = { id: Date.now(), title, steps: [] };
    setGoals((g) => [...g, newGoal]);
    setPosts((p) => [{ id: Date.now(), kind: 'goal', time: `Сегодня, ${now()}`, text: title }, ...p]);
  };

  const addPost = (text: string) => {
    setPosts((p) => [{ id: Date.now(), kind: 'post', time: `Сегодня, ${now()}`, text }, ...p]);
  };

  const addAchievement = (text: string) => {
    setPosts((p) => [{ id: Date.now(), kind: 'achievement', time: `Сегодня, ${now()}`, text }, ...p]);
  };

  if (onboardStep < 4) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-5">
              <Icon name="Sparkles" size={22} className="text-primary" />
            </div>
            <h1 className="text-4xl font-display font-semibold">Второй шанс</h1>
            <p className="text-muted-foreground mt-2">Место, где находят себя и помогают другим</p>
          </div>

          <div className="flex gap-1.5 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= onboardStep ? 'bg-primary' : 'bg-border'}`}
              />
            ))}
          </div>

          <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
            {onboardStep === 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Шаг 1 из 4</p>
                <h2 className="text-2xl font-display font-semibold mb-1">Кто вы сегодня?</h2>
                <p className="text-sm text-muted-foreground mb-6">Выберите роль — её можно сменить позже</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {([
                    { r: 'seeker' as Role, icon: 'Compass', title: 'Ищущий', desc: 'Нужна поддержка, идеи, путь вперёд' },
                    { r: 'mentor' as Role, icon: 'HandHeart', title: 'Наставник', desc: 'Готов учить, помогать, включить в дело' },
                  ]).map((opt) => (
                    <button
                      key={opt.r}
                      onClick={() => setRole(opt.r)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all ${
                        role === opt.r ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-border/60'
                      }`}
                    >
                      <Icon name={opt.icon} size={22} className={role === opt.r ? 'text-primary' : 'text-foreground/50'} />
                      <p className="font-display text-lg font-semibold mt-3">{opt.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{opt.desc}</p>
                    </button>
                  ))}
                </div>
                <Button disabled={!role} onClick={() => setOnboardStep(1)} className="w-full h-12 rounded-xl">
                  Далее <Icon name="ArrowRight" size={17} className="ml-1" />
                </Button>
              </div>
            )}

            {onboardStep === 1 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Шаг 2 из 4</p>
                <h2 className="text-2xl font-display font-semibold mb-1">Ваши данные</h2>
                <p className="text-sm text-muted-foreground mb-6">Как вас будут видеть другие участники</p>

                <div
                  onClick={() => onboardFileRef.current?.click()}
                  className="relative w-24 h-24 mx-auto mb-5 cursor-pointer group"
                >
                  <div className={`w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-border flex items-center justify-center bg-muted/50 ${avatar ? 'border-solid border-primary' : ''}`}>
                    {avatar ? (
                      <img src={avatar} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Icon name="Camera" size={22} className="text-muted-foreground mx-auto" />
                        <p className="text-xs text-muted-foreground mt-1">Фото</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-2xl bg-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Icon name="Camera" size={20} className="text-white" />
                  </div>
                  <input ref={onboardFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e, setAvatar)} />
                </div>
                <p className="text-center text-xs text-muted-foreground mb-5">Нажмите, чтобы загрузить фото</p>

                <Input
                  placeholder="Ваше имя *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-3 h-12 rounded-xl"
                />
                <Input
                  placeholder="Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-5 h-12 rounded-xl"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOnboardStep(0)} className="h-12 rounded-xl px-4">
                    <Icon name="ArrowLeft" size={17} />
                  </Button>
                  <Button disabled={!name.trim() || !email.trim()} onClick={() => setOnboardStep(2)} className="flex-1 h-12 rounded-xl">
                    Далее <Icon name="ArrowRight" size={17} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {onboardStep === 2 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Шаг 3 из 4</p>
                <h2 className="text-2xl font-display font-semibold mb-1">Расскажите о себе</h2>
                <p className="text-sm text-muted-foreground mb-6">Пара слов — кто вы и что ищете. Можно заполнить позже.</p>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={
                    role === 'seeker'
                      ? 'Например: «Ищу своё направление после смены профессии. Интересует дизайн и маркетинг.»'
                      : 'Например: «10 лет в разработке, основал 2 стартапа. Готов передать опыт.»'
                  }
                  className="rounded-xl min-h-32 mb-5 resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOnboardStep(1)} className="h-12 rounded-xl px-4">
                    <Icon name="ArrowLeft" size={17} />
                  </Button>
                  <Button onClick={() => setOnboardStep(3)} className="flex-1 h-12 rounded-xl">
                    {bio.trim() ? 'Далее' : 'Пропустить'} <Icon name="ArrowRight" size={17} className="ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {onboardStep === 3 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">Шаг 4 из 4</p>
                <h2 className="text-2xl font-display font-semibold mb-1">Первая цель</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {role === 'seeker'
                    ? 'Что вы хотите достичь? Можно одной фразой.'
                    : 'Кому вы хотите помочь? Что готовы предложить?'}
                </p>
                <Input
                  placeholder={role === 'seeker' ? 'Например: Найти работу в дизайне' : 'Например: Взять 2 ученика в наставничество'}
                  value={firstGoalTitle}
                  onChange={(e) => setFirstGoalTitle(e.target.value)}
                  className="mb-5 h-12 rounded-xl"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setOnboardStep(2)} className="h-12 rounded-xl px-4">
                    <Icon name="ArrowLeft" size={17} />
                  </Button>
                  <Button onClick={finishOnboard} className="flex-1 h-12 rounded-xl">
                    {firstGoalTitle.trim() ? 'Начать путь 🚀' : 'Пропустить'} 
                  </Button>
                </div>
              </div>
            )}
          </div>

          {onboardStep === 0 && (
            <p className="text-center text-xs text-muted-foreground mt-5">
              Наставники проходят проверку по портфолио и отзывам
            </p>
          )}
        </div>
      </div>
    );
  }

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
                  screen === item.s ? 'bg-primary/10 text-primary' : 'text-foreground/70 hover:bg-muted'
                }`}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto flex items-center gap-3 px-3 pt-4 border-t border-border">
            <Avatar className="w-10 h-10 rounded-xl">
              {avatar ? (
                <AvatarImage src={avatar} className="object-cover" />
              ) : null}
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold">
                {name[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{name}</p>
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
              <ProfileScreen
                role={role!}
                name={name}
                avatar={avatar}
                setAvatar={setAvatar}
                bio={bio}
                setBio={setBio}
                editBio={editBio}
                setEditBio={setEditBio}
                draftBio={draftBio}
                setDraftBio={setDraftBio}
                posts={posts}
                addPost={addPost}
                fileRef={fileRef}
              />
            )}
            {screen === 'feed' && <FeedScreen role={role!} name={name} avatar={avatar} />}
            {screen === 'goals' && (
              <GoalsScreen goals={goals} addGoal={addGoal} toggleStep={toggleStep} addStep={addStep} addAchievement={addAchievement} />
            )}
            {screen === 'chat' && <ChatScreen />}
            {screen === 'ai' && <AIScreen role={role!} aiInput={aiInput} setAiInput={setAiInput} />}
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

function ProfileScreen({
  role, name, avatar, setAvatar, bio, setBio, editBio, setEditBio, draftBio, setDraftBio, posts, addPost, fileRef,
}: {
  role: Role; name: string; avatar: string; setAvatar: (v: string) => void;
  bio: string; setBio: (v: string) => void; editBio: boolean; setEditBio: (v: boolean) => void;
  draftBio: string; setDraftBio: (v: string) => void;
  posts: Post[]; addPost: (text: string) => void;
  fileRef: React.RefObject<HTMLInputElement>;
}) {
  const [newPost, setNewPost] = useState('');

  const publish = () => {
    if (!newPost.trim()) return;
    addPost(newPost.trim());
    setNewPost('');
  };

  return (
    <div className="animate-fade-in grid lg:grid-cols-[260px_1fr] gap-6 items-start">
      <div className="space-y-4 lg:sticky lg:top-6">
        <div className="bg-card rounded-2xl border border-border p-5 text-center">
          <div className="relative w-36 h-36 mx-auto group cursor-pointer" onClick={() => fileRef.current?.click()}>
            <div className={`w-36 h-36 rounded-2xl overflow-hidden ${avatar ? '' : 'border-2 border-dashed border-border bg-muted/50 flex items-center justify-center'}`}>
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover" />
              ) : (
                <div>
                  <Icon name="Camera" size={28} className="text-muted-foreground mx-auto" />
                  <p className="text-xs text-muted-foreground mt-1.5">Добавить фото</p>
                </div>
              )}
            </div>
            {avatar && (
              <div className="absolute inset-0 rounded-2xl bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Icon name="Camera" size={24} className="text-white" />
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatar(URL.createObjectURL(file));
              }}
            />
          </div>

          <h2 className="text-2xl font-display font-semibold mt-4">{name}</h2>
          <div className="flex items-center justify-center mt-1.5">
            <RoleBadge role={role} />
          </div>

          <Button variant="outline" size="sm" className="rounded-xl mt-4 w-full" onClick={() => fileRef.current?.click()}>
            <Icon name="Camera" size={14} className="mr-1.5" />
            {avatar ? 'Сменить фото' : 'Добавить фото'}
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">О себе</p>
            <button
              onClick={() => { setDraftBio(bio); setEditBio(!editBio); }}
              className="text-primary/80 hover:text-primary transition-colors"
            >
              <Icon name={editBio ? 'X' : 'Pencil'} size={15} />
            </button>
          </div>
          {editBio ? (
            <>
              <Textarea
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value)}
                className="rounded-xl text-sm min-h-28 mb-2 resize-none"
                autoFocus
              />
              <Button size="sm" className="w-full rounded-xl" onClick={() => { setBio(draftBio); setEditBio(false); }}>
                Сохранить
              </Button>
            </>
          ) : (
            bio.trim() ? (
              <p className="text-sm text-foreground/80 leading-relaxed">{bio}</p>
            ) : (
              <button
                onClick={() => { setDraftBio(''); setEditBio(true); }}
                className="w-full text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl py-4 hover:bg-muted/40 transition-colors"
              >
                <Icon name="Plus" size={16} className="inline mr-1.5" />
                Добавить описание
              </button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="bg-muted/40 rounded-2xl border border-dashed border-border p-8 text-center mb-2">
            <Icon name="PenLine" size={28} className="text-muted-foreground mx-auto mb-3" />
            <p className="font-medium text-foreground/70">Ваша лента пуста</p>
            <p className="text-sm text-muted-foreground mt-1">Напишите первый пост — расскажите о себе и своём пути</p>
          </div>
        )}

        <div className="bg-card rounded-2xl border border-border p-5">
          <div className="flex gap-3">
            <Avatar className="w-9 h-9 rounded-xl shrink-0">
              {avatar ? <AvatarImage src={avatar} className="object-cover" /> : null}
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                {name[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Что происходит в вашем пути?"
                className="rounded-xl min-h-16 resize-none border-0 bg-muted/50 focus-visible:ring-1 mb-3"
              />
              <div className="flex justify-end">
                <Button onClick={publish} disabled={!newPost.trim()} size="sm" className="rounded-xl">
                  <Icon name="Send" size={14} className="mr-1.5" /> Опубликовать
                </Button>
              </div>
            </div>
          </div>
        </div>

        {posts.map((p) => (
          <article key={p.id} className="bg-card rounded-2xl border border-border p-5 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-9 h-9 rounded-xl">
                {avatar ? <AvatarImage src={avatar} className="object-cover" /> : null}
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold text-sm">
                  {name[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{p.time}</p>
              </div>
            </div>

            {p.kind === 'achievement' && (
              <div className="flex items-start gap-3 bg-mentor/10 rounded-xl p-3">
                <Icon name="Award" size={19} className="text-mentor mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-mentor mb-0.5">Новое достижение</p>
                  <p className="text-foreground/90 text-sm">{p.text}</p>
                </div>
              </div>
            )}
            {p.kind === 'goal' && (
              <div className="flex items-start gap-3 bg-seeker/10 rounded-xl p-3">
                <Icon name="Target" size={19} className="text-seeker mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-seeker mb-0.5">Новая цель</p>
                  <p className="text-foreground/90 text-sm">{p.text}</p>
                </div>
              </div>
            )}
            {p.kind === 'post' && <p className="text-foreground/90 leading-relaxed text-sm">{p.text}</p>}

            <div className="flex gap-4 mt-3 pt-3 border-t border-border">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Heart" size={15} /> Поддержать
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function FeedScreen({ role, name, avatar }: { role: Role; name: string; avatar: string }) {
  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-3xl font-display font-semibold mb-1">Лента</h2>
      <p className="text-muted-foreground mb-6">Те, кто ищет, и те, кто готов помочь</p>
      <div className="space-y-4">
        {DEMO_FEED.map((post) => (
          <article key={post.id} className="bg-card rounded-2xl border border-border p-6 hover-lift">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10 rounded-xl">
                <AvatarImage src={post.avatar} className="object-cover" />
                <AvatarFallback>{post.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{post.name}</span>
                  <Stars value={post.rating} />
                </div>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              <RoleBadge role={post.role} />
            </div>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${post.role === 'mentor' ? 'text-mentor' : 'text-seeker'}`}>
              {post.tag}
            </p>
            <p className="text-foreground/90 leading-relaxed text-sm mb-4">{post.text}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="rounded-full text-xs">
                <Icon name="MessageCircle" size={14} className="mr-1" /> Написать
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full text-xs text-muted-foreground">
                <Icon name="Heart" size={14} className="mr-1" /> Откликнуться
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function GoalsScreen({
  goals, addGoal, toggleStep, addStep, addAchievement,
}: {
  goals: Goal[];
  addGoal: (title: string) => void;
  toggleStep: (goalId: number, stepId: number) => void;
  addStep: (goalId: number, text: string) => void;
  addAchievement: (text: string) => void;
}) {
  const [newGoalText, setNewGoalText] = useState('');
  const [newSteps, setNewSteps] = useState<Record<number, string>>({});
  const [achieveText, setAchieveText] = useState('');
  const [showAchieve, setShowAchieve] = useState(false);

  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-3xl font-display font-semibold mb-1">Мои цели</h2>
      <p className="text-muted-foreground mb-6">Каждый выполненный шаг — это ваше достижение</p>

      {goals.length === 0 ? (
        <div className="bg-muted/40 rounded-2xl border border-dashed border-border p-10 text-center mb-4">
          <Icon name="Target" size={30} className="text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground/70 mb-1">Целей пока нет</p>
          <p className="text-sm text-muted-foreground">Добавьте первую цель ниже</p>
        </div>
      ) : (
        <div className="space-y-4 mb-4">
          {goals.map((goal) => {
            const done = goal.steps.filter((s) => s.done).length;
            const pct = goal.steps.length ? Math.round((done / goal.steps.length) * 100) : 0;
            return (
              <div key={goal.id} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display text-xl font-semibold">{goal.title}</h3>
                  {goal.steps.length > 0 && <span className="text-sm font-medium text-primary">{pct}%</span>}
                </div>
                {goal.steps.length > 0 && (
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-4">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                )}
                <ul className="space-y-1 mb-4">
                  {goal.steps.map((step) => (
                    <li
                      key={step.id}
                      onClick={() => toggleStep(goal.id, step.id)}
                      className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox checked={step.done} className="pointer-events-none" />
                      <span className={`text-sm ${step.done ? 'line-through text-muted-foreground' : 'text-foreground/90'}`}>
                        {step.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Input
                    placeholder="Добавить шаг..."
                    value={newSteps[goal.id] || ''}
                    onChange={(e) => setNewSteps((s) => ({ ...s, [goal.id]: e.target.value }))}
                    className="h-9 rounded-xl text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSteps[goal.id]?.trim()) {
                        addStep(goal.id, newSteps[goal.id].trim());
                        setNewSteps((s) => ({ ...s, [goal.id]: '' }));
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl shrink-0"
                    disabled={!newSteps[goal.id]?.trim()}
                    onClick={() => {
                      if (newSteps[goal.id]?.trim()) {
                        addStep(goal.id, newSteps[goal.id].trim());
                        setNewSteps((s) => ({ ...s, [goal.id]: '' }));
                      }
                    }}
                  >
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border p-5 mb-4">
        <p className="font-medium mb-3 flex items-center gap-2 text-sm">
          <Icon name="Plus" size={16} className="text-primary" /> Новая цель
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Например: освоить веб-дизайн"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            className="h-11 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newGoalText.trim()) {
                addGoal(newGoalText.trim());
                setNewGoalText('');
              }
            }}
          />
          <Button
            className="rounded-xl shrink-0"
            disabled={!newGoalText.trim()}
            onClick={() => {
              if (newGoalText.trim()) {
                addGoal(newGoalText.trim());
                setNewGoalText('');
              }
            }}
          >
            Добавить
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-5">
        <button
          onClick={() => setShowAchieve(!showAchieve)}
          className="w-full flex items-center justify-between text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <Icon name="Award" size={16} className="text-mentor" /> Отметить достижение
          </span>
          <Icon name={showAchieve ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
        </button>
        {showAchieve && (
          <div className="mt-3 flex gap-2">
            <Input
              placeholder="Что вы сделали? Поделитесь!"
              value={achieveText}
              onChange={(e) => setAchieveText(e.target.value)}
              className="h-11 rounded-xl"
            />
            <Button
              className="rounded-xl shrink-0"
              disabled={!achieveText.trim()}
              onClick={() => {
                if (achieveText.trim()) {
                  addAchievement(achieveText.trim());
                  setAchieveText('');
                  setShowAchieve(false);
                }
              }}
            >
              <Icon name="Check" size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatScreen() {
  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState([
    { mine: false, text: 'Привет! Видел ваш профиль. Могу помочь с планом.' },
    { mine: true, text: 'Здравствуйте! Буду рад, спасибо что написали 🙏' },
    { mine: false, text: 'Давайте созвонимся, обсудим следующий шаг?' },
  ]);

  const send = () => {
    if (!msg.trim()) return;
    setMsgs((m) => [...m, { mine: true, text: msg.trim() }]);
    setMsg('');
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h2 className="text-3xl font-display font-semibold mb-6">Сообщения</h2>

      <div className="space-y-2 mb-6">
        {DEMO_CHATS.map((c) => (
          <div key={c.id} className="flex items-center gap-3 bg-card rounded-2xl border border-border p-4 hover-lift cursor-pointer">
            <Avatar className="w-11 h-11 rounded-xl">
              <AvatarImage src={c.avatar} className="object-cover" />
              <AvatarFallback>{c.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground truncate">{c.last}</p>
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
          <Avatar className="w-9 h-9 rounded-xl">
            <AvatarImage src={AVATAR_MENTOR_DEMO} className="object-cover" />
            <AvatarFallback>А</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">Андрей Соколов</span>
        </div>
        <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.mine ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted text-foreground rounded-bl-md'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 border-t border-border">
          <Input
            placeholder="Сообщение..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            className="rounded-full h-11 border-0 bg-muted"
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <Button size="icon" className="rounded-full h-11 w-11 shrink-0" onClick={send}>
            <Icon name="Send" size={17} />
          </Button>
        </div>
      </div>
    </div>
  );
}

function AIScreen({ role, aiInput, setAiInput }: { role: Role; aiInput: string; setAiInput: (v: string) => void }) {
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
        <p className="text-muted-foreground mt-2">
          {role === 'seeker' ? 'Поможет найти идеи и составить план движения вперёд' : 'Поможет описать опыт и сформулировать предложения'}
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="bg-muted/60 rounded-xl p-4 mb-4">
          <p className="text-sm text-foreground/80 leading-relaxed">
            <span className="font-medium text-primary">AI: </span>
            {role === 'seeker'
              ? 'Привет! Расскажи, что тебя волнует, и я помогу превратить это в конкретные шаги.'
              : 'Привет! Расскажи о своём опыте — помогу красиво описать его для учеников.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {prompts.map((p) => (
            <button key={p} onClick={() => setAiInput(p)} className="text-sm bg-secondary text-secondary-foreground rounded-full px-3 py-1.5 hover:bg-primary/10 transition-colors">
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
