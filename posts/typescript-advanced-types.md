---
title: "TypeScript 类型体操实战"
date: "2026-02-20"
tags: ["TypeScript", "类型系统", "前端开发"]
category: "技术"
excerpt: "TypeScript 的类型系统非常强大，掌握高级类型技巧可以让代码更加健壮和易维护。本文通过实战案例深入浅出地讲解 TypeScript 的高级类型。"
---

TypeScript 的类型系统是其最强大的特性之一。除了基本的类型注解，它还提供了许多高级类型工具，让我们可以构建复杂而精确的类型定义。

## 泛型基础

泛型是 TypeScript 类型系统的基础，它允许我们在定义函数、接口或类时不预先指定具体类型：

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用
const str = identity<string>("hello");
const num = identity<number>(42);
```

## 条件类型

条件类型允许我们根据条件选择不同的类型：

```typescript
type IsArray<T> = T extends any[] ? true : false;

type Test1 = IsArray<string[]>; // true
type Test2 = IsArray<string>; // false
```

## 映射类型

映射类型允许我们基于旧类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// 等价于:
// {
//   readonly name: string;
//   readonly age: number;
// }
```

## 实用工具类型

TypeScript 提供了许多内置的实用工具类型：

### Partial

将所有属性变为可选：

```typescript
type PartialUser = Partial<User>;
// { name?: string; age?: number }
```

### Required

将所有属性变为必需：

```typescript
type RequiredUser = Required<Partial<User>>;
// { name: string; age: number }
```

### Pick

选择一组属性：

```typescript
type UserSummary = Pick<User, 'name'>;
// { name: string }
```

### Omit

排除一组属性：

```typescript
type CreateUserInput = Omit<User, 'id'>;
// { name: string; age: number }
```

### Record

构建一个对象类型，其属性键来自某个类型：

```typescript
type UserRole = 'admin' | 'user' | 'guest';

type RolePermissions = Record<UserRole, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};
```

## 高级技巧

### 递归类型

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Config {
  database: {
    host: string;
    port: number;
  };
  cache: {
    enabled: boolean;
  };
}

type PartialConfig = DeepPartial<Config>;
// {
//   database?: {
//     host?: string;
//     port?: number;
//   };
//   cache?: {
//     enabled?: boolean;
//   };
// }
```

### 模板字面量类型

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<'click'>; // "onClick"
type MouseMoveEvent = EventName<'mouseMove'>; // "onMouseMove"
```

## 实战案例

### 构建类型安全的 API 客户端

```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiEndpoint {
  method: HttpMethod;
  path: string;
}

type ApiRequest<T extends ApiEndpoint> = T extends { method: 'GET' }
  ? { params: Record<string, string> }
  : { body: unknown };

class ApiClient {
  async request<T extends ApiEndpoint>(
    endpoint: T,
    request: ApiRequest<T>
  ): Promise<Response> {
    // 类型安全的请求
  }
}
```

## 总结

TypeScript 的类型系统极其强大，掌握这些高级技巧可以让你的代码更加健壮和易于维护。关键是要理解这些工具背后的原理，并在适当的场景中使用它们。

记住：**类型系统的目的是提高代码质量，而不是增加复杂度**。在使用高级类型时，要确保代码仍然清晰易懂。