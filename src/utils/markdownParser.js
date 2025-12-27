const parseMarkdownArticle = async (targetPath) => {
    const response = await fetch(targetPath);
    if (!response.ok) {
        throw new Error(`파일을 찾을 수 없습니다. (경로: ${targetPath})`);
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/);
    const metadata = {};
    let contentStartIndex = 0;
    let parsingMeta = true;

    // 1. 메타데이터 파싱 (파일 상단부터 첫 빈 줄까지만)
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 첫 번째 빈 줄을 만나면 메타데이터 파싱 종료
        if (line === '' && i > 0) {
            contentStartIndex = i + 1;
            parsingMeta = false;
            break;
        }

        if (parsingMeta) {
            // 시스템 안전장치(\) 제거 후 파싱
            const cleanMetaLine = line.replace(/^\\+/, '');
            const metaMatch = cleanMetaLine.match(/^([\w-]+):\s*(.*)$/);

            if (metaMatch) {
                const key = metaMatch[1].trim().toLowerCase();
                const value = metaMatch[2].trim();
                metadata[key] = value;
            } else if (!cleanMetaLine.startsWith('---') && cleanMetaLine !== '') {
                // 메타데이터 형식이 아닌 문장을 만나면 본문 시작으로 간주
                contentStartIndex = i;
                parsingMeta = false;
                break;
            }
        }
    }

    // 2. 본문 블록 파싱 (메타데이터 이후 영역)
    const bodyLines = lines.slice(contentStartIndex);
    const blocks = [];

    bodyLines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return; // 본문 내 빈 줄은 블록 생성 안 함

        // 줄 시작의 백슬래시(\) 제거
        const cleanedLine = trimmedLine.replace(/^\\+/, '');

        // 질문 (QUESTION: 또는 ##)
        if (cleanedLine.startsWith('QUESTION:')) {
            blocks.push({
                type: 'heading',
                // 요청하신 대로 QUESTION: 키워드를 제거하고 내용만 저장
                content: cleanedLine.replace(/^QUESTION:\s*/, '').trim()
            });
        } else if (cleanedLine.startsWith('##')) {
            blocks.push({
                type: 'heading',
                content: cleanedLine.replace(/^##\s*/, '').trim()
            });
        }
        // 인용문 (>)
        else if (cleanedLine.startsWith('>')) {
            blocks.push({
                type: 'quote',
                content: cleanedLine.replace(/^>\s*/, '').trim()
            });
        }
        else if (cleanedLine.startsWith('IMG:')) {
            blocks.push({
                type: 'image',
                content: cleanedLine.replace(/^IMG:\s*/, '').trim()
            });
        }
        // 섹션 레이블 ([Name])
        else if (cleanedLine.match(/^\\?\[.*\\?\]$/)) {
            const label = cleanedLine.replace(/[\\\[\]]/g, '').trim();
            blocks.push({ type: 'label', content: label });
        }
        // 일반 문단
        else {
            blocks.push({ type: 'paragraph', content: cleanedLine });
        }
    });

    return { metadata, blocks };
};

// 기본 내보내기로 설정하여 import parseMarkdownArticle from ... 형식이 가능하게 함
export default parseMarkdownArticle;