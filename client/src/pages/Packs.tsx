import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { NothingCard } from '@/components/mobile/NothingCard';
import { Search, Filter, Clock, Signal, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for popular packs
const popularPacks = [
  {
    id: 'popular-1',
    title: 'JavaScript 기초',
    description: '웹 개발의 핵심 언어 배우기',
    category: 'javascript',
    duration: 45,
    rating: 4.8,
  },
  {
    id: 'popular-2', 
    title: 'React 입문',
    description: '모던 웹 앱 개발하기',
    category: 'react',
    duration: 60,
    rating: 4.7,
  },
  {
    id: 'popular-3',
    title: 'UI/UX 디자인',
    description: '사용자 경험 디자인 원리',
    category: 'design',
    duration: 40,
    rating: 4.6,
  }
];

// Mock data for recommended packs
const recommendedPacks = [
  {
    id: 'rec-1',
    title: 'TypeScript 심화',
    description: '타입 안전성으로 더 견고한 코드 작성',
    category: 'javascript',
    duration: 55,
    difficulty: '중급',
    matchRate: 95,
    reason: '최근 JavaScript 학습 이력 기반 추천'
  },
  {
    id: 'rec-2',
    title: 'Python 데이터 분석',
    description: 'pandas, matplotlib으로 데이터 시각화',
    category: 'data',
    duration: 70,
    difficulty: '중급', 
    matchRate: 88,
    reason: '프로그래밍 실력 향상을 위한 맞춤 추천'
  }
];

const categories = [
  { id: 'all', label: '전체', icon: '📚' },
  { id: 'javascript', label: 'JavaScript', icon: '💻' },
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'react', label: 'React', icon: '⚛️' },
  { id: 'design', label: '디자인', icon: '🎨' },
  { id: 'data', label: '데이터', icon: '📊' },
];

const difficulties = [
  { id: 'all', label: '전체' },
  { id: 'beginner', label: '초급' },
  { id: 'intermediate', label: '중급' },
  { id: 'advanced', label: '고급' },
];

