const VIEW_TRANSITION_UPDATE_TIMEOUT_MS = 1500;

const isViewTransitionSupported = (
  document: Document
): document is Document & {
  startViewTransition: (callback: () => Promise<void>) => ViewTransition;
} => "startViewTransition" in document;

const shouldSkipViewTransition = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isPlainLeftClick = (event: MouseEvent) =>
  event.button === 0 &&
  !event.metaKey &&
  !event.ctrlKey &&
  !event.shiftKey &&
  !event.altKey;

const isSamePageHashNavigation = (url: URL) =>
  url.pathname === window.location.pathname &&
  url.search === window.location.search &&
  url.hash !== "";

const isHashOnlyRouteNavigation = (
  to: ReturnType<typeof useRoute>,
  from: ReturnType<typeof useRoute>
) =>
  to.path === from.path &&
  to.fullPath !== from.fullPath &&
  to.hash !== from.hash;

const isHistoryKeyboardShortcut = (event: KeyboardEvent) =>
  ((event.metaKey || event.altKey) &&
    (event.key === "ArrowLeft" || event.key === "ArrowRight")) ||
  (event.metaKey && (event.key === "[" || event.key === "]"));

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const isLazyRouteComponent = (
  component: unknown
): component is () => Promise<unknown> => typeof component === "function";

const getInternalRoutePath = (href: string) => {
  const url = new URL(href, window.location.href);

  if (url.origin !== window.location.origin || isSamePageHashNavigation(url)) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
};

const getHistoryPosition = () => {
  const position = window.history.state?.position;
  return typeof position === "number" ? position : null;
};

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let isTransitioning = false;
  let shouldTransitionHistoryNavigation = false;
  let lastHistoryPosition = getHistoryPosition();
  const preloadedRoutes = new Set<string>();

  const markHistoryNavigation = () => {
    shouldTransitionHistoryNavigation = true;
  };

  const waitForPageFinish = () =>
    new Promise<void>((resolve) => {
      const removeHook = nuxtApp.hook("page:finish", () => {
        removeHook();
        resolve();
      });
    });

  const preloadRoute = (to: string) => {
    if (preloadedRoutes.has(to)) {
      return;
    }

    preloadedRoutes.add(to);

    for (const record of router.resolve(to).matched) {
      for (const component of Object.values(record.components ?? {})) {
        if (isLazyRouteComponent(component)) {
          void component();
        }
      }
    }

    // Static hosts can serve the generated HTML immediately; warming it here
    // removes the first-click network wait when Nuxt has not prefetched yet.
    void fetch(to, { priority: "low" }).catch(() => {
      preloadedRoutes.delete(to);
    });
  };

  const preloadAnchorRoute = (event: Event) => {
    const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
      "a[href]"
    );
    const href = anchor?.getAttribute("href");

    if (!href || anchor?.target || anchor?.hasAttribute("download")) {
      return;
    }

    const routePath = getInternalRoutePath(href);

    if (routePath) {
      preloadRoute(routePath);
    }
  };

  const runWithViewTransition = (to: string) => {
    if (
      isTransitioning ||
      shouldSkipViewTransition() ||
      !isViewTransitionSupported(document)
    ) {
      void router.push(to);
      return;
    }

    isTransitioning = true;

    const transition = document.startViewTransition(async () => {
      const pageFinished = waitForPageFinish();

      await router.push(to);
      await Promise.race([
        pageFinished,
        wait(VIEW_TRANSITION_UPDATE_TIMEOUT_MS),
      ]);
      await nextTick();
    });

    transition.finished.finally(() => {
      isTransitioning = false;
    });
  };

  window.addEventListener("popstate", markHistoryNavigation, { capture: true });

  window.addEventListener(
    "keydown",
    (event) => {
      if (isHistoryKeyboardShortcut(event)) {
        markHistoryNavigation();
      }
    },
    { capture: true }
  );

  router.beforeResolve((to, from) => {
    const currentHistoryPosition = getHistoryPosition();
    const didHistoryPositionChange =
      currentHistoryPosition !== null &&
      lastHistoryPosition !== null &&
      currentHistoryPosition !== lastHistoryPosition;

    if (!shouldTransitionHistoryNavigation && !didHistoryPositionChange) {
      return;
    }

    shouldTransitionHistoryNavigation = false;

    if (
      isTransitioning ||
      shouldSkipViewTransition() ||
      !isViewTransitionSupported(document) ||
      isHashOnlyRouteNavigation(to, from)
    ) {
      return;
    }

    isTransitioning = true;

    return new Promise<void>((resolveNavigation) => {
      let didResolveNavigation = false;
      const resolveNavigationOnce = () => {
        if (didResolveNavigation) {
          return;
        }

        didResolveNavigation = true;
        resolveNavigation();
      };

      const transition = document.startViewTransition(async () => {
        const pageFinished = waitForPageFinish();

        resolveNavigationOnce();
        await Promise.race([
          pageFinished,
          wait(VIEW_TRANSITION_UPDATE_TIMEOUT_MS),
        ]);
        await nextTick();
      });

      transition.finished.finally(() => {
        isTransitioning = false;
      });
    });
  });

  router.afterEach(() => {
    lastHistoryPosition = getHistoryPosition();
  });

  document.addEventListener(
    "click",
    (event) => {
      if (!isPlainLeftClick(event)) {
        return;
      }

      const anchor = (
        event.target as Element | null
      )?.closest<HTMLAnchorElement>("a[href]");

      if (
        !anchor ||
        anchor.target ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("data-no-view-transition") === "true"
      ) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href) {
        return;
      }

      const routePath = getInternalRoutePath(href);

      if (!routePath) {
        return;
      }

      event.preventDefault();
      preloadRoute(routePath);
      runWithViewTransition(routePath);
    },
    { capture: true }
  );

  document.addEventListener("pointerenter", preloadAnchorRoute, {
    capture: true,
  });
  document.addEventListener("focusin", preloadAnchorRoute, { capture: true });
  document.addEventListener("touchstart", preloadAnchorRoute, {
    capture: true,
    passive: true,
  });
});
