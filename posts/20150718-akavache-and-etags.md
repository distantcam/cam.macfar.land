---
title: "Akavache and ETags"
slug: "akavache-and-etags"
date: 2015-07-18
unsplash_id: J8YmnoMG2hg
tags: [akavache, etag, web, cache]
---

Akavache is a cool caching library from the prolific Anaïs Betts that simplifies caching of data in your application. I wanted to use it with web calls that provided an ETag for caching but Akavache didn't support this out of the box.

---

There's a method in Akavache called `GetAndFetchLatest` which sounded like what I wanted, but the fetch part was time based, not ETag, as the fetch could be anything not just a web query.

So I set out to implement my own version of `GetAndFetchLatest` that was web specific, and only updated the cache when there was new content from the server. First up I needed a method that would query the server using a given ETag, and return an empty result, or the new content. `GetAndFetchLatest` has a very nice mechanism where it returns an observable of results. First the cached version is published on the observable, then the fetched version, so you can perform an update as the newer data comes in.

### The Fetch part

For my method that fetches the data from the server it needed to be aware of the ETag protocol, and return an observable. The observable either has the new data, or is empty if the current ETag is up to date.

```csharp
private static IObservable<Tuple<string, string>> GetFromWeb(string url, string etag)
{
    return Observable.Create<Tuple<string, string>>(async observer =>
    {
        using (var client = CreateWebClient())
        {
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(url)
            };

            if (!string.IsNullOrEmpty(etag))
            {
                request.Headers.TryAddWithoutValidation("If-None-Match", etag);
            }

            var response = await client.SendAsync(request)
                .ConfigureAwait(false);

            if (!response.IsSuccessStatusCode && 
                response.StatusCode != HttpStatusCode.NotModified)
            {
                observer.OnError(new HttpRequestException(
                    "Status code: " + response.StatusCode));
            }
            else if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadAsStringAsync()
                    .ConfigureAwait(false);

                observer.OnNext(Tuple.Create(response.Headers.ETag.Tag, data));
            }
        }
        observer.OnCompleted();
    });
}
```

### The Get part

Combining this fetch method with cache calls requires some reactive magic. Thankfully the Reactive Extensions library contains a large number of methods that we can take advantage of.

First up we need to get the existing cached value, if it's available.

```csharp
var result = 
    // Get from cache
    cache.GetObject<string>(url)

    // Cached values are true
    .Select(x => Tuple.Create(x, true)) 

    // Turn exceptions into false
    .Catch(Observable.Return(Tuple.Create("", false))) 

    // If true, return an observable with the result, else an empty observable.
    .SelectMany(x => x.Item2 ? Observable.Return(x.Item1) : Observable.Empty<string>());
```

### Combining Get and Fetch

Now we need to create the Fetch observable. We also need to get and store the ETag in the cache.

```csharp
var fetch = 
    // Get the ETag from cache
    cache.GetObject<string>("etag-" + url)

    // Exceptions => Blank ETag
    .Catch(Observable.Return(""))

    // Call our web method
    .SelectMany(etag => GetFromWeb(url, etag)

    	// Invalidate the old and add the new etag to the cache
    	.SelectMany(x => cache.InvalidateObject<string>("etag-" + url).Select(_ => x))
    	.SelectMany(x => cache.InsertObject("etag-" + url, x.Item1).Select(_ => x))

    	// Invalidate the old and add the new data to the cache
    	.SelectMany(x => cache.InvalidateObject<string>(url).Select(_ => x))
    	.SelectMany(x => cache.InsertObject(url, x.Item2).Select(_ => x)))

    // Select the data from the tuple
    .Select(x => x.Item2);

return result
    .Concat(fetch)
    .Replay()
    .RefCount();
```

The full extension method is available [here](https://gist.github.com/distantcam/06e08761a3c5884949fe).
