/** Props typing */
interface IAboutProps {
    userId: string;
}

export default class About {
    private userId: number;

    constructor(props?: IAboutProps) {
        const root = document.getElementById('root');

        if (props) {
            this.userId = Number(props.userId);
        }

        if (root) {
            root.innerHTML = '';
            root.innerHTML = this.render();
        }
    }

    public render(): string {
        return `
        <div>
            <h1>About</h1>
            <div>
                <p>params: { userId: ${this.userId} }</p>
            </div>
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
