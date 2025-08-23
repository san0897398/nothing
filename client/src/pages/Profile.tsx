import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { NothingCard } from '@/components/mobile/NothingCard';
import { LearningProgressBar } from '@/components/mobile/LearningProgressBar';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/auth-utils';
import { apiRequest } from '@/lib/queryClient';
import { 
  User, 
  Settings, 
  Trophy, 
  Clock, 
  Target, 
  BookOpen, 
  Star,
  LogOut,
  Edit3,
  Bell,
  Shield,
  Moon,
  Sun
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Fetch user stats and activities
  const { data: userStats } = useQuery({
    queryKey: ['/api/user-progress'],
    enabled: isAuthenticated,
  });

  const { data: userActivities } = useQuery({
    queryKey: ['/api/user-activities'],
    enabled: isAuthenticated,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => {
      window.location.href = '/api/logout';
      return Promise.resolve();
    },
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
          <p className="text-white font-medium">프로필 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const completedPacks = userStats?.filter((stat: any) => stat.status === 'completed')?.length || 0;
  const inProgressPacks = userStats?.filter((stat: any) => stat.status === 'in_progress')?.length || 0;
  const totalTimeSpent = userStats?.reduce((total: number, stat: any) => total + (stat.timeSpent || 0), 0) || 0;
  const averageProgress = userStats?.length > 0 
    ? userStats.reduce((total: number, stat: any) => total + (stat.progress || 0), 0) / userStats.length 
    : 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <MobileLayout>
      {/* Profile Header */}
      <section className="px-4 py-8">
        <div className="text-center mb-8">
          {/* Profile Image */}
          <div className="relative mb-4">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-accent-purple/30"
                data-testid="profile-image"
              />
            ) : (
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
                <User className="text-white" size={36} />
              </div>
            )}
            <button className="absolute bottom-0 right-1/2 transform translate-x-12 bg-accent-purple rounded-full w-8 h-8 flex items-center justify-center text-white hover:bg-accent-purple/80 transition-colors">
              <Edit3 size={14} />
            </button>
          </div>

          {/* User Info */}
          <h1 className="text-2xl font-bold text-white mb-2">
            {user?.firstName || user?.lastName 
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
              : '학습자'
            }
          </h1>
          <p className="text-gray-400 text-sm mb-4">{user?.email}</p>
          
          {/* Learning Level Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue rounded-full text-white text-sm font-medium">
            <Trophy size={16} className="mr-2" />
            {completedPacks < 5 ? '초보 학습자' : completedPacks < 15 ? '중급 학습자' : '고급 학습자'}
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold mobile-text-xl mb-6">학습 통계</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <NothingCard 
            title={completedPacks.toString()}
            subtitle="완료한 팩"
            icon={<Trophy className="text-accent-success" />}
            className="text-center"
            data-testid="stat-completed"
          />
          <NothingCard 
            title={inProgressPacks.toString()}
            subtitle="진행 중인 팩"
            icon={<BookOpen className="text-accent-warning" />}
            className="text-center"
            data-testid="stat-in-progress"
          />
        </div>

        <div className="space-y-4">
          <NothingCard title="전체 학습 진도" icon={<Target />}>
            <LearningProgressBar 
              progress={averageProgress}
              subtitle="평균 완료율"
              size="lg"
            />
          </NothingCard>

          <NothingCard title="총 학습 시간" icon={<Clock />}>
            <div className="text-center">
              <span className="text-3xl font-bold text-white">
                {Math.floor(totalTimeSpent / 3600)}
              </span>
              <span className="text-gray-400 ml-2">시간</span>
              <p className="text-gray-400 text-sm mt-1">
                이번 달: {Math.floor(totalTimeSpent / 3600 * 0.3)}시간
              </p>
            </div>
          </NothingCard>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold mobile-text-xl mb-6">최근 성취</h2>
        
        <div className="space-y-3">
          {completedPacks > 0 && (
            <NothingCard 
              title="첫 번째 팩 완료" 
              subtitle="학습 여정을 시작했어요!"
              icon={<Star className="text-accent-success" />}
              data-testid="achievement-first-pack"
            />
          )}
          
          {completedPacks >= 5 && (
            <NothingCard 
              title="연속 학습자" 
              subtitle="5개 팩을 완료했어요!"
              icon={<Trophy className="text-accent-warning" />}
              data-testid="achievement-streak"
            />
          )}

          {completedPacks === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="mx-auto mb-4" size={32} />
              <p>첫 번째 학습팩을 완료하면</p>
              <p className="text-sm">성취 배지를 받을 수 있어요!</p>
            </div>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="px-4 mb-24">
        <h2 className="text-white font-semibold mobile-text-xl mb-6">설정</h2>
        
        <div className="space-y-4">
          <NothingCard title="알림 설정" icon={<Bell />}>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">학습 알림</span>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  notifications ? 'bg-accent-purple' : 'bg-gray-600'
                }`}
                data-testid="toggle-notifications"
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </NothingCard>

          <NothingCard title="테마 설정" icon={darkMode ? <Moon /> : <Sun />}>
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">다크 모드</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  darkMode ? 'bg-accent-purple' : 'bg-gray-600'
                }`}
                data-testid="toggle-dark-mode"
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </NothingCard>

          <NothingCard 
            title="개인정보 보호" 
            subtitle="데이터 및 보안 설정"
            icon={<Shield />}
            onTap={() => {
              toast({
                title: "개인정보 설정",
                description: "개인정보 보호 설정 페이지로 이동합니다.",
              });
            }}
            data-testid="privacy-settings"
          />

          <NothingCard 
            title="계정 설정" 
            subtitle="프로필 및 계정 관리"
            icon={<Settings />}
            onTap={() => {
              toast({
                title: "계정 설정",
                description: "계정 설정 페이지로 이동합니다.",
              });
            }}
            data-testid="account-settings"
          />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full p-4 bg-destructive/20 text-destructive rounded-2xl border border-destructive/20 hover:bg-destructive/30 transition-colors flex items-center justify-center space-x-2"
            data-testid="button-logout"
          >
            <LogOut size={20} />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </section>
    </MobileLayout>
  );
}
