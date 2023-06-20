export interface Route {
  path: string | RegExp;
  keys: RoutePramsKey[];
  handler: Handler;
}

export interface RoutePramsKey {
  name: string;
  pattern: string;
}

export type Routes = Map<string, Handler>;

export type Handler = (match?: Match) => void;

export interface Match {
  url: string;
  asPath: string;
  queryString: string;
  params: Map<string, string>;
  query: URLSearchParams | null;
}