export default function Packs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data: packs = [], isLoading } = useQuery({
    queryKey: ['/api/learning-packs', {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      difficulty: selectedDifficulty === 'all' ? undefined : selectedDifficulty,
      search: searchTerm || undefined,
      limit: 50,
    }],
  });

  const filteredPacks = Array.isArray(packs) ? packs : [];

  return (
    <MobileLayout>
      {/* Header */}
      <section className="px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">학습 팩</h1>
          <p className="text-gray-400 text-sm">
            다양한 주제의 학습 콘텐츠를 탐색해보세요
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            size={20} 
          />
          <input
            type="text"
            placeholder="학습 팩 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base"
            style={{ fontSize: '16px' }}
            data-testid="input-search"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors",
              showFilters ? "bg-accent-purple text-white" : "text-gray-400 hover:bg-accent-purple/20"
            )}
            data-testid="button-filter"
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-4 mb-6 animate-in slide-in-from-top duration-300">
            {/* Categories */}
            <div>
              <p className="text-white text-sm font-medium mb-3">카테고리</p>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                      selectedCategory === category.id
                        ? "bg-accent-purple text-white"
                        : "bg-primary-700 text-gray-300 hover:bg-primary-600"
                    )}
                    data-testid={`filter-category-${category.id}`}
                  >
                    <span>{category.icon}</span>
                    <span className="text-sm">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-white text-sm font-medium mb-3">난이도</p>
              <div className="flex space-x-2">
                {difficulties.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm transition-colors",
                      selectedDifficulty === difficulty.id
                        ? "bg-accent-blue text-white"
                        : "bg-primary-700 text-gray-300 hover:bg-primary-600"
                    )}
                    data-testid={`filter-difficulty-${difficulty.id}`}
                  >
                    {difficulty.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Featured Sections */}
      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center">
          <Star className="mr-2 text-accent-warning" size={20} />
          인기 학습팩
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {popularPacks.map((pack) => (
            <div key={pack.id} className="flex-shrink-0 w-64">
              <NothingCard
                title={pack.title}
                subtitle={pack.description}
                icon={<span className="text-lg">{getPackIcon(pack.category)}</span>}
                onTap={() => console.log('Popular pack selected:', pack.id)}
                data-testid={`popular-pack-${pack.id}`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Clock size={10} className="mr-1" />
                    {pack.duration}분
                  </span>
                  <span className="flex items-center text-accent-warning">
                    <Star size={10} className="mr-1" />
                    {pack.rating}
                  </span>
                </div>
              </NothingCard>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold text-lg mb-4 flex items-center">
          <Sparkles className="mr-2 text-accent-purple" size={20} />
          AI 맞춤 추천
        </h2>
        <div className="space-y-3">
          {recommendedPacks.map((pack) => (
            <NothingCard
              key={pack.id}
              title={pack.title}
              subtitle={pack.description}
              icon={<span className="text-lg">{getPackIcon(pack.category)}</span>}
              onTap={() => console.log('Recommended pack selected:', pack.id)}
              data-testid={`recommended-pack-${pack.id}`}
            >
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {pack.duration}분
                </span>
                <span className="flex items-center">
                  <Signal size={12} className="mr-1" />
                  {pack.difficulty}
                </span>
                <span className="text-accent-purple">
                  {pack.matchRate}% 매치
                </span>
              </div>
              <p className="text-xs text-accent-purple/70">{pack.reason}</p>
            </NothingCard>
          ))}
        </div>
      </section>

      {/* All Packs List */}
      <section className="px-4 pb-8">
        <h2 className="text-white font-semibold text-lg mb-4">모든 학습팩</h2>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index}
                className="nothing-card rounded-2xl p-6 animate-pulse"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-xl"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-primary-600 rounded w-3/4"></div>
                    <div className="h-3 bg-primary-600 rounded w-full"></div>
                    <div className="flex space-x-4">
                      <div className="h-3 bg-primary-600 rounded w-16"></div>
                      <div className="h-3 bg-primary-600 rounded w-16"></div>
                      <div className="h-3 bg-primary-600 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPacks.length > 0 ? (
          <div className="space-y-4">
            {filteredPacks.map((pack: any) => (
              <NothingCard
                key={pack.id}
                title={pack.title}
                subtitle={pack.description}
                icon={<span className="text-2xl">{getPackIcon(pack.category)}</span>}
                onTap={() => {
                  // TODO: Navigate to pack detail
                  console.log('Pack selected:', pack.id);
                }}
                data-testid={`pack-${pack.id}`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="flex items-center">
                    <Clock size={12} className="mr-1" />
                    {pack.duration || 30}분
                  </span>
                  <span className="flex items-center">
                    <Signal size={12} className="mr-1" />
                    {pack.difficulty || '중급'}
                  </span>
                  <span className="flex items-center">
                    <Star size={12} className="mr-1" />
                    {pack.rating ? (pack.rating / 10).toFixed(1) : '4.8'}
                  </span>
                </div>

                {pack.tags && pack.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {pack.tags.slice(0, 3).map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-accent-purple/20 text-accent-purple text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </NothingCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="mx-auto mb-4 text-gray-500" size={48} />
            <h3 className="text-white font-medium mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-400 text-sm mb-4">
              다른 키워드나 필터로 시도해보세요
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 bg-accent-purple text-white rounded-lg text-sm hover:bg-accent-purple/80 transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}
      </section>
    </MobileLayout>
  );
}

function getPackIcon(category: string) {
  const icons: Record<string, string> = {
    'javascript': '💻',
    'python': '🐍',
    'react': '⚛️',
    'design': '🎨',
    'data': '📊',
    default: '📚'
  };
  return icons[category?.toLowerCase()] || icons.default;
}
