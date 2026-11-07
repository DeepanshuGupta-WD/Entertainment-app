import { useBookmarksQuery, useToggleBookmarkMutation } from '../store/api';

export function useBookmarks() {
  const { data = [] } = useBookmarksQuery();
  const [toggleBookmark] = useToggleBookmarkMutation();
  const has = (item) => data.some((b) => b.id === item.id && b.mediaType === item.mediaType);
  const toggle = (item) => toggleBookmark(item);
  return { bookmarks: data, has, toggle };
}
