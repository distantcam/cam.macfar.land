---
title: "The State of MVVM"
slug: "the-state-of-mvvm"
date: 2012-08-07
unsplash_id: Oaqk7qqNh_c
aliases:
    - /blog/the-state-of-mvvm/
tags: ["architecture", "mvvm"]
---

<p class="lead">Ok, so I've been meaning to (procrastinating actually) write a blog entry for a while now.</p>

Over the past year or so I've been struggling to come up with a simple, easy, repeatable way to develop applications for WPF. And while the [**M**odel-**V**iew-**V**iew**M**odel](http://en.wikipedia.org/wiki/Model_View_ViewModel) (**MVVM**) pattern gets us a long way there it's not without issues.

Other people have tried addressing the shortcomings of WPF by going for a [**M**odel-**V**iew-**C**ontroller](http://en.wikipedia.org/wiki/Model-view-controller) (**MVC**) pattern, but this implies a navigation style user experience, which isn't always the case. Take multi-document interfaces for example, where there may be multiple `Views` open, all of which are active (documents, tool windows, etc.).

So instead I decided to tackle the issues as I saw them with using the MVVM pattern. The most major issues I had were:

* *Mega-ViewModels* - `ViewModels` that because they do so much, require massive amounts of services and a massive amount of code, effectively making them [God objects](http://en.wikipedia.org/wiki/God_object). This also breaks the [Single Responsibility Principle](http://en.wikipedia.org/wiki/Single_responsibility_principle).

* *UI Models* - This is the term I use to describe a `Model` that has been presented directly to the `View` either through the `ViewModel` or not. An easy way to spot these objects is they are a `Model`, but they implement [`INotifyPropertyChanged`](http://msdn.microsoft.com/en-us/library/system.componentmodel.inotifypropertychanged.aspx) or some other UI behaviour or code. For small projects you can get away with this but as the projects goes the issues from this get worse leading to more pain.

* *Code Grinding* - Writing the same code over and over to implement some architectural pattern isn't fun. For MVVM the standard grind is implementing `INotifyPropertyChanged`. And while most MVVM frameworks have a base implementation that you can use to simplify the implementation they still require you to write some sort of code in every property setter, plus if you have other properties dependant on that property they must also call the changed event.

Over the next few blog posts I hope to demonstrate a set of tools and utilities that will help with these issues, and generally make it easier to develop desktop applications using the MVVM pattern. So far I've only applied the solution to WPF applications but I don't see why it couldn't also work in Silverlight or WinRT when the MVVM pattern is implemented.
