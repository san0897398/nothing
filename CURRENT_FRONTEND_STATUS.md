# 현재 프론트엔드 인수인계 명세서

## 🚀 프로젝트 현황

### 구현 완료 상태
- ✅ **기본 아키텍처**: React 18 + TypeScript + Wouter + TanStack Query
- ✅ **인증 시스템**: OIDC 기반 로그인/로그아웃 완료
- ✅ **핵심 페이지**: 메인 채팅, 학습팩, 프로필, 스튜디오 4개 페이지
- ✅ **모바일 네비게이션**: 하단 탭 + 스와이프 제스처 지원
- ✅ **디자인 시스템**: Nothing™ 색상 팔레트 + 재사용 컴포넌트
- ✅ **채팅 인터페이스**: 실시간 메시지 + AI 응답 시스템

### 현재 이슈
- ⚠️ **백엔드 연동 오류**: 학습팩 ID 파싱 실패 (`[object Object]` → NaN)
- ⚠️ **UI 미세 정렬**: 일부 컴포넌트 정렬 및 오버플로우 문제
- ⚠️ **애니메이션 과다**: 부자연스러운 글로우/펄스 효과

## 📁 현재 파일 구조

```
client/src/
├── App.tsx                     # 메인 앱 + 라우터 설정
├── pages/
│   ├── Home.tsx               # 메인 채팅 페이지 (루트 경로)
│   ├── Landing.tsx            # 로그인 전 랜딩
│   ├── Packs.tsx             # 학습팩 탐색
│   ├── Profile.tsx           # 사용자 프로필 
│   ├── Studio.tsx            # 콘텐츠 스튜디오
│   └── not-found.tsx         # 404 페이지
├── components/mobile/
│   ├── ChatInterface.tsx     # 채팅 UI (핵심 컴포넌트)
│   ├── NothingBottomNav.tsx  # 하단 네비게이션
│   ├── MobileLayout.tsx      # 모바일 레이아웃 래퍼
│   └── NothingCard.tsx       # 재사용 카드 컴포넌트
├── hooks/
│   ├── use-auth.ts           # 인증 상태 관리
│   ├── use-swipe-gesture.ts  # 스와이프 제스처
│   └── use-toast.ts          # 토스트 알림
├── lib/
│   ├── queryClient.ts        # API 클라이언트
│   └── auth-utils.ts         # 인증 유틸리티
└── index.css                 # Nothing™ 글로벌 스타일
```

## 🎨 Nothing™ 디자인 시스템

### 색상 팔레트 (실제 구현)
```css
:root {
  /* Nothing™ Core Colors */
  --bg-primary: #0f0f23;        /* Deep Navy 메인 배경 */
  --bg-card: #1a1a3e;          /* 카드 배경 */
  --bg-input: #2d2d5f;         /* 입력창 배경 */
  --accent-purple: #8b5cf6;     /* 메인 퍼플 */
  --accent-blue: #a78bfa;       /* 라이트 퍼플 */
  --accent-glow: #c4b5fd;       /* 글로우 효과 */
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --border-subtle: rgba(139, 92, 246, 0.2);
  --nothing-glow: rgba(199, 181, 253, 0.4);
}
```

### 컴포넌트 스타일 가이드
```css
/* 카드 스타일 */
.nothing-card {
  @apply p-6 rounded-2xl border border-accent-purple/20;
  @apply bg-gradient-to-br from-primary-800 to-primary-700;
  @apply transition-all duration-300 hover:scale-[1.02];
}

/* 버튼 스타일 */
.nothing-button {
  @apply px-6 py-3 rounded-2xl font-medium;
  @apply bg-gradient-to-r from-accent-purple to-accent-blue;
  @apply hover:opacity-90 transition-colors duration-200;
}

/* 입력창 스타일 */
.nothing-input {
  @apply bg-primary-800 text-white placeholder-gray-400;
  @apply border border-accent-purple/20 rounded-2xl;
  @apply focus:ring-2 focus:ring-accent-purple/40;
}
```

## 🏗️ 주요 컴포넌트 분석

### 1. Home.tsx (메인 채팅 페이지)
```typescript
// 현재 구조
export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // 로딩 상태: Nothing™ 스타일 로더
  if (isLoading) return <LoadingScreen />;
  
  // 미인증: 자동 리다이렉트
  if (!isAuthenticated) return null;
  
  // 메인: ChatInterface 렌더링
  return (
    <MobileLayout>
      <ChatInterface />
    </MobileLayout>
  );
}
```

