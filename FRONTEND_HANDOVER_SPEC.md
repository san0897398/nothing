# 프론트엔드 인계 명세서

## 프로젝트 개요
모바일 우선 학습 애플리케이션 - Nothing™ 브랜드 디자인 시스템 적용
- **목표**: Gemini 스타일 풀스크린 채팅 인터페이스 중심의 AI 학습 플랫폼
- **디자인 철학**: Nothing™ 미니멀리즘 + 모바일 터치 최적화
- **핵심 기능**: AI 채팅, 학습팩 관리, 진도 추적, 콘텐츠 스튜디오

## 기술 스택 및 아키텍처

### 프론트엔드 기술 스택
```
React 18 + TypeScript
Wouter (라우팅)
TanStack Query (서버 상태 관리)
Radix UI + shadcn/ui (컴포넌트)
Tailwind CSS (스타일링)
Vite (빌드 도구)
```

### 프로젝트 구조
```
client/src/
├── components/
│   ├── mobile/           # 모바일 최적화 컴포넌트
│   │   ├── ChatInterface.tsx    # 메인 채팅 UI
│   │   ├── NothingBottomNav.tsx # 하단 네비게이션
│   │   ├── MobileLayout.tsx     # 레이아웃 래퍼
│   │   └── NothingCard.tsx      # 카드 컴포넌트
│   └── ui/               # shadcn 기본 컴포넌트들
├── pages/
│   ├── Chat.tsx         # 메인 채팅 페이지
│   ├── Packs.tsx        # 학습팩 탐색
│   ├── Profile.tsx      # 사용자 프로필
│   └── Studio.tsx       # 콘텐츠 스튜디오
├── lib/
│   └── queryClient.ts   # API 클라이언트 설정
└── App.tsx              # 메인 앱 라우터
```

## 디자인 시스템

### Nothing™ 컬러 팔레트 (CSS 변수)
```css
:root {
  /* 메인 컬러 */
  --primary-900: 15 23 42;      /* 다크 베이스 */
  --primary-800: 30 41 59;      /* 미드 베이스 */
  --primary-700: 51 65 85;      /* 라이트 베이스 */
  
  /* 액센트 컬러 */
  --accent-purple: 139 92 246;   /* 메인 퍼플 */
  --accent-blue: 59 130 246;     /* 블루 */
  --accent-glow: 168 162 158;    /* 글로우 */
  --accent-success: 34 197 94;   /* 성공 */
  --accent-warning: 251 191 36;  /* 경고 */
}
```

### 타이포그래피
- **제목**: text-2xl ~ text-4xl, font-bold
- **본문**: text-base, font-medium
- **보조**: text-sm, text-xs
- **모바일 최적화**: 최소 16px 폰트 크기 (줌 방지)

### 컴포넌트 디자인 원칙
1. **그라데이션**: `bg-gradient-to-r from-accent-purple to-accent-blue`
2. **글래스모피즘**: `backdrop-blur-sm` + 투명도
3. **라운드**: `rounded-2xl` (카드), `rounded-xl` (버튼)
4. **그림자**: `shadow-lg shadow-accent-purple/30`
5. **트랜지션**: `transition-all duration-300`

## 주요 컴포넌트 상세

### 1. ChatInterface (메인 채팅)
**파일**: `client/src/components/mobile/ChatInterface.tsx`

**주요 기능**:
- 풀스크린 채팅 인터페이스
- 메시지 히스토리 무한 스크롤
- 파일 업로드 지원
- 실시간 타이핑 애니메이션
- 모바일 키보드 대응

**디자인 요구사항**:
- 상단: 고정 헤더 (타이틀 + 설정)
- 중앙: 스크롤 가능한 메시지 영역
- 하단: 입력창 + 전송버튼 (완전 수평 정렬 필수)
- 배경: 다크 그라데이션
- 말풍선: 사용자(우측), AI(좌측) 구분

### 2. NothingBottomNav (하단 네비게이션)
**파일**: `client/src/components/mobile/NothingBottomNav.tsx`

**주요 기능**:
- 4개 탭: Chat, Packs, Profile, Studio
- 스와이프 제스처 지원
- 액티브 상태 시각적 피드백

