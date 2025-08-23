import { useState } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { NothingCard } from '@/components/mobile/NothingCard';
import { Edit3, Settings, Eye, Save, Share2, Plus, FileText, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StudioTab = 'edit' | 'variables' | 'preview';

export default function Studio() {
  const [activeTab, setActiveTab] = useState<StudioTab>('edit');
  const [packTitle, setPackTitle] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [packContent, setPackContent] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    // TODO: Implement save logic
    toast({
      title: "저장 완료",
      description: "학습팩이 성공적으로 저장되었습니다.",
    });
  };

  const handleShare = () => {
    // TODO: Implement share logic
    toast({
      title: "공유 준비",
      description: "학습팩을 공유할 준비가 되었습니다.",
    });
  };

  const handleCreatePack = () => {
    // TODO: Implement pack creation logic
    toast({
      title: "새 팩 생성",
      description: "새로운 학습팩을 생성합니다.",
    });
  };

  return (
    <MobileLayout>
      {/* Hero Section */}
      <section className="px-4 py-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <Edit3 className="text-white" size={28} />
          </div>
        </div>
        
        <h1 className="hero-title mb-4">
          <span className="text-white">Create Your</span>
          <br />
          <span className="gradient-text">Learning Pack™</span>
        </h1>
        
        <p className="text-gray-400 mobile-text-base leading-relaxed max-w-sm mx-auto mb-8">
          Experience the profound power of educational content creation.
          Crafted with meticulous attention to learning.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mb-8">
        <div className="flex space-x-3">
          <button
            onClick={handleCreatePack}
            className="flex-1 py-3 px-4 floating-action rounded-xl text-white font-medium hover:scale-[1.02] transition-transform flex items-center justify-center"
            data-testid="button-create-pack"
          >
            <Plus size={18} className="mr-2" />
            새 팩 생성
          </button>
        </div>
      </section>

      {/* Tab Cards */}
      <section className="px-4 mb-8">
        <div className="space-y-4">
          <NothingCard
            title="템플릿 편집"
            subtitle="교수법 모듈을 디자인하세요"
            icon={<Edit3 />}
            isActive={activeTab === 'edit'}
            onTap={() => setActiveTab('edit')}
            data-testid="tab-edit"
          />
          
          <NothingCard
            title="변수 관리"
            subtitle="학습 매개변수를 커스터마이즈하세요"
            icon={<Settings />}
            isActive={activeTab === 'variables'}
            onTap={() => setActiveTab('variables')}
            data-testid="tab-variables"
          />
          
          <NothingCard
            title="미리보기 & 테스트"
            subtitle="당신의 창작물을 경험해보세요"
            icon={<Eye />}
            isActive={activeTab === 'preview'}
            onTap={() => setActiveTab('preview')}
            data-testid="tab-preview"
          />
        </div>
      </section>

      {/* Tab Content */}
      <section className="px-4 mb-24">
        {activeTab === 'edit' && <EditTab 
          packTitle={packTitle}
          setPackTitle={setPackTitle}
          packDescription={packDescription}
          setPackDescription={setPackDescription}
          packContent={packContent}
          setPackContent={setPackContent}
        />}
        {activeTab === 'variables' && <VariablesTab />}
        {activeTab === 'preview' && <PreviewTab 
          packTitle={packTitle}
          packDescription={packDescription}
          packContent={packContent}
        />}
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 right-4 space-y-3">
        <button
          onClick={handleSave}
          className="w-14 h-14 bg-accent-success rounded-full flex items-center justify-center text-white shadow-lg shadow-accent-success/30 hover:scale-110 transition-transform"
          data-testid="fab-save"
        >
          <Save size={20} />
        </button>
        <button
          onClick={handleShare}
          className="w-14 h-14 bg-accent-warning rounded-full flex items-center justify-center text-white shadow-lg shadow-accent-warning/30 hover:scale-110 transition-transform"
          data-testid="fab-share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </MobileLayout>
  );
}

