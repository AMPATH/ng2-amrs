/**
 * Loads a whole patient list a page at a time, several pages at once, and
 * reports the rows read so far after every page so the caller can show
 * progress. Rows are returned in page order whatever order the pages arrive in.
 */
export interface PagedLinelistOptions {
  /** Patients per page. */
  pageSize: number;
  /** Pages fetched at the same time. */
  concurrency: number;
  /** Returns true once the caller no longer wants the list (e.g. left the page). */
  isCancelled?: () => boolean;
  /** Called with every row read so far, in order, after each page. */
  onProgress?: (rows: Array<any>) => void;
}

/**
 * Page size for a list of `expected` patients: about eight pages, so the
 * progress bar moves visibly while the number of queries stays close to the
 * concurrency (each page costs about as much as the whole list on these
 * reports). Never under 300; without a figure, 1000.
 */
export function linelistPageSize(expected: number): number {
  if (!expected) {
    return 1000;
  }
  return Math.max(300, Math.ceil(expected / 8 / 100) * 100);
}

/** The figure a list was opened from, read off its `expected` query param. */
export function expectedFromParams(params: any): number {
  const value = params && params.expected;
  return value !== undefined && value !== null && value !== '' && !isNaN(+value)
    ? +value
    : null;
}

export function loadAllPages(
  fetchPage: (startIndex: number, limit: number) => Promise<Array<any>>,
  options: PagedLinelistOptions
): Promise<Array<any>> {
  const pages = new Map<number, Array<any>>();
  const size = options.pageSize;
  const cancelled = () => !!(options.isCancelled && options.isCancelled());
  let next = 0;
  let end: number = null;
  let failure: any = null;

  const rowsSoFar = () =>
    Array.from(pages.keys())
      .sort((a, b) => a - b)
      .filter((start) => end === null || start <= end)
      .reduce((rows, start) => rows.concat(pages.get(start)), []);

  const worker = async () => {
    while (!cancelled() && failure === null && end === null) {
      const start = next;
      next += size;
      let page: Array<any>;
      try {
        page = (await fetchPage(start, size)) || [];
      } catch (err) {
        failure = err || new Error('Page failed');
        return;
      }
      if (cancelled() || end === 0) {
        return;
      }
      if (page.length > size) {
        // The server ignored the paging and sent the whole list: that is the
        // answer, and there is nothing more to ask for.
        pages.clear();
        pages.set(0, page);
        end = 0;
        if (options.onProgress) {
          options.onProgress(page);
        }
        return;
      }
      pages.set(start, page);
      if (page.length < size) {
        end = end === null ? start : Math.min(end, start);
      }
      if (options.onProgress) {
        options.onProgress(rowsSoFar());
      }
    }
  };

  const workers = [];
  for (let i = 0; i < Math.max(1, options.concurrency); i++) {
    workers.push(worker());
  }
  return Promise.all(workers).then(() => {
    if (failure !== null) {
      throw failure;
    }
    return rowsSoFar();
  });
}
