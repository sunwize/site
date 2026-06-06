const VIEW_TRANSITION_UPDATE_TIMEOUT_MS = 1500;

const isViewTransitionSupported = (
  document: Document,
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

const wait = (duration: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let isTransitioning = false;

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
      const pageFinished = new Promise<void>((resolve) => {
        const removeHook = nuxtApp.hook("page:finish", () => {
          removeHook();
          resolve();
        });
      });

      await router.push(to);
      await Promise.race([pageFinished, wait(VIEW_TRANSITION_UPDATE_TIMEOUT_MS)]);
      await nextTick();
    });

    transition.finished.finally(() => {
      isTransitioning = false;
    });
  };

  document.addEventListener(
    "click",
    (event) => {
      if (!isPlainLeftClick(event)) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[href]",
      );

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
        isSamePageHashNavigation(url)
      ) {
        return;
      }

      event.preventDefault();
      runWithViewTransition(`${url.pathname}${url.search}${url.hash}`);
    },
    { capture: true },
  );
});
