import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { NothingCard } from '@/components/mobile/NothingCard';
import { LearningProgressBar } from '@/components/mobile/LearningProgressBar';
import { ChatInterface } from '@/components/mobile/ChatInterface';
import { Brain, Clock, Star, Signal, Play, Pause, CheckCircle, Book, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/auth-utils';
import { useEffect } from 'react';

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['/api/dashboard'],
    enabled: isAuthenticated,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">경험을 로딩 중...</p>
          <p className="text-gray-400 text-sm">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const { currentLearning, recommendedPacks = [], recentActivities = [] } = dashboardData || {};

  return (
    <MobileLayout>
      {/* Hero Section */}
      <section className="px-4 py-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <Brain className="text-white" size={28} />
          </div>
        </div>
        
        <h1 className="hero-title mb-4">
          <span className="text-white">Learn</span>
          <br />
          <span className="gradient-text">Everything™</span>
        </h1>
        
        <p className="text-gray-400 mobile-text-base leading-relaxed max-w-sm mx-auto mb-8">
          안녕하세요, {user?.firstName || '학습자'}님!
          <br />
          Experience the profound power of knowledge acquisition.
        </p>

        {/* Current Learning Status */}
        {currentLearning ? (
          <NothingCard
            title="현재 학습 중"
            className="mb-6 text-left"
            data-testid="current-learning-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold mobile-text-lg">
                {currentLearning.pack?.title || '학습 중...'}
              </h3>
              <div className="text-accent-success text-sm flex items-center">
                <Clock size={14} className="mr-1" />
                진행 중
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-gray-300 mobile-text-base mb-2">
                {currentLearning.pack?.description || '학습을 계속하세요'}
              </p>
              <LearningProgressBar 
                progress={currentLearning.progress || 0}
                subtitle="뇌에 업로드 중..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="flex-1 py-2 px-4 bg-accent-purple text-white rounded-lg font-medium hover:bg-accent-purple/80 transition-colors flex items-center justify-center"
                data-testid="button-continue-learning"
              >
                <Play size={16} className="mr-2" />
                계속 학습
              </button>
              <button className="px-4 py-2 border border-accent-purple/30 text-accent-purple rounded-lg hover:bg-accent-purple/10 transition-colors flex items-center">
                <Pause size={16} className="mr-1" />
                일시중지
              </button>
            </div>
          </NothingCard>
        ) : (
          <NothingCard
            title="새로운 학습 시작"
            subtitle="학습할 팩을 선택해주세요"
            icon={<Book />}
            className="mb-6"
            data-testid="start-learning-card"
          >
            <button className="w-full py-3 bg-accent-purple text-white rounded-lg font-medium hover:bg-accent-purple/80 transition-colors">
              학습 팩 둘러보기
            </button>
          </NothingCard>
        )}
      </section>

      {/* AI Recommended Packs */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-semibold mobile-text-xl">AI 추천 팩</h2>
          <div className="text-accent-purple text-sm flex items-center">
            <Star size={14} className="mr-1" />
            맞춤형
          </div>
        </div>

        <div className="space-y-4">
          {recommendedPacks.length > 0 ? (
            recommendedPacks.slice(0, 3).map((pack: any) => (
              <NothingCard
                key={pack.id}
                title={pack.title}
                subtitle={pack.description}
                icon={getPackIcon(pack.category)}
                onTap={() => {
                  // TODO: Navigate to pack detail
                  toast({
                    title: "팩 선택됨",
                    description: `${pack.title}을(를) 선택했습니다.`,
                  });
                }}
                data-testid={`recommended-pack-${pack.id}`}
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
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
              </NothingCard>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Brain className="mx-auto mb-4" size={32} />
              <p>학습 활동을 시작하면 맞춤 추천을 받을 수 있어요!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Activity Summary */}
      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold mobile-text-xl mb-6">최근 활동</h2>
        
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity: any) => (
              <NothingCard
                key={activity.id}
                className="p-4"
                onTap={() => {
                  // TODO: Navigate to pack
                }}
                data-testid={`recent-activity-${activity.id}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {activity.pack?.title || '학습 팩'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatTimeAgo(activity.lastAccessedAt)}
                    </p>
                  </div>
                  <div className={`text-xs font-medium ${getStatusTextColor(activity.status)}`}>
                    {getStatusLabel(activity.status, activity.progress)}
                  </div>
                </div>
              </NothingCard>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Book className="mx-auto mb-4" size={32} />
              <p>아직 학습 활동이 없습니다.</p>
              <p className="text-sm">새로운 팩으로 시작해보세요!</p>
            </div>
          )}
        </div>
      </section>

      {/* Unified Chat Interface */}
      <ChatInterface />
    </MobileLayout>
  );
}

function getPackIcon(category: string) {
  const icons: Record<string, any> = {
    'javascript': '💻',
    'python': '🐍',
    'react': '⚛️',
    'design': '🎨',
    'data': '📊',
    default: '📚'
  };
  return icons[category?.toLowerCase()] || icons.default;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    'completed': 'bg-accent-success',
    'in_progress': 'bg-accent-warning',
    'paused': 'bg-accent-warning',
    'not_started': 'bg-accent-blue',
    default: 'bg-gray-500'
  };
  return colors[status] || colors.default;
}

function getStatusTextColor(status: string) {
  const colors: Record<string, string> = {
    'completed': 'text-accent-success',
    'in_progress': 'text-accent-warning',
    'paused': 'text-accent-warning', 
    'not_started': 'text-accent-blue',
    default: 'text-gray-400'
  };
  return colors[status] || colors.default;
}

function getStatusIcon(status: string) {
  const icons: Record<string, any> = {
    'completed': <CheckCircle size={12} className="text-white" />,
    'in_progress': <Play size={12} className="text-white" />,
    'paused': <Pause size={12} className="text-white" />,
    'not_started': <Book size={12} className="text-white" />,
    default: <AlertCircle size={12} className="text-white" />
  };
  return icons[status] || icons.default;
}

function getStatusLabel(status: string, progress?: number) {
  const labels: Record<string, string> = {
    'completed': '완료',
    'in_progress': `${progress || 0}%`,
    'paused': '일시중지',
    'not_started': '시작됨',
    default: '알 수 없음'
  };
  return labels[status] || labels.default;
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else if (diffHours > 0) {
    return `${diffHours}시간 전`;
  } else {
    return '방금 전';
  }
}
