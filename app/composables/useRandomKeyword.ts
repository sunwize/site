import { JS_KEYWORDS, type JsKeyword } from "~/utils/site";

export const useRandomKeyword = () => {
  const keyword = useState<JsKeyword>("random-js-keyword", () => "default");

  const refresh = () => {
    const index = Math.floor(Math.random() * 1000) % JS_KEYWORDS.length;
    keyword.value = JS_KEYWORDS[index] ?? "default";
  };

  onMounted(refresh);

  return {
    keyword,
    refresh,
  };
};