**디자인 요구사항**:
- 고정 하단 위치
- 글래스모피즘 배경
- 액티브 탭: accent-purple 컬러
- 아이콘 + 라벨 조합
- 터치 친화적 크기 (최소 48px)

### 3. NothingCard (재사용 카드)
**파일**: `client/src/components/mobile/NothingCard.tsx`

**구조**:
```typescript
interface NothingCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onTap?: () => void;
  className?: string;
}
```

**디자인**:
- 다크 배경 + 퍼플 보더
- 그라데이션 호버 효과
- 카드 내부 여백 일정하게

### 4. 페이지별 컴포넌트

#### Packs.tsx (학습팩 탐색)
- **인기 팩**: 가로 스크롤 카드 리스트 (w-48, 화면 밖 나가지 않게)
- **AI 추천**: 세로 리스트
- **카테고리**: 그리드 레이아웃
- **검색**: 상단 고정 검색바

#### Profile.tsx (프로필)
- **헤더**: 프로필 이미지 + 사용자 정보
- **통계**: 2열 그리드 카드
- **진도**: 프로그레스 바 ("마인드 업로딩" 스타일)
- **설정**: 토글 스위치

#### Studio.tsx (콘텐츠 스튜디오)
- **에디터**: 마크다운 기반
- **AI 어시스턴트**: 사이드 패널
- **미리보기**: 실시간 렌더링

## 모바일 최적화 요구사항

### 터치 인터페이스
- **최소 터치 영역**: 44px × 44px
- **스크롤**: 네이티브 스크롤 사용, 스크롤바 숨김
- **제스처**: 스와이프 네비게이션 지원
- **키보드**: 가상 키보드 대응 (safe-area-inset)

### 성능 최적화
- **이미지**: WebP 포맷, lazy loading
- **애니메이션**: 60fps 유지, 과도한 효과 금지
- **번들**: 코드 스플리팅 적용
- **캐싱**: TanStack Query로 서버 상태 캐싱

### 반응형 디자인
- **브레이크포인트**: 모바일 우선 (320px~)
- **텍스트**: 16px 이상 (iOS 줌 방지)
- **여백**: 터치 친화적 간격
- **네비게이션**: 하단 고정형

## API 연동

### 엔드포인트 목록
```
GET /api/auth/user          # 사용자 정보
GET /api/chat-messages      # 채팅 히스토리
POST /api/chat-messages     # 메시지 전송
GET /api/learning-packs     # 학습팩 목록
GET /api/user-progress      # 학습 진도
GET /api/user-activities    # 활동 로그
```

### TanStack Query 패턴
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['/api/endpoint'],
  queryFn: () => fetch('/api/endpoint').then(res => res.json())
});
```

## 이슈 및 주의사항

### 현재 알려진 문제
1. **학습팩 카드 오버플로우**: w-48로 제한하고 적절한 여백 필요
2. **채팅 입력창 정렬**: 좌측 아이콘과 전송 버튼 수직 정렬 필수
3. **과도한 애니메이션**: blur, glow 효과 최소화
4. **색상 대비**: 가독성 확보 위해 배경 어둡게

### 개발 시 주의사항
1. **모바일 우선**: 데스크톱은 2순위
2. **성능**: 60fps 애니메이션 유지
3. **접근성**: 터치 영역, 색상 대비 준수
4. **일관성**: Nothing™ 디자인 시스템 엄격히 준수

### 금지 사항
1. **과도한 글로우 효과**: 자연스러움 해침
2. **복잡한 애니메이션**: 성능 저하 원인
3. **작은 터치 영역**: 44px 미만 금지
4. **흰색 배경**: 눈부심 방지

## 다음 개발자를 위한 권장사항

1. **디자인 시스템 우선**: 새로운 컴포넌트보다 기존 시스템 활용
2. **모바일 테스트**: 실제 디바이스에서 확인 필수
3. **점진적 개선**: 한 번에 모든 것 바꾸지 말고 단계적 접근
4. **사용자 피드백**: 실제 사용성 검증 중요

## 참고 자료
- **디자인 레퍼런스**: Nothing Phone UI, Gemini Chat
- **컴포넌트 라이브러리**: shadcn/ui 문서
- **모바일 가이드라인**: iOS HIG, Material Design
- **성능 가이드**: React DevTools, Lighthouse