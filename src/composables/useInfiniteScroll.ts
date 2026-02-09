import { ref, watch, onUnmounted, type Ref } from "vue";

interface UseInfiniteScrollOptions {
  target: Ref<HTMLElement | null>;
  hasMore: Ref<boolean>;
  onLoadMore: () => Promise<void>;
  rootMargin?: string;
}

export function useInfiniteScroll({
  target,
  hasMore,
  onLoadMore,
  rootMargin = "200px",
}: UseInfiniteScrollOptions) {
  const loadingMore = ref(false);

  let observer: IntersectionObserver | null = null;

  function cleanup() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  function setup() {
    cleanup();
    if (!target.value) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore.value && !loadingMore.value) {
          loadMore();
        }
      },
      { rootMargin },
    );
    observer.observe(target.value);
  }

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return;

    loadingMore.value = true;
    try {
      await onLoadMore();
    } finally {
      loadingMore.value = false;
    }
  }

  watch(target, (el) => {
    if (el) {
      setup();
    } else {
      cleanup();
    }
  });

  onUnmounted(cleanup);

  return {
    loadingMore,
  };
}
