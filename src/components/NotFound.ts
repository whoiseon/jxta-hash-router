export default class NotFound {
  constructor(props?: any) {
    const root = document.getElementById('root');

    if (root) {
      root.innerHTML = '';
      root.innerHTML = this.render();
    }

    if (props) {
      console.log(props);
    }
  }

  public render(): string {
    return `
          <div>
              <h1>404 - Error</h1>
              <p>페이지를 찾을 수 없습니다.</p>
          <div>
              <a href="#/">home</a>
              <a href="#/about">about</a>
              <a href="#/about/1">user</a>
              <a href="#/user/1/hello">mypage</a>
              <a href="#/awefwaefwe">notFound</a>
          </div>
          </div>
      `;
  }
}
