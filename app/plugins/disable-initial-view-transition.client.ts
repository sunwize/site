export default defineNuxtPlugin(() => {
  let isInitialClientRoute = true;
  const router = useRouter();

  router.beforeEach((to) => {
    if (!isInitialClientRoute) {
      return;
    }

    isInitialClientRoute = false;
    to.meta.viewTransition = false;
  });
});
