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
      {/* Nothing™ Profile Header */}
      <section className="px-4 py-12 relative overflow-hidden">
        {/* Background ambient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/10 via-transparent to-accent-blue/10 animate-pulse"></div>
        
        <div className="text-center mb-8 relative z-10">
          {/* Profile Image with Nothing™ glow */}
          <div className="relative mb-6">
            {user?.profileImageUrl ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue rounded-full opacity-30 blur-xl animate-pulse"></div>
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="relative w-32 h-32 rounded-full mx-auto object-cover border-4 border-accent-purple/50 shadow-2xl shadow-accent-purple/50"
                  data-testid="profile-image"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue rounded-full opacity-40 blur-xl animate-pulse"></div>
                <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent-purple via-accent-blue to-accent-glow flex items-center justify-center shadow-2xl shadow-accent-purple/50 animate-pulse">
                  <User className="text-white drop-shadow-lg" size={48} />
                </div>
              </div>
            )}
            <button className="absolute bottom-2 right-1/2 transform translate-x-16 bg-gradient-to-r from-accent-purple to-accent-blue rounded-full w-10 h-10 flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg shadow-accent-purple/50">
              <Edit3 size={16} />
            </button>
          </div>

          {/* User Info with Nothing™ styling */}
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            <span className="text-white drop-shadow-lg">
              {user?.firstName || user?.lastName 
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : 'Nothing'
              }
            </span>
            <span className="text-transparent bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text">™</span>
          </h1>
          <p className="text-accent-glow text-base mb-6 opacity-90">{user?.email}</p>
          
          {/* Learning Level Badge with glow */}
          <div className="relative inline-flex items-center px-6 py-3 rounded-full text-white text-base font-bold">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-purple via-accent-blue to-accent-glow rounded-full animate-pulse"></div>
            <div className="relative z-10 flex items-center">
              <Trophy size={20} className="mr-3 drop-shadow-lg" />
              <span className="drop-shadow-lg">
                {completedPacks < 5 ? 'Novice Learner' : completedPacks < 15 ? 'Advanced Learner' : 'Master Learner'}™
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Nothing™ Stats Overview */}
      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold text-xl mb-6">
          <span className="text-white">Learning</span>
          <span className="text-transparent bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text"> Analytics™</span>
        </h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="gradient-glow click-effect">
            <NothingCard 
              title={completedPacks.toString()}
              subtitle="완료한 팩"
              icon={<Trophy className="text-accent-success drop-shadow-lg" />}
              className="text-center hover:scale-105 transition-all duration-300"
              data-testid="stat-completed"
            />
          </div>
          <div className="gradient-glow click-effect">
            <NothingCard 
              title={inProgressPacks.toString()}
              subtitle="진행 중인 팩"
              icon={<BookOpen className="text-accent-warning drop-shadow-lg" />}
              className="text-center hover:scale-105 transition-all duration-300"
              data-testid="stat-in-progress"
            />
          </div>
        </div>

        <div className="space-y-4">
          <NothingCard title="마인드 업로딩 진행률" icon={<Target />}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">시스템 동조화</span>
                <span className="text-accent-glow font-bold">{averageProgress}%</span>
              </div>
              <div className="w-full bg-primary-700 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-glow h-3 rounded-full animate-pulse transition-all duration-1000" 
                  style={{ width: `${averageProgress}%` }}
                ></div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent h-3 rounded-full animate-pulse" 
                  style={{ width: `${averageProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-accent-glow text-center">
                지식 전송 중... Nothing™ 학습 시스템 활성화됨
              </p>
            </div>
          </NothingCard>

          <div className="gradient-glow click-effect">
            <NothingCard title="총 학습 시간" icon={<Clock className="drop-shadow-lg" />} className="hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <span className="text-4xl font-bold text-white drop-shadow-lg">
                  {Math.floor(totalTimeSpent / 3600)}
                </span>
                <span className="text-accent-glow ml-2 font-medium">시간</span>
                <p className="text-accent-glow/70 text-sm mt-2">
                  이번 달: {Math.floor(totalTimeSpent / 3600 * 0.3)}시간
                </p>
              </div>
            </NothingCard>
          </div>
        </div>
      </section>

      {/* Nothing™ Achievements */}
      <section className="px-4 mb-8">
        <h2 className="text-white font-semibold text-xl mb-6">
          <span className="text-white">Recent</span>
          <span className="text-transparent bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text"> Achievements™</span>
        </h2>
        
        <div className="space-y-4">
          {completedPacks > 0 && (
            <div className="gradient-glow click-effect">
              <NothingCard 
                title="첫 번째 팩 완료" 
                subtitle="학습 여정을 시작했어요!"
                icon={<Star className="text-accent-success drop-shadow-lg animate-pulse" />}
                data-testid="achievement-first-pack"
                className="hover:scale-105 transition-all duration-300"
              />
            </div>
          )}
          
          {completedPacks >= 5 && (
            <div className="gradient-glow click-effect">
              <NothingCard 
                title="연속 학습자" 
                subtitle="5개 팩을 완료했어요!"
                icon={<Trophy className="text-accent-warning drop-shadow-lg animate-bounce" />}
                data-testid="achievement-streak"
                className="hover:scale-105 transition-all duration-300"
              />
            </div>
          )}

          {completedPacks === 0 && (
            <div className="text-center py-12 text-gray-400 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-accent-blue/5 rounded-2xl animate-pulse"></div>
              <div className="relative z-10">
                <Trophy className="mx-auto mb-6 drop-shadow-lg" size={48} />
                <p className="text-lg mb-2 text-white">첫 번째 학습팩을 완료하면</p>
                <p className="text-accent-glow">Nothing™ 성취 배지를 받을 수 있어요!</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="px-4 mb-24">
        <h2 className="text-white font-semibold mobile-text-xl mb-6">설정</h2>
        
        <div className="space-y-4">
          <div className="gradient-glow click-effect">
            <NothingCard title="알림 설정" icon={<Bell className="drop-shadow-lg" />} className="hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">학습 알림</span>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                    notifications ? 'bg-gradient-to-r from-accent-purple to-accent-blue shadow-lg shadow-accent-purple/30' : 'bg-gray-600'
                  }`}
                  data-testid="toggle-notifications"
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-lg ${
                    notifications ? 'translate-x-7 shadow-accent-purple/50' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            </NothingCard>
          </div>

          <div className="gradient-glow click-effect">
            <NothingCard title="테마 설정" icon={darkMode ? <Moon className="drop-shadow-lg animate-pulse" /> : <Sun className="drop-shadow-lg" />} className="hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">다크 모드</span>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-14 h-7 rounded-full relative transition-all duration-300 ${
                    darkMode ? 'bg-gradient-to-r from-accent-purple to-accent-blue shadow-lg shadow-accent-purple/30' : 'bg-gray-600'
                  }`}
                  data-testid="toggle-dark-mode"
                >
                  <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all duration-300 shadow-lg ${
                    darkMode ? 'translate-x-7 shadow-accent-purple/50' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
            </NothingCard>
          </div>

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
