import Router from './HashRouter';
import Home from './components/Home';
import About from './components/About';
import MyPage from './components/MyPage';
import NotFound from './components/NotFound';

export default class StartUp
{
  private router: Router;

  constructor()
  {
    this.router = new Router('/');
    this.configureRouter();
  }

  private configureRouter(): void
  {
    this.router
      .on('/', (match) =>
      {
        const home = new Home();
      })
      .on('/about', (match) =>
      {
        const about = new About();
        console.log(match);
      })
      .on('/about/:userId', (match) =>
      {
        const about = new About({
          userId: match.params.get('userId'),
        });
        console.log(match);
      })
      .on('/user/:userId/:name', (match) =>
      {
        const mypage = new MyPage({
          userId: match.params.get('userId'),
          name: match.params.get('name'),
        });
        console.log(match);
      })
      .notFound((match) =>
      {
        const notfound = new NotFound();
        console.log(match);
      })
      .resolve();
  }
}

const app = new StartUp();
