let isInitialClientRoute = true;

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || !isInitialClientRoute) {
    return;
  }

  isInitialClientRoute = false;

  if (to.path !== "/") {
    to.meta.viewTransition = false;
  }
});
