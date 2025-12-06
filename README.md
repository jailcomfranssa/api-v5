## 📁 Folder Structure

```code

💻 API
├── 📁prisma
│   │
│   ├── 🗂️migrations
│   │
│   └── 📜schema.prisma
│
├── 📁src
│   │
│   ├── 📁config
│   │   │
│   │   ├── 📜logger.ts
│   │   │
│   │   └── 📜swagger.ts
│   │
│   ├── 📁errors
│   │   │
│   │   └── 📜AppError.ts
│   │
│   ├── 📁lib
│   │   │
│   │   └── 📜prisma.ts
│   │
│   ├── 📁middlewares
│   │   │
│   │   ├── 📜asyncHandler.ts
│   │   │
│   │   ├── 📜errorHandler.ts
│   │   │
│   │   └── 📜validateRequest.ts
│   │
│   ├── 📁model
│   │   │
│   │   └── 📁User
│   │       │
│   │       ├── 📜userRepository.ts
│   │       │
│   │       └── 📜userService.ts
│   │
│   ├── 📁schemas
│   │   │
│   │   └── 📜user.schema.ts
│   │
│   ├── 📜app.ts
│   │
│   └── 📜index.ts
│
├── 📜nodemon.json
│
├── 📜package-lock.json
│
├── 📜package.json
│
├── 📜prisma.config.ts
│
├── 📜README.md
│
└── 📜tsconfig.json
```