let isInitialClientRoute = true;

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || !isInitialClientRoute) {
    return;
  }

  isInitialClientRoute = false;
  to.meta.viewTransition = false;
});
