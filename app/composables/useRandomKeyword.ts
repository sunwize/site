import { JS_KEYWORDS, type JsKeyword } from "~/utils/site";

const refresh = () => {
  const index = Math.floor(Math.random() * 1000) % JS_KEYWORDS.length;
  return JS_KEYWORDS[index] ?? "default";
};

export const useRandomKeyword = () => {
  const router = useRouter();

  const keyword = useState<JsKeyword>("random-js-keyword", () => refresh());

  router.afterEach((to, from) => {
    if (to.path !== from.path) {
      keyword.value = refresh();
    }
  });

  return {
    keyword,
    refresh,
  };
};
