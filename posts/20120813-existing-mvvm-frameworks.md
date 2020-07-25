---
title: "Existing MVVM Frameworks"
slug: "existing-mvvm-frameworks"
date: 2012-08-13
unsplash_id: wjSJ1F4JUdk
aliases:
    - /blog/existing-mvvm-frameworks/
tags: ["architecture", "mvvm"]
---

<p class="lead">This post is part of a series about desktop application development in WPF using MVVM.</p>

Currently there are at least [19 MVVM frameworks](http://www.japf.fr/silverlight/mvvm/) out there as well as any number of privately rolled frameworks for doing MVVM style development. But what makes them MVVM frameworks?

Most frameworks implement some sort of base class or helper for implementing [`INotifyPropertyChanged`](http://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged.aspx) and some sort of [`ICommand`](http://msdn.microsoft.com/en-us/library/system.windows.input.icommand.aspx) implementation which usually just takes some code as a delegate and uses that as the commands body.

By far one of the most popular frameworks is [Caliburn.Micro](http://caliburnmicro.codeplex.com/). It's very easy to use, has good documentation and allows new projects to get going quickly. However it, like the other frameworks, doesn't address the issues I stated in the previous post. So once you've used Caliburm.Micro for anything other than a basic project with a handful of screens you start to see large ViewModels, and lots of hand cranked `INotifyPropertyChanged` code again.

Some [people](http://brendanforster.com/inotifypropertychanged-stop-the-madness.html) argue that you shouldn't be writing any code to deal with `INotifyPropertyChanged`. And they are right. But the problem with MVVM frameworks is they try to help you, and so their documentation ends up saying to implement a `ViewModel` do this...

```csharp
private string someProperty;
public string SomeProperty
{
    get { return someProperty; }
    set 
    {
        if (someProperty != value)
            return
        someProperty = value;
        MyFramework.SomeHelper(x => this.SomeProperty);
    }
}
```
    
Blergh!

Once you've learned to do this it keeps being done and people repeat the mistake. Instead there are tools like [NotifyPropertyWeaver](https://github.com/SimonCropp/NotifyPropertyWeaver) which can automate this sort of hand cranked donkey code for you.

And this is where I think the idea of an MVVM *framework* falls down. Instead what we should have is a technology stack that provides solutions to all the issues involved in making a non-trivial MVVM application.

So what is in my stack at the moment?

[Caliburn.Micro](http://caliburnmicro.codeplex.com/) - Used for View/ViewModel management only. I like how Caliburn.Micro is ViewModel driven, and controls the lifetime of a ViewModel, as well as providing a guard for closing a ViewModel so you can ask the user if they would like to save before closing, for example.

[ReactiveUI](http://www.reactiveui.net/) - I've come around to the whole reactive paradigm, especially when it's applied to ViewModels that have a PropertyChanged event. ReactiveUI allows me to watch a collection of ViewModels for any changes, and execute some code based on that. Another use is as a stream of progress events, and the UI subscribes to a sampling of that stream and displays the progress.

[Autofac](http://code.google.com/p/autofac/) - My [IoC](http://en.wikipedia.org/wiki/Inversion_of_control) of choice, but really you could use any here, with the possible exception of [Unity](http://unity.codeplex.com/). If you must use Microsoft use [MEF](http://mef.codeplex.com/). And as [Ian](http://twitter.com/Kiwipom) says, IoC a Nike technology, Just do it!

[PropertyChanged.Fody](https://github.com/SimonCropp/PropertyChanged) and [PropertyChanging.Fody](https://github.com/SimonCropp/PropertyChanging) (with [Fody](http://visualstudiogallery.msdn.microsoft.com/074a2a26-d034-46f1-8fe1-0da97265eb7a)) - Fody is Simon Cropp's project for generic post compile code injection, or [Aspect oriented Programming](http://en.wikipedia.org/wiki/Aspect-oriented_programming). PropertyChanged.Fody is the [successor](http://simoncropp.com/fodyandnotifypropertyweaver) to NotifyPropertyWeaver and so I tend to use it on newer projects. If you're already on NotifyPropertyWeaver give yourself a gold star, but don't worry about swapping if it does what you need.

[Automapper](http://automapper.org/) - Automapper is designed to take all the dull work of mapping two objects with the same properties to each other. This is brilliant for mapping say a Model (or DTO) to a ViewModel instead of being lazy and just shoving the Model towards the View and letting it fend for itself.

Is that all? Well no, there are other systems I use to make my life easier as a developer. Now that I've got the main subsystems that people know about out the way I'll talk about some other tools to help even more in my next post.
