# GitHub 저장소 설정 가이드

## 1단계: GitHub에서 저장소 생성

1. **GitHub에 로그인** 후 https://github.com/new 접속

2. **저장소 정보 입력**:
   - Repository name: `package-usage-checker`
   - Description: `A Node.js tool to check which packages from a list are installed and used in your project`
   - Visibility: Public (또는 Private)
   - ⚠️ **중요**: "Add a README file", "Add .gitignore", "Choose a license" 모두 **체크하지 마세요** (이미 파일들이 있음)

3. **"Create repository" 클릭**

## 2단계: 로컬 저장소와 연결

GitHub에서 저장소를 생성한 후, 아래 명령어를 실행하세요:

```bash
# 현재 디렉토리 확인
cd /home/leedo/gemini/work/package-usage-checker

# 리모트 저장소 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/package-usage-checker.git

# 또는 SSH를 사용하는 경우:
# git remote add origin git@github.com:YOUR_USERNAME/package-usage-checker.git

# 리모트 확인
git remote -v

# 브랜치 이름을 main으로 변경 (필요한 경우)
git branch -M main

# 첫 푸시
git push -u origin main
```

## 3단계: 인증 설정

### HTTPS 사용 시 (토큰 필요)

GitHub는 더 이상 비밀번호 인증을 지원하지 않으므로 Personal Access Token이 필요합니다:

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token" 클릭
3. 권한 선택: `repo` (전체 체크)
4. 토큰 생성 후 복사
5. `git push` 시 비밀번호 대신 토큰 입력

### SSH 사용 시

```bash
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t ed25519 -C "your_email@example.com"

# SSH 키를 GitHub에 추가
# 1. 공개 키 복사
cat ~/.ssh/id_ed25519.pub

# 2. GitHub → Settings → SSH and GPG keys → New SSH key
# 3. 복사한 키 붙여넣기

# SSH 연결 테스트
ssh -T git@github.com
```

## 빠른 설정 스크립트

아래 스크립트를 실행하면 자동으로 설정할 수 있습니다 (GitHub 사용자명 필요):

```bash
#!/bin/bash
read -p "GitHub 사용자명을 입력하세요: " GITHUB_USERNAME

cd /home/leedo/gemini/work/package-usage-checker

# 리모트가 이미 있으면 제거
git remote remove origin 2>/dev/null

# 리모트 추가
git remote add origin https://github.com/${GITHUB_USERNAME}/package-usage-checker.git

# 브랜치 이름 확인 및 변경
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
fi

# 상태 확인
echo ""
echo "=== 리모트 저장소 설정 완료 ==="
git remote -v
echo ""
echo "다음 명령어로 푸시하세요:"
echo "  git push -u origin main"
```

## 문제 해결

### "remote origin already exists" 오류
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/package-usage-checker.git
```

### "Permission denied" 오류
- HTTPS: Personal Access Token 사용 확인
- SSH: SSH 키가 GitHub에 등록되었는지 확인

### "Repository not found" 오류
- GitHub에 저장소가 실제로 생성되었는지 확인
- 저장소 이름과 사용자명이 정확한지 확인
- Private 저장소인 경우 접근 권한 확인

