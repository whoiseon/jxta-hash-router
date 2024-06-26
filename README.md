# jxta-hash-router (JxtaHashRoute)

적스터포즈 해쉬 라우터(Juxtapose-Hash-Router)는 단일 페이지 애플리케이션(SPA)에서 경로(route) 관리를 위해 설계되었습니다. 경로에 따라 다른 화면이나 컴포넌트를 렌더링하기 위한 라이브러리 입니다.

> 적스터포즈(Juxtapose)는 Juxtaposition에서 파생된 단어이고 "나란히 놓다"라는 뜻을 가지고 있고, "Jxta"는 약어입니다.

## 설치

다음 명령어로 이 라이브러리를 설치하세요:

```
git clone https://github.com/whoiseon/jxta-hash-router
```

> [JS 빌드 버전 다운로드](https://github.com/whoiseon/jxta-hash-router/releases/tag/v1.0.0)

## 왜 jxta-hash-router를 쓰나요?

-   SPA웹 프로토타입 등 간단한 프로젝트를 진행할 때 빠르게 테스트를 할 수 있음.
-   사용하기 쉬움
-   타입스크립트 지원

## 사용법

#### 먼저, Router를 선언하세요.

프로젝트 최상위 `js` 또는 `ts`파일에 `jxta-hash-route` 임포트 후 선언하세요.

```typescript
import JxtaHashRoute from './JxtaHashRoute';

export default class StartUp {
    private Router: JxtaHashRoute;

    constructor() {
        this.Router = new JxtaHashRoute();
    }
}
```

## Router 세팅하기

현재 프로젝트 예시에서 사용되고 있는 방법입니다. 아래는 예시일 뿐이며 `on` 함수와 함께 한다면 어떠한 방식을 이용하셔도 정상적으로 작동합니다.

### 경로 설정

`on(path: string, callaback: (match?: Match) => void)`: 지정된 경로(path)에 대한 콜백(callback)을 설정합니다. 콜백함수는 경로가 일치할 때 실행됩니다.

예: `"/"`, `"/about"` 등의 경로에 대해 각각 `Home`, `About` 컴포넌트를 초기화 합니다.

```typescript
.on('/', (match) => {
    const home = new Home();
})
.on('/about', (match) => {
    const about = new About();
})
```

### 동적 경로 매개변수(:param)

`"/about/:userId"`, `"/user/:userId/:name"`과 같이 경로에 변수를 포함시킬 수 있습니다. 이 변수들은 `match.params.get('paramName')`을 통해서 접근할 수 있습니다.

예: `"/user/:userId/:name"` 경로는 `MyPage` 컴포넌트를 초기화하며, `userId`와 `name`을 매개변수로 전달합니다.

```typescript
.on('/about/:userId', (match) => {
    const about = new About({
        userId: match.params.get('userId'),
    });
})
.on('/user/:userId/:name', (match) => {
    const mypage = new MyPage({
        userId: match.params.get('userId'),
        name: match.params.get('name'),
    });
})
```

### Query String 접근 방법

경로에 대한 콜백 함수에서 `match` 인자를 통해 `query string`에 접근할 수 있습니다. `match` 객체 내에 포함된 `query` 프로퍼티는 URL에서 `query string`을 파싱하여 `URLSearchParams` 객체로 제공합니다. 이 객체를 사용하여 쉽게 `query string`의 값을 조회하고 관리할 수 있습니다.

예: `http://example.com/#/about?userId=123&info=extended`인 경우 `query string`을 다음과 같이 처리할 수 있습니다.

```typescript
.on('/about', (match) => {
    const queryParams = new URLSearchParams(match.query);

    const userId = queryParams.get('userId');
    const info = queryParams.get('info');

    console.log(`User ID: ${userId}, Info: ${info}`);

    const about = new About();
})
```

### 404 Not Found 처리

`.notFound(callback)`: 일치하는 경로가 없을 때 실행할 콜백 함수를 설정합니다.

예: 경로가 일치하지 않을 경우, `NotFound` 컴포넌트를 초기화합니다.

```typescript
.notFound((match) => {
    const notfound = new NotFound();
})
```

### 라우팅 활성화

`.resolve()`: 설정된 라우팅 규칙을 기반으로 현재 URL에 맞는 경로를 찾아 해당 콜백을 실행합니다.

```typescript
.on('/user/:userId/:name', (match) => {
    const mypage = new MyPage({
        userId: match.params.get('userId'),
        name: match.params.get('name'),
    });
    console.log(match);
})
.notFound((match) => {
    const notfound = new NotFound();
    console.log(match);
})
.resolve();
```
