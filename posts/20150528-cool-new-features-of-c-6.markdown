---
title: "Cool New Features of C# 6"
slug: "cool-new-features-of-csharp-6"
date: 2015-05-28
unsplash_id: 466ENaLuhLY
tags: [c#, language, roslyn]
aliases:
    - /blog/cool-new-features-of-c-6/
---

<p class="lead">C# 6.0 is coming soon, and being a brand spanking new compiler there's a bunch of new features and fixes to the language.</p>

Here's the list.

- <a href="#autopropinit">Auto-property Initializers</a>
- <a href="#getteronlyprop">Getter-only Auto-properties</a>
- <a href="#staticusing">Static Using</a>
- <a href="#indexinit">Index Initializers</a>
- <a href="#catchawait">`await` Inside Catch/Finally Block</a>
- <a href="#exceptionfilters">Exception Filters</a>
- <a href="#expressionbodies">Expression-bodied Members</a>
- <a href="#nullconditional">Null Conditional</a>
- <a href="#stringinterpolation">String Interpolation</a>
- <a href="#nameof">`nameof` Operator</a>

#### <a id="autopropinit">Auto-property Initializers</a>

You can now set a default value for auto-properties directly on the property, instead of in the constructor.

```csharp
public int X { get; set; } = x;
```

#### <a id="getteronlyprop">Getter-only Auto-properties</a>

A getter only property is just that, a property that only has a getter. Previously you had to define the backing field and manually write the getter yourself. But now you can do this.

```csharp
public int Y { get; } = y;
```

This means you can also assign getter-only auto-properties within your constructor only, like readonly fields.

#### <a id="staticusing">Static Using</a>

In C# 6 it's possible to reference a static class with a using alias, and avoid having to repeat the class name in code.

```csharp
using static System.Console;
class Program
{
	static void Main()
	{
		WriteLine("Hello World");
		ReadLine();
	}
}
```

#### <a id="indexinit">Index Initializers</a>

In C# 6 you can now initialize an object that has an index property as part of an object initialization.

```csharp
var dictionary = new Dictionary<string, int> {
	["three"] = 3,
	["seven"] = 7
};
```

#### <a id="catchawait">Await Inside Catch/Finally Block</a>

Prior to C# 6 you couldn't use `await` inside a `catch` or `finally` block. Instead you'd get `error CS1985: Cannot await in the body of a catch clause`. Now you can! Enjoy.

#### <a id="exceptionfilters">Exception Filters</a>

This has been available in VisualBasic for a while now, and now C# can do this too.

```csharp
try {
	// web code
}
catch (WebException ex) when (ex.Status == WebExceptionStatus.Timeout)
{
	// log timeout
}
catch (WebException ex) when (ex.Status == WebExceptionStatus.ConnectionClosed)
{
	// log connection closed
}
catch (WebException ex)
{
	// all other WebExceptions
}
```

#### <a id="expressionbodies">Expression-bodied Members</a>

If you have methods or getter-only properties with a single line of code, you can now define that method with simpler syntax.

```csharp
public string ToString() => FirstName + " " + LastName;

public string FullName => FirstName + " " + LastName;
```

#### <a id="nullconditional">Null Conditional</a>

Have you ever chained a bunch of properties and methods together, only to find one of the links in the chain returns `null`? Well now you can use the Null-Conditional Operator (`?.`) to handle `null` for you.

```csharp
string x = something?.withproperty?.CallsMethod()?.Value;
```

How does it work? The entire expression will evaluate, but if any of the subexpressions return `null` then the whole thing returns the default value for the expression, which in this case is a `null string`.

If the expression ended with a value type, like `int`, then the default value would be `0`. I recommend using `int?` so you can check if the expression failed by checking for `null`.

#### <a id="stringinterpolation">String Interpolation</a>

You know how in Razor you can escape the html to evaulate code? Now you can do the same thing in C#.

```csharp
public string ToString() => $"{FirstName} {LastName}";
```

The bit inside the braces `{}` is evaluated as C# code, which means you can put expressions in there too.

```csharp
WriteLine($"The distance is {Sqrt(p.x * p.x + p.y * p.y)} meters.");
```

#### <a id="nameof">Nameof Operator</a>

There is now a `nameof` operator that returns the name of the item as a string.

```csharp
throw new ArgumentNullException(nameof(item));
```

The benefit of this is that the whole thing is now rename safe.
