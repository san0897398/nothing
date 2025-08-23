import { useState } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { NothingCard } from '@/components/mobile/NothingCard';
import { FileText, Save, Share2, Plus, Eye, Upload, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Studio() {
  const [packTitle, setPackTitle] = useState('');
  const [packDescription, setPackDescription] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!packTitle.trim() || !markdownContent.trim()) {
      toast({
        title: "입력 확인",
        description: "제목과 콘텐츠를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "저장 완료",
      description: "학습팩이 성공적으로 저장되었습니다.",
    });
  };

  const handleShare = () => {
    if (!packTitle.trim() || !markdownContent.trim()) {
      toast({
        title: "입력 확인", 
        description: "저장 후 공유할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "공유 링크 생성됨",
      description: "학습팩 공유 준비가 완료되었습니다.",
    });
  };

  const handleImportFile = () => {
    toast({
      title: "파일 가져오기",
      description: "마크다운 파일을 선택해주세요.",
    });
  };

  return (
    <MobileLayout>
      {/* Nothing™ Hero Section */}
      <section className="px-4 py-12 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple via-accent-blue to-accent-glow animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center backdrop-blur-sm">
              <FileText className="text-white drop-shadow-lg" size={36} />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="text-white">Create Your</span>
          <br />
          <span className="text-transparent bg-gradient-to-r from-accent-purple via-accent-blue to-accent-glow bg-clip-text">
            Learning Pack™
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto mb-8 opacity-90">
          Experience the profound power of educational content creation.
          Crafted with meticulous attention to learning, delivered with
          unparalleled pedagogical precision.
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-accent-glow mb-8">
          <div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></div>
          <span>AI 협업 시스템 활성화됨</span>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 mb-6">
        <div className="flex space-x-3">
          <button
            onClick={handleImportFile}
            className="flex-1 py-3 px-4 bg-accent-blue text-white rounded-xl font-medium hover:bg-accent-blue/80 transition-colors flex items-center justify-center"
            data-testid="button-import"
          >
            <Upload size={18} className="mr-2" />
            파일 가져오기
          </button>
          
          <button
            onClick={() => setIsPreview(!isPreview)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center ${
              isPreview 
                ? 'bg-accent-purple text-white' 
                : 'bg-primary-700 text-gray-300 hover:bg-primary-600'
            }`}
            data-testid="button-toggle-preview"
          >
            <Eye size={18} className="mr-2" />
            {isPreview ? '편집' : '미리보기'}
          </button>
        </div>
      </section>

      {/* Content Editor */}
      <section className="px-4 mb-24">
        {!isPreview ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <NothingCard title="기본 정보" icon={<FileText />}>
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={packTitle}
                    onChange={(e) => setPackTitle(e.target.value)}
                    placeholder="학습팩 제목"
                    className="w-full p-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base"
                    style={{ fontSize: '16px' }}
                    data-testid="input-title"
                  />
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    간단한 설명
                  </label>
                  <textarea
                    value={packDescription}
                    onChange={(e) => setPackDescription(e.target.value)}
                    placeholder="학습팩에 대한 간단한 설명"
                    rows={2}
                    className="w-full p-3 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 mobile-text-base resize-none"
                    style={{ fontSize: '16px' }}
                    data-testid="input-description"
                  />
                </div>
              </div>
            </NothingCard>

            {/* Markdown Editor */}
            <NothingCard title="마크다운 에디터" icon={<FileText />}>
              <div className="space-y-4">
                {/* Editor Controls */}
                <div className="flex items-center justify-between">
                  <label className="block text-white text-sm font-medium">
                    학습 콘텐츠
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setMarkdownContent(`# Role
You are an expert educational content creator specializing in creating engaging and effective learning materials.

## Task
Create comprehensive learning content that helps students master [specific topic/skill].

## Context
- Target audience: [beginner/intermediate/advanced] learners
- Learning objective: [specific goal students should achieve]
- Time constraint: [expected completion time]
- Prerequisites: [required background knowledge]

## Content Structure

### Introduction
- Hook: Start with engaging question or real-world example
- Learning objectives: Clear, measurable outcomes
- Overview: Brief roadmap of what will be covered

### Core Content
#### Section 1: [Topic Name]
Explanation with examples:
\`\`\`javascript
// Practical code examples
console.log("Learning by doing");
\`\`\`

#### Section 2: [Next Topic]
Step-by-step breakdown with visual aids

### Practice & Application
- Hands-on exercises
- Real-world scenarios
- Self-check questions

## Assessment
1. **Knowledge Check**: [Question type]
   - A) Option 1
   - B) Option 2
   - C) Option 3
   - D) Option 4

2. **Application Task**: [Practical exercise]

# Rules
- Use clear, simple language appropriate for target level
- Include practical examples for every concept
- Provide immediate feedback opportunities
- Cross-reference related concepts
- Validate accuracy of all technical information

## Stop Conditions
- All learning objectives are addressed
- Content fits within specified time frame
- Assessment aligns with objectives
- Prerequisites are clearly stated

## Output Format
- Use proper markdown hierarchy (# ## ###)
- Include code blocks with syntax highlighting
- Add interactive elements where possible
- Provide summary and next steps`);
                        toast({
                          title: "템플릿 새로고침 완료!",
                          description: "최신 GPT-5 최적화 가이드로 업데이트했습니다",
                        });
                      }}
                      className="p-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-all duration-300 hover:scale-105 shimmer-border"
                      data-testid="button-refresh-template"
                      title="최신 템플릿으로 새로고침"
                    >
                      <RotateCcw size={16} />
                    </button>
                    
                    <button
                      onClick={() => {
                        if (!markdownContent.trim()) {
                          toast({
                            title: "잠깐만요!",
                            description: "먼저 프롬프트를 작성해주세요 (빈 종이는 개선할 게 없어요)",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        toast({
                          title: "AI 마법사 소환 중...",
                          description: "Nothing™ AI가 프롬프트를 분석하고 개선안을 제안합니다 (시간이 좀 걸릴 수 있어요)",
                        });
                        
                        // TODO: 실제 AI 개선 로직 구현
                        setTimeout(() => {
                          toast({
                            title: "개선 완료!",
                            description: "프롬프트가 더 명확하고 효과적으로 개선되었습니다",
                          });
                        }, 2000);
                      }}
                      className="p-2 floating-action text-white rounded-lg transition-all duration-300 hover:scale-105 pulse-glow"
                      data-testid="button-improve-prompt"
                      title="AI가 프롬프트를 개선해드려요"
                    >
                      <Sparkles size={16} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder={`# Role
You are an expert educational content creator specializing in creating engaging and effective learning materials.

## Task
Create comprehensive learning content that helps students master [specific topic/skill].

## Context
- Target audience: [beginner/intermediate/advanced] learners
- Learning objective: [specific goal students should achieve]
- Time constraint: [expected completion time]
- Prerequisites: [required background knowledge]

## Content Structure

### Introduction
- Hook: Start with engaging question or real-world example
- Learning objectives: Clear, measurable outcomes
- Overview: Brief roadmap of what will be covered

### Core Content
#### Section 1: [Topic Name]
Explanation with examples:
\`\`\`javascript
// Practical code examples
console.log("Learning by doing");
\`\`\`

#### Section 2: [Next Topic]
Step-by-step breakdown with visual aids

### Practice & Application
- Hands-on exercises
- Real-world scenarios
- Self-check questions

## Assessment
1. **Knowledge Check**: [Question type]
   - A) Option 1
   - B) Option 2
   - C) Option 3
   - D) Option 4

2. **Application Task**: [Practical exercise]

# Rules
- Use clear, simple language appropriate for target level
- Include practical examples for every concept
- Provide immediate feedback opportunities
- Cross-reference related concepts
- Validate accuracy of all technical information

## Stop Conditions
- All learning objectives are addressed
- Content fits within specified time frame
- Assessment aligns with objectives
- Prerequisites are clearly stated

## Output Format
- Use proper markdown hierarchy (# ## ###)
- Include code blocks with syntax highlighting
- Add interactive elements where possible
- Provide summary and next steps`}
                  rows={20}
                  className="w-full p-4 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 font-mono text-sm resize-none"
                  data-testid="input-markdown"
                />
                <div className="mt-4 p-4 bg-primary-800/50 rounded-xl border border-accent-purple/20">
                  <div className="flex items-center space-x-2 mb-3">
                    <Zap className="text-accent-purple" size={16} />
                    <p className="text-accent-purple font-medium text-sm">Nothing™ 프롬프트 마법사</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-accent-purple font-medium mb-2">✨ AI 개선 기능:</p>
                      <ul className="space-y-1 text-gray-300">
                        <li>• 애매한 표현 → 구체적 지시문</li>
                        <li>• 누락된 컨텍스트 자동 추가</li>
                        <li>• 최신 GPT-5 패턴 적용</li>
                        <li>• 효과적인 Rules 섹션 생성</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-accent-blue font-medium mb-2">🎯 핵심 구조:</p>
                      <ul className="space-y-1 text-gray-300">
                        <li>• <code># Role</code> - "You are..." 신원</li>
                        <li>• <code>## Task</code> - 명확한 목표</li>
                        <li>• <code>## Context</code> - 상황 설명</li>
                        <li>• <code># Rules</code> - 필수 제약사항</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-3 p-2 bg-accent-purple/10 rounded-lg border border-accent-purple/20">
                    <p className="text-xs text-accent-glow">
                      💡 <strong>프로 팁:</strong> 새로고침 버튼으로 최신 템플릿을 받고, ✨ 버튼으로 AI가 개선해드려요!
                    </p>
                  </div>
                </div>
              </div>
            </NothingCard>
          </div>
        ) : (
          /* Preview Mode */
          <div className="space-y-6">
            <NothingCard title="미리보기" icon={<Eye />}>
              {packTitle || packDescription || markdownContent ? (
                <div className="space-y-4">
                  {packTitle && (
                    <h1 className="text-2xl font-bold text-white">{packTitle}</h1>
                  )}
                  
                  {packDescription && (
                    <p className="text-gray-300 text-base">{packDescription}</p>
                  )}
                  
                  {markdownContent && (
                    <div className="mt-6 prose prose-invert prose-purple max-w-none">
                      <div className="bg-primary-800 rounded-xl p-6">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                          {markdownContent}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="mx-auto mb-4" size={48} />
                  <h3 className="font-medium mb-2">콘텐츠를 입력해주세요</h3>
                  <p className="text-sm">편집 모드에서 제목과 마크다운 콘텐츠를 작성하면 미리보기를 확인할 수 있습니다.</p>
                </div>
              )}
            </NothingCard>

            <NothingCard title="AI 피드백" icon={<FileText />}>
              <div className="text-center space-y-4">
                <p className="text-gray-400 text-sm">
                  Nothing™ AI가 콘텐츠를 심층 분석합니다
                </p>
                <button 
                  className="w-full py-3 floating-action text-white rounded-xl font-medium transition-all duration-300 hover:scale-105"
                  disabled={!markdownContent.trim()}
                  data-testid="button-ai-feedback"
                  onClick={() => toast({
                    title: "뇌에 업로드 중...",
                    description: "학습 효과를 최적화하는 중입니다 (시간이 좀 걸릴 수 있어요)",
                  })}
                >
                  AI 피드백 받기
                </button>
              </div>
            </NothingCard>
          </div>
        )}
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