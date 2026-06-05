import { JS_KEYWORDS, type JsKeyword } from "~/utils/site";

const DEFAULT_KEYWORD: JsKeyword = "default";

const refresh = () => {
  const index = Math.floor(Math.random() * 1000) % JS_KEYWORDS.length;
  return JS_KEYWORDS[index] ?? DEFAULT_KEYWORD;
};

export const useRandomKeyword = () => {
  const router = useRouter();

  const keyword = useState<JsKeyword>("random-js-keyword", () => DEFAULT_KEYWORD);

  if (import.meta.client) {
    router.afterEach((to, from) => {
      if (to.path !== from.path) {
        keyword.value = refresh();
      }
    });
  }

  return {
    keyword,
    refresh,
  };
};
