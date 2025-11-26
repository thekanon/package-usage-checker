# Package Usage Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)](https://nodejs.org/)

📦 주어진 패키지 목록 중 어떤 패키지가 설치되어 있고 실제로 사용되고 있는지 분석하는 Node.js 도구입니다.

## 주요 기능

- ✅ 프로젝트에 설치된 패키지 확인
- ✅ 소스 코드에서 실제 사용 중인 패키지 감지
- ✅ 사용하지 않는 의존성 식별
- ✅ 상세한 사용 현황 리포트 생성
- ✅ Scoped 패키지 지원 (`@scope/package`)
- ✅ `package.json` 및 `package-lock.json` 지원

## 설치

### 전역 설치

```bash
npm install -g package-usage-checker
```

### 로컬 설치

```bash
npm install package-usage-checker
```

### 수동 설치

```bash
git clone https://github.com/yourusername/package-usage-checker.git
cd package-usage-checker
npm install
```

## 사용법

### 기본 사용법

1. 패키지 목록 파일 생성 (예: `package-list.txt`):

```
react	17.0.1
lodash	4.17.20
antd	4.12.3
@scope/package	1.0.0
```

형식: `패키지이름<TAB>버전` (한 줄에 하나씩)

2. 체커 실행:

```bash
package-usage-checker package-list.txt
```

### 고급 사용법

```bash
package-usage-checker [패키지목록파일] [소스디렉토리] [출력파일]
```

**매개변수:**
- `패키지목록파일`: 패키지 목록 파일 경로 (기본값: `package-list.txt`)
- `소스디렉토리`: 패키지 사용 여부를 검색할 디렉토리 (기본값: `src`)
- `출력파일`: 리포트 출력 파일 경로 (기본값: `package-usage-report.txt`)

**예제:**

```bash
# 커스텀 패키지 목록 파일
package-usage-checker my-packages.txt

# 커스텀 소스 디렉토리
package-usage-checker package-list.txt lib

# 커스텀 출력 파일
package-usage-checker package-list.txt src report.txt

# 모든 옵션 커스터마이징
package-usage-checker packages.txt src/ output.txt
```

## 출력 결과

도구는 다음 섹션으로 구성된 리포트 파일을 생성합니다:

1. **✅ 사용 중인 패키지**: 설치되어 있고 소스 코드에서 사용되는 패키지
2. **⚠️ 미사용 패키지**: 설치되어 있지만 소스 코드에서 사용되지 않는 패키지
3. **❌ 미설치 패키지**: 목록에는 있지만 프로젝트에 설치되지 않은 패키지
4. **ℹ️ 목록에 없는 설치된 패키지**: 프로젝트에 설치되어 있지만 제공된 목록에 없는 패키지

## 작동 원리

1. **패키지 목록 읽기**: 제공된 패키지 목록 파일 파싱
2. **의존성 분석**: `package-lock.json` (또는 `package.json`)에서 모든 설치된 패키지 추출
3. **소스 코드 스캔**: 소스 파일 (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`)에서 패키지 사용 여부 검색
4. **패턴 매칭**: 다음 패턴을 감지하기 위해 정규식 사용:
   - `import ... from 'package-name'`
   - `require('package-name')`
   - 다양한 import 문 형식
5. **리포트 생성**: 분류된 결과가 포함된 상세 텍스트 리포트 생성

## 지원하는 Import 패턴

도구는 다음 import 패턴을 감지합니다:

- ES6 imports: `import React from 'react'`
- Named imports: `import { Component } from 'react'`
- Namespace imports: `import * as React from 'react'`
- CommonJS: `const _ = require('lodash')`
- Dynamic imports: `import('react')`
- Scoped packages: `import from '@scope/package'`

## 제한사항

- ⚠️ 동적으로 구성된 import 경로는 감지할 수 없음
- ⚠️ 설정 파일(webpack.config.js 등)에서만 사용되는 패키지는 감지하지 않음
- ⚠️ 빌드 스크립트에서만 사용되는 패키지는 감지하지 않음
- ⚠️ 유사한 이름을 가진 패키지에 대해 오탐지가 발생할 수 있음

## 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해주세요.

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/AmazingFeature`)
3. 변경사항 커밋 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시 (`git push origin feature/AmazingFeature`)
5. Pull Request 열기

## 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 지원

문제가 발생하거나 질문이 있으시면 [GitHub](https://github.com/yourusername/package-usage-checker/issues)에 이슈를 열어주세요.