**특징**:
- 인증 상태에 따른 조건부 렌더링
- Nothing™ 브랜딩 로딩 화면
- MobileLayout으로 모바일 최적화

### 2. ChatInterface.tsx (핵심 컴포넌트)
```typescript
// 구조 개요
interface Message {
  id: number;
  message: string;
  role: 'user' | 'assistant';
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
}

function ChatInterface() {
  // 상태 관리
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [showFileInput, setShowFileInput] = useState(false);
  
  // API 연동
  const { data: chatHistory } = useQuery(['chat-messages']);
  const sendMessage = useMutation(/*...*/);
  
  return (
    <div className="flex flex-col h-screen">
      <MinimalHeader />                    {/* 상단 헤더 */}
      <MessageList messages={messages} />  {/* 메시지 영역 */}
      <ChatInput /*...*/ />               {/* 하단 입력창 */}
    </div>
  );
}
```

**기능**:
- 실시간 채팅 메시지 표시
- 파일 업로드 지원
- AI 응답 스트리밍 준비
- 무한 스크롤 히스토리

### 3. NothingBottomNav.tsx (네비게이션)
```typescript
const tabs = [
  { id: 'learn', icon: GraduationCap, label: '학습', path: '/' },
  { id: 'packs', icon: Package, label: '팩', path: '/packs' },
  { id: 'studio', icon: Palette, label: '스튜디오', path: '/studio' },
  { id: 'profile', icon: User, label: '프로필', path: '/profile' },
];

export function NothingBottomNav() {
  // 스와이프 제스처 지원
  const swipeRef = useSwipeGesture({
    onSwipeLeft: () => /* 다음 탭 */,
    onSwipeRight: () => /* 이전 탭 */,
  });
  
  return (
    <nav ref={swipeRef} className="fixed bottom-0 glassmorphism">
      {/* 4개 탭 렌더링 */}
    </nav>
  );
}
```

**특징**:
- 4개 메인 탭 구성
- 터치 스와이프 네비게이션
- 글래스모피즘 스타일
- 액티브 상태 시각적 피드백

### 4. NothingCard.tsx (재사용 컴포넌트)
```typescript
interface NothingCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  isActive?: boolean;
  isLoading?: boolean;
  onTap?: () => void;
  children?: ReactNode;
  className?: string;
}

export function NothingCard(props) {
  return (
    <div className="nothing-card">
      <div className="flex items-center space-x-4">
        {icon && <div className="text-accent-purple">{icon}</div>}
        <div className="flex-1">
          <h3 className="text-white font-semibold">{title}</h3>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
```

## 🔌 API 연동 현황

### 현재 연결된 엔드포인트
```typescript
// 정상 작동
GET /api/auth/user          ✅ 사용자 정보 조회
GET /api/chat-messages      ✅ 채팅 히스토리
POST /api/chat-messages     ✅ 메시지 전송
GET /api/user-progress      ✅ 학습 진도
GET /api/user-activities    ✅ 활동 로그

// 오류 발생
GET /api/learning-packs/:id ❌ ID 파싱 오류 (NaN)
```

### TanStack Query 패턴
```typescript
// 표준 패턴
const { data, isLoading, error } = useQuery({
  queryKey: ['/api/endpoint'],
  queryFn: () => fetch('/api/endpoint').then(res => res.json())
});

// 뮤테이션 패턴
const mutation = useMutation({
  mutationFn: (data) => apiRequest('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  onSuccess: () => {
    queryClient.invalidateQueries(['/api/endpoint']);
  }
});
```

## 📱 모바일 최적화 현황

### 구현된 기능
- ✅ **터치 친화적 UI**: 최소 48px 터치 영역
- ✅ **스와이프 제스처**: 탭 간 이동
- ✅ **반응형 디자인**: 320px부터 지원
- ✅ **가상 키보드 대응**: safe-area-inset 적용
- ✅ **모바일 폰트**: 16px 이상 (iOS 줌 방지)

### CSS 최적화
```css
/* 모바일 최적화 클래스 */
.mobile-text-base { font-size: 16px; }
.mobile-safe-area { padding-bottom: env(safe-area-inset-bottom); }
.scrollbar-hide { scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
```

