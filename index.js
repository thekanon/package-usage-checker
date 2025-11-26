#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// CLI 인자 파싱
const args = process.argv.slice(2);
const packageListFile = args[0] || 'package-list.txt';
const sourceDir = args[1] || 'src';
const outputFile = args[2] || 'package-usage-report.txt';

// 패키지 목록 파일 읽기
function readPackageList(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const parts = line.split('\t');
        return {
          name: parts[0].trim(),
          version: parts[1] ? parts[1].trim() : '',
        };
      });
  } catch (error) {
    console.error(`❌ 패키지 목록 파일을 읽을 수 없습니다: ${filePath}`);
    console.error(`   오류: ${error.message}`);
    process.exit(1);
  }
}

// package.json 읽기
function readPackageJson() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    return {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };
  } catch (error) {
    console.warn('⚠️  package.json을 읽을 수 없습니다.');
    return {};
  }
}

// package-lock.json 읽기
function readPackageLock() {
  const allInstalledPackages = {};
  try {
    const packageLock = JSON.parse(fs.readFileSync('package-lock.json', 'utf-8'));

    if (packageLock.packages) {
      Object.keys(packageLock.packages).forEach((pkgPath) => {
        if (pkgPath === '') return;

        const pkgInfo = packageLock.packages[pkgPath];
        if (pkgInfo.version) {
          const pathParts = pkgPath.replace(/^node_modules\//, '').split('/');
          let pkgName;

          if (pathParts[0].startsWith('@')) {
            pkgName = pathParts.slice(0, 2).join('/');
          } else {
            pkgName = pathParts[0];
          }

          if (!allInstalledPackages[pkgName] || allInstalledPackages[pkgName] !== pkgInfo.version) {
            allInstalledPackages[pkgName] = pkgInfo.version;
          }
        }
      });
    }
  } catch (error) {
    console.warn('⚠️  package-lock.json을 읽을 수 없습니다. package.json만 사용합니다.');
    return readPackageJson();
  }
  return allInstalledPackages;
}

// 모든 소스 파일 목록 가져오기
function getAllSourceFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'build', 'dist', '.git', '.next', '.nuxt'].includes(file)) {
        getAllSourceFiles(filePath, fileList);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(file);
      if (['.ts', '.tsx', '.js', '.jsx', '.json'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// 소스 파일 목록 캐시
let sourceFiles = null;
function getSourceFiles(dir) {
  if (!sourceFiles) {
    sourceFiles = getAllSourceFiles(dir);
  }
  return sourceFiles;
}

// 소스 코드에서 패키지 사용 여부 확인
function checkPackageUsage(packageName, sourceDir) {
  try {
    const files = getSourceFiles(sourceDir);
    const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const patterns = [
      new RegExp(`from\\s+['"]${escapedPackageName}`, 'i'),
      new RegExp(`require\\(['"]${escapedPackageName}`, 'i'),
      new RegExp(`import.*['"]${escapedPackageName}`, 'i'),
      new RegExp(`['"]${escapedPackageName}['"]`, 'i'),
    ];

    if (packageName.startsWith('@')) {
      patterns.push(
        new RegExp(`from\\s+['"]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
        new RegExp(`require\\(['"]${packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i'),
      );
    }

    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        for (const pattern of patterns) {
          if (pattern.test(content)) {
            return true;
          }
        }
      } catch (e) {
        continue;
      }
    }

    return false;
  } catch (error) {
    return false;
  }
}

// 패키지 매칭
function findInstalledPackage(name, allInstalledPackages) {
  let isInstalled = name in allInstalledPackages;
  let installedVersion = allInstalledPackages[name];

  if (!isInstalled) {
    if (name.startsWith('@')) {
      const parts = name.split('/');
      const scope = parts[0];
      const pkgName = parts[1];

      for (const [installedName, installedVer] of Object.entries(allInstalledPackages)) {
        if (installedName === name || (installedName.startsWith(scope) && installedName.endsWith('/' + pkgName))) {
          isInstalled = true;
          installedVersion = installedVer;
          break;
        }
      }
    } else {
      for (const [installedName, installedVer] of Object.entries(allInstalledPackages)) {
        if (!installedName.startsWith('@')) {
          const installedBaseName = installedName.split('/')[0];
          if (installedBaseName === name) {
            isInstalled = true;
            installedVersion = installedVer;
            break;
          }
        }
      }
    }
  }

  return { isInstalled, installedVersion };
}

// 메인 함수
function main() {
  console.log('='.repeat(80));
  console.log('📦 Package Usage Checker');
  console.log('='.repeat(80));
  console.log(`패키지 목록 파일: ${packageListFile}`);
  console.log(`소스 디렉토리: ${sourceDir}`);
  console.log(`출력 파일: ${outputFile}`);
  console.log('');

  const packageList = readPackageList(packageListFile);
  const allInstalledPackages = readPackageLock();
  const directDependencies = readPackageJson();

  console.log('패키지 사용 여부 확인 중...\n');
  console.log(`직접 의존성 패키지 수: ${Object.keys(directDependencies).length}`);
  console.log(`전체 설치된 패키지 수 (package-lock.json 기준): ${Object.keys(allInstalledPackages).length}\n`);

  const results = {
    used: [],
    unused: [],
    notInstalled: [],
  };

  packageList.forEach((pkg, index) => {
    const { name, version } = pkg;
    const { isInstalled, installedVersion } = findInstalledPackage(name, allInstalledPackages);
    const isUsed = isInstalled ? checkPackageUsage(name, sourceDir) : false;

    if (isInstalled && isUsed) {
      results.used.push({ name, version, installedVersion });
    } else if (isInstalled && !isUsed) {
      results.unused.push({ name, version, installedVersion });
    } else {
      results.notInstalled.push({ name, version });
    }

    if ((index + 1) % 50 === 0) {
      console.log(`진행 중: ${index + 1}/${packageList.length}`);
    }
  });

  // 실제 설치된 패키지 중 목록에 없는 패키지도 확인
  const installedButNotInList = [];
  Object.keys(allInstalledPackages).forEach((installedPkg) => {
    const found = packageList.find((pkg) => {
      if (installedPkg === pkg.name) return true;
      if (installedPkg.startsWith('@') && pkg.name.startsWith('@')) {
        return installedPkg === pkg.name;
      }
      return false;
    });
    if (!found) {
      installedButNotInList.push({
        name: installedPkg,
        version: allInstalledPackages[installedPkg],
      });
    }
  });

  // 결과 텍스트 파일 생성
  const outputLines = [];
  outputLines.push('='.repeat(80));
  outputLines.push('패키지 사용 여부 분석 결과');
  outputLines.push(`생성 시간: ${new Date().toLocaleString('ko-KR')}`);
  outputLines.push('='.repeat(80));
  outputLines.push('');

  outputLines.push(`총 패키지 수: ${packageList.length}`);
  outputLines.push(`사용 중인 패키지: ${results.used.length}`);
  outputLines.push(`설치되었으나 미사용 패키지: ${results.unused.length}`);
  outputLines.push(`설치되지 않은 패키지: ${results.notInstalled.length}`);
  outputLines.push(`설치되었으나 목록에 없는 패키지: ${installedButNotInList.length}`);
  outputLines.push('');

  // 사용 중인 패키지
  outputLines.push('='.repeat(80));
  outputLines.push('✅ 사용 중인 패키지');
  outputLines.push('='.repeat(80));
  if (results.used.length > 0) {
    results.used.forEach((pkg) => {
      outputLines.push(`${pkg.name}\t${pkg.version || 'N/A'}\t설치 버전: ${pkg.installedVersion || 'N/A'}`);
    });
  } else {
    outputLines.push('없음');
  }
  outputLines.push('');

  // 설치되었으나 미사용 패키지
  outputLines.push('='.repeat(80));
  outputLines.push('⚠️  설치되었으나 미사용 패키지');
  outputLines.push('='.repeat(80));
  if (results.unused.length > 0) {
    results.unused.forEach((pkg) => {
      outputLines.push(`${pkg.name}\t${pkg.version || 'N/A'}\t설치 버전: ${pkg.installedVersion || 'N/A'}`);
    });
  } else {
    outputLines.push('없음');
  }
  outputLines.push('');

  // 설치되지 않은 패키지
  outputLines.push('='.repeat(80));
  outputLines.push('❌ 설치되지 않은 패키지');
  outputLines.push('='.repeat(80));
  if (results.notInstalled.length > 0) {
    results.notInstalled.forEach((pkg) => {
      outputLines.push(`${pkg.name}\t${pkg.version || 'N/A'}`);
    });
  } else {
    outputLines.push('없음');
  }
  outputLines.push('');

  // 설치되었으나 목록에 없는 패키지
  outputLines.push('='.repeat(80));
  outputLines.push('ℹ️  설치되었으나 목록에 없는 패키지');
  outputLines.push('='.repeat(80));
  if (installedButNotInList.length > 0) {
    installedButNotInList.forEach((pkg) => {
      outputLines.push(`${pkg.name}\t${pkg.version || 'N/A'}`);
    });
  } else {
    outputLines.push('없음');
  }

  // 파일로 저장
  fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');

  console.log('\n' + '='.repeat(80));
  console.log('분석 완료!');
  console.log('='.repeat(80));
  console.log(`총 패키지 수: ${packageList.length}`);
  console.log(`✅ 사용 중인 패키지: ${results.used.length}`);
  console.log(`⚠️  설치되었으나 미사용 패키지: ${results.unused.length}`);
  console.log(`❌ 설치되지 않은 패키지: ${results.notInstalled.length}`);
  console.log(`ℹ️  설치되었으나 목록에 없는 패키지: ${installedButNotInList.length}`);
  console.log(`\n결과 파일: ${outputFile}`);
}

// 실행
if (require.main === module) {
  main();
}

module.exports = { main, readPackageList, readPackageLock, checkPackageUsage };

