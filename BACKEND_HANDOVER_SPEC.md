# 백엔드 인계 명세서

## 프로젝트 개요
모바일 학습 플랫폼의 백엔드 API 서버
- **역할**: 사용자 인증, 데이터 관리, AI 서비스 연동
- **아키텍처**: Express.js + PostgreSQL + OpenAI API
- **배포환경**: Replit (Node.js 환경)

## 기술 스택

### 백엔드 기술 스택
```
Node.js + Express.js
TypeScript
PostgreSQL (Neon 서버리스)
Drizzle ORM
Passport.js (OIDC 인증)
OpenAI API (GPT-4o)
```

### 프로젝트 구조
```
server/
├── index.ts           # 메인 서버 엔트리포인트
├── routes.ts          # API 라우트 정의
├── storage.ts         # 데이터베이스 인터페이스
├── auth.ts           # 인증 미들웨어
└── vite.ts           # Vite 개발서버 설정

shared/
└── schema.ts         # 데이터베이스 스키마 (Drizzle)
```

## 데이터베이스 스키마

### 현재 테이블 구조
```typescript
// users 테이블
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  profileImageUrl: text('profile_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// learning_packs 테이블
export const learningPacks = pgTable('learning_packs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  duration: integer('duration').notNull(),
  rating: real('rating').default(0),
  content: json('content'),
  createdAt: timestamp('created_at').defaultNow(),
});

// user_progress 테이블
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  packId: integer('pack_id').references(() => learningPacks.id),
  progress: integer('progress').default(0),
  completed: boolean('completed').default(false),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// chat_messages 테이블
export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  message: text('message').notNull(),
  response: text('response'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// user_activities 테이블
export const userActivities = pgTable('user_activities', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  activityType: text('activity_type').notNull(),
  description: text('description'),
  timestamp: timestamp('timestamp').defaultNow(),
});
```

### 관계 정의
```typescript
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  chatMessages: many(chatMessages),
  activities: many(userActivities),
}));

export const learningPacksRelations = relations(learningPacks, ({ many }) => ({
  userProgress: many(userProgress),
}));
```

## API 엔드포인트

### 인증 관련
```
GET  /api/auth/user           # 현재 사용자 정보
POST /api/auth/login          # OIDC 로그인
POST /api/auth/logout         # 로그아웃
```

### 채팅 관련
```
GET  /api/chat-messages       # 채팅 히스토리 조회
POST /api/chat-messages       # 새 메시지 전송 (AI 응답 포함)
```

### 학습팩 관련
```
GET  /api/learning-packs      # 학습팩 목록
GET  /api/learning-packs/:id  # 특정 학습팩 상세
POST /api/learning-packs      # 새 학습팩 생성
PUT  /api/learning-packs/:id  # 학습팩 수정
```

### 사용자 진도 관리
```
GET  /api/user-progress       # 사용자 학습 진도
POST /api/user-progress       # 진도 업데이트
GET  /api/user-activities     # 사용자 활동 로그
```

## 환경 변수

### 필수 환경 변수
```bash
# 데이터베이스
DATABASE_URL=postgresql://...

# 세션 관리
SESSION_SECRET=random_secret_key

# OpenAI API
OPENAI_API_KEY=sk-...

# OIDC 인증 (Replit)
OIDC_CLIENT_ID=...
OIDC_CLIENT_SECRET=...
OIDC_ISSUER=https://replit.com
```

### 개발 환경 설정
```bash
NODE_ENV=development
PORT=5000
```

## 인증 시스템

### OIDC 설정 (Passport.js)
```typescript
passport.use('oidc', new Strategy({
  issuer: process.env.OIDC_ISSUER,
  clientID: process.env.OIDC_CLIENT_ID,
  clientSecret: process.env.OIDC_CLIENT_SECRET,
  callbackURL: '/api/auth/callback',
  scope: 'openid profile email'
}, async (tokenset, userinfo, done) => {
  // 사용자 정보 처리 로직
}));
```

### 세션 관리
```typescript
app.use(session({
  store: new ConnectPgSimple(session)({
    pool: db, // PostgreSQL 연결
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24시간
  }
}));
```

## AI 서비스 연동

### OpenAI 설정
```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 채팅 응답 생성
async function generateChatResponse(message: string, context?: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "당신은 Nothing™ 학습 플랫폼의 AI 어시스턴트입니다..."
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content;
}
```

### 스트리밍 응답 (향후 구현)
```typescript
// 실시간 스트리밍 채팅을 위한 WebSocket 준비
// WebSocket 서버 설정 필요
```

