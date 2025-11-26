# Package Usage Checker - 프로젝트 요약

## 프로젝트 구조

```
package-usage-checker/
├── .github/
│   └── workflows/
│       └── test.yml          # GitHub Actions CI/CD 설정
├── index.js                  # 메인 스크립트
├── package.json              # npm 패키지 설정
├── README.md                 # 영어 문서
├── README_KR.md             # 한국어 문서
├── LICENSE                   # MIT 라이선스
├── CONTRIBUTING.md           # 기여 가이드
├── CHANGELOG.md              # 변경 이력
├── SETUP.md                  # 설정 가이드
├── .gitignore                # Git 제외 파일
├── .npmignore                # npm 제외 파일
└── package-list.txt.example  # 패키지 목록 예제
```

## 주요 파일 설명

### index.js
- 메인 실행 스크립트
- CLI 인터페이스 제공
- 패키지 목록 파싱, 설치 여부 확인, 사용 여부 검색, 리포트 생성

### package.json
- npm 패키지 메타데이터
- bin 설정으로 전역 명령어 제공
- Node.js 12+ 요구사항

### README.md / README_KR.md
- 프로젝트 소개 및 사용법
- 설치 방법, 예제, 제한사항 포함

## 다음 단계

1. **GitHub 저장소 생성**
   - https://github.com/new 에서 새 저장소 생성
   - `package-usage-checker` 이름으로 생성

2. **초기 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "Initial commit: Package Usage Checker v1.0.0"
   git remote add origin https://github.com/YOUR_USERNAME/package-usage-checker.git
   git branch -M main
   git push -u origin main
   ```

3. **npm 배포 (선택사항)**
   ```bash
   npm login
   npm publish
   ```

4. **package.json 업데이트**
   - author 정보 추가
   - repository URL 업데이트
   - bugs, homepage URL 업데이트

## 기능 요약

✅ 패키지 목록 파일에서 패키지 읽기
✅ package-lock.json에서 설치된 패키지 추출
✅ 소스 코드에서 패키지 사용 여부 검색
✅ 4가지 카테고리로 분류 (사용/미사용/미설치/목록외)
✅ 상세 리포트 생성
✅ CLI 인터페이스
✅ Scoped 패키지 지원
✅ 다양한 import 패턴 지원

## 기술 스택

- Node.js (>=12.0.0)
- 순수 JavaScript (의존성 없음)
- 파일 시스템 API
- 정규식 패턴 매칭

