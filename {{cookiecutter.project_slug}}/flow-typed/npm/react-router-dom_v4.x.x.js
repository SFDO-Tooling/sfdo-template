// flow-typed signature: b7f98c6a7afc32bb93cf5d468d7d757a
// flow-typed version: b999c93144/react-router-dom_v4.x.x/flow_>=v0.63.x

declare module "react-router-dom" {
  declare export var BrowserRouter: React$ComponentType<{|
    basename?: string,
    forceRefresh?: boolean,
    getUserConfirmation?: GetUserConfirmation,
    keyLength?: number,
    children?: React$Node
  |}>

  declare export var HashRouter: React$ComponentType<{|
    basename?: string,
    getUserConfirmation?: GetUserConfirmation,
    hashType?: "slash" | "noslash" | "hashbang",
    children?: React$Node
  |}>

  declare export var Link: React$Component<{
    className?: string,
    to: string | LocationShape,
    replace?: boolean,
    children?: React$Node
  }>

  declare export var NavLink: React$Component<{
    to: string | LocationShape,
    activeClassName?: string,
    className?: string,
    activeStyle?: Object,
    style?: Object,
    isActive?: (match: Match, location: Location) => boolean,
    children?: React$Node,
    exact?: boolean,
    strict?: boolean
  }>

  // NOTE: Below are duplicated from react-router. If updating these, please
  // update the react-router and react-router-native types as well.
  declare export type Location = {
    pathname: string,
    search: string,
    hash: string,
    state?: any,
    key?: string
  };

  declare export type LocationShape = {
    pathname?: string,
    search?: string,
    hash?: string,
    state?: any
  };

  declare export type HistoryAction = "PUSH" | "REPLACE" | "POP";

  declare export type RouterHistory = {
    length: number,
    location: Location,
    action: HistoryAction,
    listen(
      callback: (location: Location, action: HistoryAction) => void
    ): () => void,
    push(path: string | LocationShape, state?: any): void,
    replace(path: string | LocationShape, state?: any): void,
    go(n: number): void,
    goBack(): void,
    goForward(): void,
    canGo?: (n: number) => boolean,
    block(
      callback: (location: Location, action: HistoryAction) => boolean
    ): void,
    // createMemoryHistory
    index?: number,
    entries?: Array<Location>
  };

  declare export type Match = {
    params: { [key: string]: ?string },
    isExact: boolean,
    path: string,
    url: string
  };

  declare export type ContextRouter = {|
    history: RouterHistory,
    location: Location,
    match: Match,
    staticContext?: StaticRouterContext
  |};

  declare type ContextRouterVoid = {
    history: RouterHistory | void,
    location: Location | void,
    match: Match | void,
    staticContext?: StaticRouterContext | void
  };

  declare export type GetUserConfirmation = (
    message: string,
    callback: (confirmed: boolean) => void
  ) => void;

  declare export type StaticRouterContext = {
    url?: string
  };

  declare export var StaticRouter: React$Component<{|
    basename?: string,
    location?: string | Location,
    context: StaticRouterContext,
    children?: React$Node
  |}>

  declare export var MemoryRouter: React$Component<{|
    initialEntries?: Array<LocationShape | string>,
    initialIndex?: number,
    getUserConfirmation?: GetUserConfirmation,
    keyLength?: number,
    children?: React$Node
  |}>

  declare export var Router: React$Component<{|
    history: RouterHistory,
    children?: React$Node
  |}>

  declare export var Prompt: React$Component<{|
    message: string | ((location: Location) => string | boolean),
    when?: boolean
  |}>

  declare export var Redirect: React$Component<{|
    to: string | LocationShape,
    push?: boolean,
    from?: string,
    exact?: boolean,
    strict?: boolean
  |}>

  declare export var Route: React$Component<{|
    component?: React$ComponentType<*>,
    render?: (router: ContextRouter) => React$Node,
    children?: React$ComponentType<ContextRouter> | React$Node,
    path?: string | Array<string>,
    exact?: boolean,
    strict?: boolean,
    location?: LocationShape,
    sensitive?: boolean
  |}>

  declare export var Switch: React$Component<{|
    children?: React$Node,
    location?: Location
  |}>

  declare export function withRouter<Props : {}, Component: React$ComponentType<Props>>(WrappedComponent: Component) : React$ComponentType<$Diff<React$ElementConfig<$Supertype<Component>>, ContextRouterVoid>>;

  declare type MatchPathOptions = {
    path?: string,
    exact?: boolean,
    sensitive?: boolean,
    strict?: boolean
  };

  declare export function matchPath(
    pathname: string,
    options?: MatchPathOptions | string,
    parent?: Match
  ): null | Match;

  declare export function generatePath(pattern?: string, params?: Object): string;
}
