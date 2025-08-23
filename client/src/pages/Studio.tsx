import { useState } from 'react';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { NothingCard } from '@/components/mobile/NothingCard';
import { FileText, Save, Share2, Plus, Eye, Upload } from 'lucide-react';
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
      {/* Hero Section */}
      <section className="px-4 py-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <FileText className="text-white" size={28} />
          </div>
        </div>
        
        <h1 className="hero-title mb-4">
          <span className="text-white">Create</span>
          <br />
          <span className="gradient-text">Learning Content™</span>
        </h1>
        
        <p className="text-gray-400 mobile-text-base leading-relaxed max-w-sm mx-auto mb-8">
          마크다운으로 간단하게 학습 콘텐츠를 만들어보세요.
          AI와 협업하며 더 나은 자료를 완성할 수 있습니다.
        </p>
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
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  학습 콘텐츠
                </label>
                <textarea
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  placeholder={`# 학습 목표
이 단원에서는 다음을 배웁니다:
- 핵심 개념 1
- 핵심 개념 2

## 내용

### 1. 소개
내용을 작성하세요...

### 2. 실습
\`\`\`javascript
// 코드 예제
console.log("Hello World");
\`\`\`

## 퀴즈
1. 질문을 작성하세요?
   - A) 선택지 1
   - B) 선택지 2

## 정리
학습한 내용을 정리해보세요.`}
                  rows={20}
                  className="w-full p-4 bg-primary-700 text-white placeholder-gray-400 rounded-xl border border-accent-purple/20 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 font-mono text-sm resize-none"
                  data-testid="input-markdown"
                />
                <div className="mt-3 text-xs text-gray-400">
                  <p className="mb-1">💡 <strong>마크다운 팁:</strong></p>
                  <ul className="space-y-1 ml-4">
                    <li>• <code># 제목</code> - 대제목</li>
                    <li>• <code>## 부제목</code> - 소제목</li>
                    <li>• <code>**굵은글씨**</code> - 강조</li>
                    <li>• <code>`코드`</code> - 인라인 코드</li>
                    <li>• <code>```언어</code> - 코드 블록</li>
                  </ul>
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
                  AI가 콘텐츠를 분석하고 개선 방안을 제안합니다
                </p>
                <button 
                  className="w-full py-3 bg-accent-purple text-white rounded-xl font-medium hover:bg-accent-purple/80 transition-colors"
                  disabled={!markdownContent.trim()}
                  data-testid="button-ai-feedback"
                  onClick={() => toast({
                    title: "AI 피드백",
                    description: "콘텐츠 분석 중입니다...",
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