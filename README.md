# Package Usage Checker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://badge.fury.io/js/package-usage-checker.svg)](https://badge.fury.io/js/package-usage-checker)

📦 A Node.js tool to analyze which packages from a given list are installed and actually used in your project.

## Features

- ✅ Check if packages from a list are installed in your project
- ✅ Detect which installed packages are actually used in source code
- ✅ Identify unused dependencies
- ✅ Generate detailed usage reports
- ✅ Support for scoped packages (`@scope/package`)
- ✅ Works with `package.json` and `package-lock.json`

## Installation

### Global Installation

```bash
npm install -g package-usage-checker
```

### Local Installation

```bash
npm install package-usage-checker
```

### Manual Installation

```bash
git clone https://github.com/yourusername/package-usage-checker.git
cd package-usage-checker
npm install
```

## Usage

### Basic Usage

1. Create a package list file (e.g., `package-list.txt`) with the following format:

```
react	17.0.1
lodash	4.17.20
antd	4.12.3
@scope/package	1.0.0
```

Format: `package-name<TAB>version` (one package per line)

2. Run the checker:

```bash
package-usage-checker package-list.txt
```

### Advanced Usage

```bash
package-usage-checker [package-list-file] [source-directory] [output-file]
```

**Parameters:**
- `package-list-file`: Path to the package list file (default: `package-list.txt`)
- `source-directory`: Directory to search for package usage (default: `src`)
- `output-file`: Output report file path (default: `package-usage-report.txt`)

**Examples:**

```bash
# Custom package list file
package-usage-checker my-packages.txt

# Custom source directory
package-usage-checker package-list.txt lib

# Custom output file
package-usage-checker package-list.txt src report.txt

# All custom options
package-usage-checker packages.txt src/ output.txt
```

## Output

The tool generates a report file with the following sections:

1. **✅ Used Packages**: Packages that are installed and used in source code
2. **⚠️ Unused Packages**: Packages that are installed but not used in source code
3. **❌ Not Installed Packages**: Packages from the list that are not installed
4. **ℹ️ Installed but Not in List**: Packages installed in the project but not in the provided list

### Example Output

```
================================================================================
패키지 사용 여부 분석 결과
생성 시간: 2025. 11. 25. 오후 5:30:00
================================================================================

총 패키지 수: 100
사용 중인 패키지: 45
설치되었으나 미사용 패키지: 10
설치되지 않은 패키지: 45
설치되었으나 목록에 없는 패키지: 200

================================================================================
✅ 사용 중인 패키지
================================================================================
react	17.0.1	설치 버전: 17.0.1
lodash	4.17.20	설치 버전: 4.17.21
...
```

## How It Works

1. **Reads package list**: Parses the provided package list file
2. **Analyzes dependencies**: Extracts all installed packages from `package-lock.json` (or `package.json` as fallback)
3. **Scans source code**: Searches for package usage in source files (`.ts`, `.tsx`, `.js`, `.jsx`, `.json`)
4. **Pattern matching**: Uses regex patterns to detect:
   - `import ... from 'package-name'`
   - `require('package-name')`
   - Various import statement formats
5. **Generates report**: Creates a detailed text report with categorized results

## Supported Import Patterns

The tool detects the following import patterns:

- ES6 imports: `import React from 'react'`
- Named imports: `import { Component } from 'react'`
- Namespace imports: `import * as React from 'react'`
- CommonJS: `const _ = require('lodash')`
- Dynamic imports: `import('react')`
- Scoped packages: `import from '@scope/package'`

## Limitations

- ⚠️ Cannot detect dynamically constructed import paths
- ⚠️ Cannot detect packages used only in configuration files (webpack.config.js, etc.)
- ⚠️ Cannot detect packages used only in build scripts
- ⚠️ May have false positives for packages with similar names

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created with ❤️ for the open source community.

## Support

If you encounter any issues or have questions, please open an issue on [GitHub](https://github.com/yourusername/package-usage-checker/issues).