## 데이터베이스 운영

### 마이그레이션
```bash
# 스키마 변경 적용
npm run db:push

# 강제 푸시 (데이터 손실 위험)
npm run db:push --force
```

### 시드 데이터 생성
```typescript
// 개발용 학습팩 샘플 데이터
const samplePacks = [
  {
    title: "JavaScript 기초",
    description: "프로그래밍 입문자를 위한 JavaScript 기본 문법",
    category: "programming",
    difficulty: "beginner",
    duration: 30,
    rating: 4.5,
  },
  // ... 더 많은 샘플 데이터
];
```

## 현재 이슈 및 해결 필요사항

### 알려진 버그
1. **학습팩 ID 파싱 오류**
   ```
   Error: invalid input syntax for type integer: "NaN"
   at getLearningPack (storage.ts:124)
   ```
   - 원인: URL 파라미터 타입 변환 실패
   - 해결방안: 파라미터 유효성 검증 강화

2. **세션 만료 처리**
   - 401 Unauthorized 응답 시 프론트엔드 리다이렉트 필요
   - 자동 재로그인 메커니즘 구현 권장

### 성능 최적화 필요사항
1. **데이터베이스 쿼리 최적화**
   - 학습팩 목록 조회 시 페이지네이션 적용
   - 채팅 히스토리 무한 스크롤 구현

2. **캐싱 전략**
   - Redis 도입 검토 (현재 메모리 캐싱만 사용)
   - 자주 조회되는 학습팩 데이터 캐싱

3. **API 응답 최적화**
   - 불필요한 데이터 제거
   - 압축 미들웨어 적용

## 보안 고려사항

### 현재 보안 설정
1. **CORS 설정**: 개발 환경에서는 모든 origin 허용
2. **세션 보안**: HTTPS 환경에서 secure cookie 사용
3. **API 키 보안**: 환경 변수로 관리
4. **입력 검증**: Zod 스키마로 요청 데이터 검증

### 강화 필요사항
1. **Rate Limiting**: API 호출 제한
2. **입력 Sanitization**: XSS 방지
3. **SQL Injection 방지**: Drizzle ORM 사용으로 어느 정도 보호됨
4. **로깅**: 보안 이벤트 로깅 시스템

## 모니터링 및 로깅

### 현재 로깅
```typescript
// Express 요청 로깅
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 에러 로깅
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});
```

### 개선 권장사항
1. **구조화된 로깅**: Winston 또는 Pino 도입
2. **에러 추적**: Sentry 연동
3. **성능 모니터링**: 응답 시간, 메모리 사용량 추적
4. **비즈니스 메트릭**: 학습 완료율, 사용자 활동 통계

## 배포 및 운영

### Replit 환경 설정
```bash
# 서버 시작 명령어
npm run dev

# 포트 설정
PORT=5000 (프론트엔드와 통합)
```

### 환경별 설정
```typescript
const config = {
  development: {
    cors: { origin: true },
    logging: true,
  },
  production: {
    cors: { origin: process.env.FRONTEND_URL },
    logging: false,
  }
};
```

## 향후 개발 로드맵

### 단기 목표 (1-2주)
1. **버그 수정**: 학습팩 ID 파싱 오류 해결
2. **API 안정화**: 에러 핸들링 개선
3. **성능 최적화**: 데이터베이스 쿼리 최적화

### 중기 목표 (1개월)
1. **실시간 기능**: WebSocket으로 채팅 스트리밍
2. **파일 업로드**: 학습 자료 업로드 기능
3. **알림 시스템**: 학습 리마인더, 성취 알림

### 장기 목표 (3개월)
1. **확장성**: 마이크로서비스 아키텍처 검토
2. **AI 고도화**: 개인화된 학습 추천 알고리즘
3. **분석 기능**: 학습 패턴 분석 대시보드

## 개발자 가이드

### 로컬 개발 환경 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 데이터베이스 스키마 적용
npm run db:push

# 개발 서버 시작
npm run dev
```

### 코딩 컨벤션
1. **TypeScript 엄격 모드** 사용
2. **함수형 프로그래밍** 스타일 선호
3. **에러 핸들링** 모든 API에서 일관된 형태
4. **타입 안전성** Drizzle + Zod로 타입 보장

### 테스트 권장사항
1. **유닛 테스트**: Jest + Supertest
2. **통합 테스트**: API 엔드포인트 테스트
3. **부하 테스트**: Artillery 또는 k6 사용
4. **보안 테스트**: OWASP 체크리스트 준수