## 🔥 현재 주요 이슈

### 1. 백엔드 연동 오류
```
Error: invalid input syntax for type integer: "NaN"
GET /api/learning-packs/[object%20Object] 500
```
**원인**: 프론트엔드에서 객체를 URL 파라미터로 전달
**해결방안**: ID 값 검증 및 문자열 변환 로직 추가

### 2. UI 정렬 문제
- 학습팩 카드 가로 오버플로우 (w-48로 임시 수정됨)
- 채팅 입력창 버튼 정렬 (수직 센터링 필요)

### 3. 애니메이션 과다
```css
/* 제거 필요한 효과들 */
.animate-pulse    /* 과도한 펄스 효과 */
.blur-xl         /* 부자연스러운 블러 */
.animate-bounce  /* 불필요한 바운스 */
```

## 🎯 다음 개발자를 위한 즉시 해결 과제

### 우선순위 1 (즉시)
1. **백엔드 API 파라미터 수정**: 학습팩 ID 전달 방식 개선
2. **채팅 입력창 정렬**: 좌측 아이콘과 전송 버튼 수직 센터링
3. **카드 오버플로우**: 학습팩 카드 크기 및 여백 조정

### 우선순위 2 (1-2일)
1. **애니메이션 정리**: 부자연스러운 효과 제거
2. **색상 대비 개선**: 가독성 향상
3. **로딩 상태 개선**: 스켈레톤 UI 적용

### 우선순위 3 (1주일)
1. **에러 핸들링**: 네트워크 오류 시 UI 개선
2. **성능 최적화**: 메모이제이션, 코드 스플리팅
3. **접근성**: ARIA 라벨, 키보드 네비게이션

## 🛠️ 개발 환경 설정

### 필수 명령어
```bash
# 개발 서버 시작
npm run dev

# 타입 체크
npm run type-check

# 린트
npm run lint

# 빌드
npm run build
```

### 환경 변수 (프론트엔드)
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_ENV=development
```

## 📋 코딩 컨벤션

### TypeScript 규칙
```typescript
// 컴포넌트 Props
interface ComponentProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  onAction?: () => void;
}

// 이벤트 핸들러
const handleClick = () => {
  // 액션
};

// 스타일 클래스
className={cn(
  "base-classes",
  condition && "conditional-classes",
  className
)}
```

### 파일 명명 규칙
- **컴포넌트**: PascalCase (ChatInterface.tsx)
- **훅**: camelCase (use-auth.ts)
- **유틸리티**: kebab-case (auth-utils.ts)
- **페이지**: PascalCase (Home.tsx)

## 🚀 배포 및 성능

### 현재 번들 크기
- **메인 청크**: ~150KB (gzipped)
- **벤더 청크**: ~200KB (React, React Query 등)
- **총 로드 시간**: ~2초 (3G 기준)

### 최적화 적용사항
- ✅ **Tree shaking**: 사용하지 않는 코드 제거
- ✅ **Code splitting**: 페이지별 청크 분리
- ✅ **Asset compression**: Gzip 압축
- ⚠️ **Image optimization**: WebP 변환 필요

## 💡 권장 개발 접근법

### 1단계: 이슈 해결
먼저 현재 발생중인 3가지 주요 이슈 해결

### 2단계: 점진적 개선
기존 구조를 유지하면서 UI/UX 개선

### 3단계: 성능 최적화
메모리 누수, 렌더링 최적화, 번들 크기 개선

### 4단계: 기능 확장
실시간 채팅, 파일 업로드, 오프라인 지원

## 🔍 디버깅 팁

### 개발자 도구 활용
```javascript
// React DevTools 확장프로그램 필수
// TanStack Query DevTools 자동 활성화
// Lighthouse 성능 측정 권장
```

### 일반적 이슈 해결
1. **리렌더링 과다**: React.memo, useMemo 적용
2. **상태 동기화**: useEffect 의존성 배열 확인
3. **API 호출 중복**: TanStack Query 캐시 확인
4. **스타일 깨짐**: Tailwind purge 설정 확인

이 명세서를 통해 새로운 개발자가 빠르게 프로젝트 상황을 파악하고 작업을 이어갈 수 있습니다.