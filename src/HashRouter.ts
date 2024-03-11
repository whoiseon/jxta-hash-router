import { Match, Routes, Handler } from './JxtaHashRoute';

export default class JxtaHashRoute {
    /** 기본 라우트 */
    private root: string = '/';
    /** 등록된 라우트 배열 */
    private routes: Routes;
    /** 현재 사용자가 보고있는 라우트 */
    public current: Match | null = null;

    private loadEventOption: boolean;

    constructor(loadEvent?: boolean) {
        if (loadEvent === undefined) {
            this.loadEventOption = true;
        } else {
            this.loadEventOption = loadEvent;
        }

        /** 라우트 배열을 초기화 한다. */
        this.initRoute();
    }

    /**
     * 라우트를 등록하는 메서드
     * @param {string | RegExp} path 라우트 경로
     * @param {Handler} handler 라우트 핸들러
     * @returns {HashRouter} HashRouter 인스턴스
     */
    public on(path: string | RegExp, handler: Handler): JxtaHashRoute {
        this.routes.set(path.toString(), handler);

        /** 체인 형식으로 메서드를 연결해서 사용하기 위해서 인스턴스를 리턴한다. */
        return this;
    }

    /**
     * 404 페이지를 등록하는 메서드
     * @param {Handler} handler 라우트 핸들러
     * @returns {HashRouter}
     */
    public notFound(handler: Handler): JxtaHashRoute {
        this.on('*', handler);

        /** 체인 형식으로 메서드를 연결해서 사용하기 위해서 인스턴스를 리턴한다. */
        return this;
    }

    /**
     * 라우트를 제거하는 메서드
     * @param {string | RegExp} path 라우트 경로
     * @returns {void}
     */
    public off(path: string | RegExp): void {
        this.routes.delete(path.toString());
    }

    /**
     * 라우트를 해석하는 메서드
     * @returns {void}
     */
    public resolve(): void {
        /** DOMContentLoaded (페이지 로드 시) 이벤트가 발생하면 라우트를 해석한다. */
        window.addEventListener('DOMContentLoaded', (): void => {
            console.log('DOMContentLoaded');
            this.routeManager();
        });

        /** hashchange (해시값 변경 시) 이벤트가 발생하면 라우트를 해석한다. */
        window.addEventListener('hashchange', (): void => {
            console.log('hashchange');
            this.routeManager();
        });
    }

    /**
     * hash 값을 변경하는 메서드 (이동)
     * @param {string} path 이동할 경로
     */
    public navigate(path: string): void {
        window.location.hash = path;
    }

    /**
     * 현재 주소창의 url을 변경해주는 함수이다.
     * redirect와는 다른 개념으로 url만 변경하고 화면은 다시 그리지 않는다.
     * @param {string} url
     * @returns {void}
     */
    public rewrite(url: string): void {
        window.location.hash = `#${url}`;
    }

    /**
     * 현재 라우트를 새로고침하는 메서드
     */
    public refresh(): void {
        this.routeManager();
    }

    /**
     * 라우트를 해석하고 매칭되는 라우트가 있으면
     * 해당 라우트의 핸들러를 실행한다.
     * 그 과정에서 매칭된 라우트의 파라미터를 추출해서
     * match 객체에 할당한다.
     * @returns {void}
     */
    private routeManager(): void {
        /** 현재 주소 */
        const currentPath = this.getPath;
        /** 쿼리스트링을 가져오기 위해서 '?'를 기준으로 path와 query로 나눈다. */
        const [path, query] = currentPath.split('?');
        /** 쿼리스트링이 있으면 '?'를 포함해서 queryString에 할당한다. */
        const queryString = query ? `?${query}` : '';

        /** 해당 라우터의 정보를 콜백함수에서 사용할 수 있게
         * match 객체에 할당한다.
         */
        const match: Match = {
            url: window.location.href,
            asPath: path,
            queryString,
            params: new Map<string, string>(),
            query: new URLSearchParams(query),
        };

        /** 라우트를 순회하면서 현재 라우트와
         * 매칭되는 라우트가 있는지 확인한다.
         */
        for (const [regexPath, handler] of this.routes) {
            /** 매칭된 라우터를 가져오는 변수 */
            const matchResult = path.match(this.pathToRegex(regexPath).regex);

            /** 매칭된 라우터가 있으면 */
            if (matchResult) {
                /** 매칭된 라우터의 파라미터를 추출해서 match 객체에 할당한다. */
                const params = this.extractParams(
                    this.pathToRegex(regexPath).paramNames,
                    matchResult,
                );
                match.params = params;

                /** 매칭된 라우터의 handler를 실행한다. */
                handler(match);
                break;
            }
        }

        /** 현재 라우터의 정보를 할당한다. */
        this.current = match;
    }

