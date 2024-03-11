# jxta-hash-router

적스터포즈 해쉬 라우터(Juxtapose-Hash-Router)는 Single Page Application(SPA) 사이트 해쉬(#) 라우터 라이브러리 입니다.

> 적스터포즈(Juxtapose)는 Juxtaposition에서 파생된 단어이고 "나란히 놓다"라는 뜻을 가지고 있고, "Jxta"는 약어입니다.

## 설치

다음 명령어로 이 라이브러리를 설치하세요:

```
git clone https://github.com/whoiseon/jxta-hash-router
```

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

#### Router 세팅하기
