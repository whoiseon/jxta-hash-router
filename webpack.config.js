const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

//소스 위치
const RootPath = path.resolve(__dirname);
const SrcPath = path.resolve(RootPath, 'src');
console.log(SrcPath);

//웹서버가 사용하는 폴더 이름
const WwwRoot = 'build';
//웹서버가 사용하는 폴더 위치
const WwwRootPath = path.resolve(__dirname, WwwRoot);

//템플릿 위치
const IndexHtmlPath = path.resolve(SrcPath, 'index.html');
//const IndexHtmlPath = path.resolve(SrcPath, "test01.html");
//결과물 출력 폴더 이름
let OutputFolder = 'development';
//결과물 출력 위치
let OutputPath = path.resolve(WwwRootPath, OutputFolder);
//결과물 출력 위치 - 상대 주소
let OutputPath_relative = path.resolve('/', OutputFolder);
/** 서비스 주소 - 테스트할때는 루트, 실서비스때는 해당 경로를 적는다. */
let OutputPath_PublicPath = '/';

module.exports = (env, argv) => {
    //릴리즈(프로덕션)인지 여부
    const EnvPrductionIs = argv.mode === 'production';
    if (true === EnvPrductionIs) {
        //릴리즈 출력 폴더 변경
        OutputFolder = 'production';
        OutputPath = path.resolve(WwwRootPath, OutputFolder);
        OutputPath_relative = path.resolve('/', OutputFolder);
    }

    return {
        /** 서비스 모드 */
        mode: EnvPrductionIs ? 'production' : 'development',
        devtool: 'eval',
        //devtool: "inline-source-map",
        resolve: {
            extensions: ['.js', '.ts'],
            alias: { '@': SrcPath },
        },
        output: {
            // 최종적으로 만들어질 js
            /** 빌드 위치 */
            path: OutputPath,
            /** 웹팩 빌드 후 최종적으로 만들어질 파일 */
            filename: 'app.js',
            publicPath: OutputPath_PublicPath,
        },
        module: {
            // 모듈 규칙
            rules: [
                // TypeScript 로더 설정
                {
                    test: /\.ts?$/i,
                    exclude: /node_modules/,
                    use: ['ts-loader'],
                },
            ],
        },
        plugins: [
            // 빌드한 결과물(예>번들파일)을 HTML에 삽입해주는 플러그인
            new HtmlWebpackPlugin({ template: IndexHtmlPath }),

            // 출력폴더를 비워주는 플러그인
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    '**/*',
                    '!robots.txt',
                    '!Upload',
                ],
            }),

            //그대로 출력폴더에 복사할 파일 지정
            new CopyPlugin({
                patterns: [
                    {
                        //모든 html파일 복사
                        from: './src/**/*.html',
                        to({ context, absoluteFilename }) {
                            //'src/'를 제거
                            let sOutDir = path
                                .relative(context, absoluteFilename)
                                .substring(4);
                            //index.html은 리액트가 생성해주므로 여기선 스킵한다.
                            if ('index.html' === sOutDir) {
                                //sOutDir = "index_Temp.html";
                                sOutDir = '';
                            }
                            //console.log("sOutDir : " + sOutDir);
                            return `${sOutDir}`;
                        },
                    },
                ],
                options: {
                    concurrency: 100,
                },
            }),
        ],

        devServer: {
            //https: {
            //    type: "https",
            //    options: {
            //        //ca: fs.readFileSync("C:\Users\Kim\AppData\Roaming\ASP.NET\https\reacttest2.pem"),
            //        //ca: fs.readFileSync(path.resolve(RootPath,"reacttest2.pem")),
            //        //key: fs.readFileSync("C:\Users\Kim\AppData\Roaming\ASP.NET\https\reacttest2.key"),
            //        //key: fs.readFileSync(path.resolve(RootPath, "reacttest2.key")),
            //        passphrase: 'webpack-dev-server',
            //        requestCert: true,
            //    }
            //},
            /** 서비스 포트 */
            port: '3060',
            /** 출력파일의 위치 */
            static: [path.resolve('./', 'build/development/')],
            /** 브라우저 열지 여부 */
            open: true,
            /** 핫리로드 사용여부 */
            hot: true,
            /** 라이브 리로드 사용여부 */
            liveReload: true,

            historyApiFallback: true,
        },
    };
};