    /**
     * 라우트 배열을 초기화하고
     * 페이지 접속 시 해쉬 값이 없으면 기본 라우트로 설정한다.
     * @returns {void}
     */
    private initRoute(): void {
        this.routes = new Map();

        if (window.location.hash === '') {
            window.location.hash = this.root;
        }
    }

    /**
     * 현재 해쉬 값(주소)을 가져오는 메서드
     * @returns {string}
     */
    private get getPath(): string {
        return window.location.hash.substring(1);
    }

    /**
     * 파라미터로 전달 받은 주소를 정규식으로 변환하는 메서드
     * @param { string } path
     * @returns { regex: RegExp; paramNames: string[] }
     */
    private pathToRegex(path: string): { regex: RegExp; paramNames: string[] } {
        /**
         * URL 경로에서 파라미터 패턴을 찾기 위한 정규식
         * ex) /about/:userId
         */
        const paramRegex = /:[^/]+/g;

        /** URL 경로에서 와일드카드 패턴을 찾기 위한 정규식 */
        const wildcardRegex = /\*/g;

        /** URL 경로에서 추추한 파라미터들을 저장하는 배열 */
        const paramNames: string[] = [];

        /**
         * 인자로 전달받은 path에서
         * 파라미터와 아일드카드 패턴을 추출하여
         * 정규식으로 대체한다.
         * @returns { '([^/]+)' }
         */
        let escapedPath = path.replace(paramRegex, (match) => {
            const paramName = match.slice(1);
            paramNames.push(paramName);
            return '([^/]+)';
        });

        // wildcardRegex를 (.*)로 대체하여 와일드카드 패턴을 처리한다.
        // 와일드카드는 어떤 문자열이든 올 수 있다는 의미이다.
        // ex) "/about/*" 와 같은 경로는 "/about/*" 뒤에 어떤 경로도 올 수 있음을 뜻한다.
        escapedPath = escapedPath.replace(wildcardRegex, '(.*)');

        // `/\//g`는 슬래시(/)를 찾는 정규식 패턴입니다.
        // `\\/`는 슬래시(/)를 이스케이프한 결과입니다.
        // 이 부분은 경로에서 슬래시(/) 문자를 정규식 패턴에 포함하기 위한 처리입니다.
        // 예를 들어, "/about/me"와 같은 경로는 정규식 패턴 "/about\\/me"로 변환된다.
        escapedPath = escapedPath.replace(/\//g, '\\/');

        // 정규식 패턴을 만들어서 리턴한다.
        const regexPattern = `^${escapedPath}$`;

        // 정규식 패턴과 추출한 파라미터들을 리턴한다.
        const regex = new RegExp(regexPattern);

        return { regex, paramNames };
    }

    /**
     * 매칭된 라우트의 파라미터를 추출해서 params Map 객체에 할당하는 메서드
     * @param {string[]} paramNames
     * @param {RegExpMatchArray} matchResult
     * @returns {Map<string, string>}
     */
    private extractParams(
        paramNames: string[],
        matchResult: RegExpMatchArray,
    ): Map<string, string> {
        const params = new Map<string, string>();

        // `paramNames` 배열과 `matchResult`를 사용하여 URL 경로에서 추출한 파라미터들을 `params` 맵에 저장한다.
        // `paramNames` 배열은 URL 경로에서 발견된 파라미터 이름들을 담고 있으며,
        // `matchResult`는 URL 경로와 일치하는 정규식 매치 결과이다.
        // 각 파라미터 이름과 매치 결과의 값을 `params` 맵에 등록한다.
        for (let i = 0; i < paramNames.length; i++) {
            const paramName = paramNames[i];
            const paramValue = matchResult[i + 1];
            params.set(paramName, paramValue);
        }

        return params;
    }
}
