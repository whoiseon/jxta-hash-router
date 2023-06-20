import Router from './HashRouter';

export default class StartUp {
  private router: Router;

  constructor() {
    this.router = new Router('/');
    this.configureRouter();
  }

  private configureRouter(): void {
    this.router
      .on('/', (match) => {
        console.log('home');
        console.log(match);
      })
      .on('/about', (match) => {
        console.log('about');
        console.log(match);
      })
      .on('/about/:userId', (match) => {
        console.log('about params');
        console.log(match);
      })
      .on('/user/:userId/:name', (match) => {
        console.log('user params');
        console.log(match);
      })
      .notFound((match) => {
        console.log('not found~');
        console.log(match);
      })
      .resolve();
  }
}

const app = new StartUp();