function EditTab({ 
  packTitle, 
  setPackTitle, 
  packDescription, 
  setPackDescription, 
  packContent, 
  setPackContent 
}: {
  packTitle: string;
  setPackTitle: (value: string) => void;
  packDescription: string;
  setPackDescription: (value: string) => void;
  packContent: string;
  setPackContent: (value: string) => void;
}) {
  return (
    <div className="space-y-6" data-testid="edit-tab">
      <NothingCard title="기본 정보" icon={<FileText />}>
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              팩 제목
            </label>
            <input
              type="text"
              value={packTitle}
              onChange={(e) => setPackTitle(e.target.value)}
              placeholder="학습팩의 제목을 입력하세요"
              className="w-full p-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base"
              style={{ fontSize: '16px' }}
              data-testid="input-pack-title"
            />
          </div>
          
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              설명
            </label>
            <textarea
              value={packDescription}
              onChange={(e) => setPackDescription(e.target.value)}
              placeholder="학습팩에 대한 간단한 설명을 작성하세요"
              rows={3}
              className="w-full p-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base resize-none"
              style={{ fontSize: '16px' }}
              data-testid="input-pack-description"
            />
          </div>
        </div>
      </NothingCard>

      <NothingCard title="콘텐츠 편집" icon={<Edit3 />}>
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            학습 콘텐츠
          </label>
          <textarea
            value={packContent}
            onChange={(e) => setPackContent(e.target.value)}
            placeholder="학습 내용을 입력하세요. 마크다운 문법을 지원합니다."
            rows={10}
            className="w-full p-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base resize-none font-mono"
            style={{ fontSize: '14px' }}
            data-testid="input-pack-content"
          />
          <p className="text-xs text-gray-400 mt-2">
            마크다운 문법을 사용하여 콘텐츠를 꾸며보세요
          </p>
        </div>
      </NothingCard>
    </div>
  );
}

function VariablesTab() {
  const [difficulty, setDifficulty] = useState('intermediate');
  const [duration, setDuration] = useState('30');
  const [category, setCategory] = useState('programming');

  return (
    <div className="space-y-6" data-testid="variables-tab">
      <NothingCard title="학습 설정" icon={<Settings />}>
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              난이도
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 bg-primary-700 text-white rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              data-testid="select-difficulty"
            >
              <option value="beginner">초급</option>
              <option value="intermediate">중급</option>
              <option value="advanced">고급</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              예상 소요시간 (분)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="5"
              max="180"
              className="w-full p-3 bg-primary-700 text-white rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              data-testid="input-duration"
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-primary-700 text-white rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
              data-testid="select-category"
            >
              <option value="programming">프로그래밍</option>
              <option value="design">디자인</option>
              <option value="data">데이터 사이언스</option>
              <option value="business">비즈니스</option>
              <option value="language">언어</option>
            </select>
          </div>
        </div>
      </NothingCard>

      <NothingCard title="AI 설정" icon={<Zap />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">AI 자동 퀴즈 생성</span>
            <button className="w-12 h-6 bg-accent-purple rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">스마트 진도 추적</span>
            <button className="w-12 h-6 bg-accent-purple rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">개인화 추천</span>
            <button className="w-12 h-6 bg-accent-purple rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </button>
          </div>
        </div>
      </NothingCard>
    </div>
  );
}

function PreviewTab({ packTitle, packDescription, packContent }: {
  packTitle: string;
  packDescription: string;
  packContent: string;
}) {
  return (
    <div className="space-y-6" data-testid="preview-tab">
      <NothingCard title="미리보기" icon={<Eye />}>
        <div className="space-y-4">
          {packTitle ? (
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">{packTitle}</h3>
              {packDescription && (
                <p className="text-gray-300 text-sm mb-4">{packDescription}</p>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <FileText className="mx-auto mb-4" size={32} />
              <p>콘텐츠를 입력하면 미리보기가 여기에 표시됩니다</p>
            </div>
          )}

          {packContent && (
            <div className="bg-primary-800 rounded-xl p-4">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                {packContent}
              </pre>
            </div>
          )}
        </div>
      </NothingCard>

      <NothingCard title="테스트 실행" icon={<Zap />}>
        <div className="text-center space-y-4">
          <p className="text-gray-400 text-sm">
            학습팩을 실제로 테스트해보세요
          </p>
          <button 
            className="w-full py-3 bg-accent-blue text-white rounded-xl font-medium hover:bg-accent-blue/80 transition-colors"
            disabled={!packTitle || !packContent}
            data-testid="button-test-pack"
          >
            테스트 시작
          </button>
        </div>
      </NothingCard>
    </div>
  );
}
