---
title: "Mitigating The Billion Dollar Mistake - Fody Edition"
slug: "mitigating-the-billion-dollar-mistake-fody-edition"
date: 2013-01-09
unsplash_id: ScEKf8u7y-c
tags: ["fody", "aop"]
excerpt: "Phil Haack recently wrote a post in which he talked about protecting <abbr>C#</abbr> code from null references by automatically adding guard code. Phil's implementation used PostSharp for the post compile injection. Instead I wanted to use Fody."
---

<a href="http://haacked.com/articles/AboutHaacked.aspx">Phil Haack</a> recently wrote a <a href="http://haacked.com/archive/2013/01/05/mitigate-the-billion-dollar-mistake-with-aspects.aspx">post</a> in which he talked about protecting <abbr>C#</abbr> code from null references by automatically adding guard code. Phil's implementation used PostSharp for the post compile injection. Instead I wanted to use Fody.

### Fody vs PostSharp

[Fody](https://github.com/Fody/Fody/) and [PostSharp](http://www.sharpcrafters.com/) are both post-compile tools that add extra code into your assembly. This is known as [Aspect Orientated Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming) and can be very useful for certain tasks.

PostSharp takes the approach of injecting generic hook code into your assembly, and then calling out to your aspect at runtime. Your aspect then runs, doing any code analysis and reflection at runtime to do it's work. (This was my experience with PostSharp <abbr>V1</abbr> ages ago. Apparently you can do some reflection at compile time in <abbr>V2.1</abbr>, but not all of it. See the [documentation](http://doc.sharpcrafters.com/postsharp-2.1/Default.aspx##PostSharp-2.1.chm/html/7480ca54-61c0-46c5-9914-60a58c3033e8.htm).) The final assembly still needs a reference to PostSharp, as well as any aspects you have added.

Also, for a simple 1 line method PostSharp produces this.

```csharp
// Note the [AllowNull] attribute is still in the code.
public void SomeMethod(string nonNullArg, [AllowNull] string nullArg)
{
    MethodExecutionArgs methodExecutionArgs = 
        new MethodExecutionArgs(this, new Arguments<string, string>
        {
            Arg0 = nonNullArg,
            Arg1 = nullArg
        });
    MethodExecutionArgs arg_25_0 = methodExecutionArgs;
    MethodBase m = SampleClass.<>z__Aspects.m15;
    arg_25_0.Method = m;
    SampleClass.<>z__Aspects.a3.OnEntry(methodExecutionArgs);
    if (methodExecutionArgs.FlowBehavior != FlowBehavior.Return)
    {
        Console.WriteLine(nonNullArg); // NOTE: This is our original line.
        SampleClass.<>z__Aspects.a3.OnSuccess(methodExecutionArgs);
    }
}
```

Not very clear at all!

In contrast, Fody extension only run at compile time. Fody uses [Mono.Cecil](http://www.mono-project.com/Cecil) to allow you to modify the <abbr>IL</abbr> before the Fody compile step writes the assembly back out. That assembly has no references to Fody, and the aspects are woven directly into the code. The problem with this approach is that you have to know <abbr>IL</abbr> in order to write your own Fody extension, whereas in PostSharp you just write a <abbr>.NET</abbr> assembly with the code you want executed at runtime.

```csharp
// Attribute removed from compiled code.
public void SomeMethod(string nonNullArg, string nullArg) 
{
    if (nonNullArg == null)
    {
        throw new ArgumentNullException("nonNullArg");
    }
    Console.WriteLine(nonNullArg); // NOTE: This is our original line.
}
```

Much cleaner, and easier to understand what this code is doing.

### How to use NullGuard

NullGuard is available via NuGet.

    PM> Install-Package NullGuard.Fody
    
As an extension to Fody it will automatically include Fody as a dependency.

Other Extensions
------------------

There are a bunch of other extensions for Fody, so most of the time you won't need to write a custom extension. You can find them by searching for '[Fody](http://nuget.org/packages?q=fody)' on NuGet.

Here are a few of my favourites.

- [**PropertyChanging.Fody**](https://github.com/Fody/PropertyChanging#readme) and [**PropertyChanged.Fody**](https://github.com/Fody/PropertyChanged#readme) If you do any sort of <abbr>MVVM</abbr> development then these are a lifesaver! Automatically inserts `PropertyChanging` and `PropertyChanged` code into property setters. Never have to call `OnPropertyChanged()` ever again!

- [**ModuleInit.Fody**](https://github.com/Fody/ModuleInit#readme) In <abbr>.NET</abbr> assemblies you can execute code when the assembly is loaded by putting it in a special class called `<Module>`. Unfortunately there is no way to access this class from <abbr>C#</abbr>. This extension allows you to write code that will execute when the `<Module>` is initialized.

- [**Validar.Fody**](https://github.com/Fody/Validar#readme) Similar to PropertyChanged.Fody this injects code to automatically implement `IDataErrorInfo` and `INotifyDataErrorInfo`. Our ViewModels keep getting smaller and smaller!
