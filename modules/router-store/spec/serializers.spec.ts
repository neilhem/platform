import { RouterStateSnapshot } from '@angular/router';
import {
  DefaultRouterStateSerializer,
  MinimalRouterStateSerializer,
} from '../src';

describe('default serializer', () => {
  it('should serialize all properties', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = createRouteSnapshot();
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = {
      url: 'url',
      root: createExpectedSnapshot(),
    };
    expect(actual).toEqual(expected);
  });

  it('should serialize with an empty routeConfig', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = { ...createRouteSnapshot(), routeConfig: null };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = {
      url: 'url',
      root: {
        ...createExpectedSnapshot(),
        routeConfig: null,
        component: undefined,
      },
    };
    expect(actual).toEqual(expected);
  });

  it('should serialize children', () => {
    const serializer = new DefaultRouterStateSerializer();
    const snapshot = {
      ...createRouteSnapshot(),
      children: [createRouteSnapshot('child')],
    };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);

    const expected = {
      url: 'url',
      root: {
        ...createExpectedSnapshot(),
        firstChild: createExpectedSnapshot('child'),
        children: [createExpectedSnapshot('child')],
      },
    };

    expect(actual).toEqual(expected);
  });

  function createExpectedSnapshot(prefix = 'root') {
    return {
      ...createRouteSnapshot(prefix),
      component: `${prefix}-route.routeConfig.component`,
      root: undefined,
      parent: undefined,
      firstChild: undefined,
      pathFromRoot: undefined,
    };
  }
});

describe('minimal serializer', () => {
  it('should serialize only the minimal properties', () => {
    const serializer = new MinimalRouterStateSerializer();
    const snapshot = createRouteSnapshot();
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = createExpectedSnapshot();
    expect(actual).toEqual(expected);
  });

  it('should serialize using firstChild', () => {
    const serializer = new MinimalRouterStateSerializer();
    const snapshot = {
      ...createRouteSnapshot(),
      firstChild: createRouteSnapshot('child'),
    };
    const routerState = {
      url: 'url',
      root: snapshot,
    } as RouterStateSnapshot;

    const actual = serializer.serialize(routerState);
    const expected = createExpectedSnapshot('child');
    expect(actual).toEqual(expected);
  });

  function createExpectedSnapshot(prefix = 'root'): any {
    return {
      url: `url`,
      data: `root-route.data`,
      queryParams: `root-route.queryParams`,
      params: `${prefix}-route.params`,
    };
  }
});

function createRouteSnapshot(prefix = 'root'): any {
  return {
    params: `${prefix}-route.params`,
    paramMap: `${prefix}-route.paramMap`,
    data: `${prefix}-route.data`,
    url: `${prefix}-route.url`,
    outlet: `${prefix}-route.outlet`,
    routeConfig: {
      component: `${prefix}-route.routeConfig.component`,
      path: `${prefix}-route.routeConfig.path`,
      pathMatch: `${prefix}-route.routeConfig.pathMatch`,
      redirectTo: `${prefix}-route.routeConfig.redirectTo`,
      outlet: `${prefix}-route.routeConfig.outlet`,
    },
    queryParams: `${prefix}-route.queryParams`,
    queryParamMap: `${prefix}-route.queryParamMap`,
    fragment: `${prefix}-route.fragment`,
    root: `${prefix}-route.root`,
    parent: `${prefix}-route.parent`,
    pathFromRoot: `${prefix}-route.params`,
    firstChild: null,
    children: [],
  };
}
