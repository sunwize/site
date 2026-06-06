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

const isCurrentPageNavigation = (url: URL) =>
  url.pathname === window.location.pathname &&
  url.search === window.location.search &&
  url.hash === window.location.hash;

const isHashOnlyRouteNavigation = (
  to: ReturnType<typeof useRoute>,
  from: ReturnType<typeof useRoute>
) =>
  to.path === from.path &&
  to.fullPath !== from.fullPath &&
  to.hash !== from.hash;

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

const getHistoryPosition = () => {
  const position = window.history.state?.position;
  return typeof position === "number" ? position : null;
};

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let isTransitioning = false;
  let shouldTransitionHistoryNavigation = false;
  let lastHistoryPosition = getHistoryPosition();

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

      const url = new URL(href, window.location.href);

      if (
        url.origin !== window.location.origin ||
        isCurrentPageNavigation(url) ||
        isSamePageHashNavigation(url)
      ) {
        return;
      }

      event.preventDefault();
      runWithViewTransition(`${url.pathname}${url.search}${url.hash}`);
    },
    { capture: true }
  );
});
