---
title: "Attachments"
slug: "attachments"
date: 2012-09-17
unsplash_id: vJICk89hFbU
tags: ["architecture", "mvvm"]
---

Where we reach the crazy portion of the program.

---

One of the biggest problems I've seen with any non-trivial MVVM application is that of mega-ViewModels AKA [God objects](http://en.wikipedia.org/wiki/God_object). And it's not just me. Many people have the same problem.

[MVVM and avoiding Monolithic God object on StackOverflow](http://stackoverflow.com/questions/2951301/mvvm-and-avoiding-monolithic-god-object)

## DataContext and the Lone ViewModel

Why is it that we only have one ViewModel per View? Well for the whole thing to work the ViewModel must be assigned to the DataContext of the View. This necessitates a one View - one ViewModel idea.

ViewModels must handle lots of different things. Sometimes they are data entry, needing access to the data store and maybe some validation routines. Sometimes they are navigation waypoints, allowing the user to create a new document, open an existing one, or open some other part of the application.

This idea leads to ViewModels doing way more than they should. For [cross-cutting concerns](http://en.wikipedia.org/wiki/Cross-cutting_concern) the standard approach is to use a service, which is just a class in your IoC that can be passed into your ViewModel. This works great for things like MessageBoxes, standard Open/Save/Print dialogs, etc.

This leaves concerns that are ViewModel specific, but may not be related to each other. Usually this causes the ViewModel to violate the [single responsibility principle](http://en.wikipedia.org/wiki/Single_responsibility_principle) by implementing multiple concerns in the same class.

## Attached Behaviours

In his [blog entry](http://blogs.msdn.com/b/johngossman/archive/2008/05/07/the-attached-behavior-pattern.aspx
) on Attached Behaviours John Gossman has this to say.

> The Attached Behavior pattern encapsulates "behavior" (usually user interactivity) into a class outside the visual heirarchy and allows it to be applied to a visual element by setting an attached property and hooking various events on the visual element.

Attached behaviours are an implementation of the [decorator pattern](http://en.wikipedia.org/wiki/Decorator_pattern) which allows you to separate behaviours or concerns into a discrete class and attach to the visual element.

So what if we treated the ViewModel as just a specialized storage for the View, like a ViewBag in ASP.net MVC, and put all the behaviours of the ViewModel into an attachment that we expose through the ViewModel via public properties?

What if our ViewModel was just a bunch of public properties?

What if we used some sort of attachment to add behaviour to that ViewModel?

## Attachments to ViewModels

A ViewModel can have multiple attachments, each fulfilling a specific purpose. An attachment can set up initial values for properties, and assign ICommands for the ViewModel.

```csharp
interface IAttachment {
    void AttachTo(object obj);
}

abstract class Attachment<T> : IAttachment {
    protected T viewModel;

    protected abstract void OnAttach();

    void IAttachment.AttachTo(object obj) {
        viewModel = (T)obj;
        OnAttach();
    }
}

class SampleAttachment : Attachment<SampleViewModel> {
    protected override void OnAttach() {
        // ... set up properties in the view model
    }
}

class SampleViewModel : ViewModelBase {
    public string SomeProperty { get; set; }

    pubic ICommand DoSomething { get; set; }
}
```

Setting up an attachment is pretty straightforward. You can simply call the attachment from the constructor of the ViewModel itself. A better option however is to use your IoC to automate the attachment process. Here's an example of how to do this in Autofac.

```csharp
class AutoAttachmentModule : Module {
    protected override void AttachToComponentRegistration(
        IComponentRegistry componentRegistry, 
        IComponentRegistration registration) {
        registration.Activating += Activating;
    }

    void Activating(object sender, ActivatingEventArgs<object> e) {
        var vmType = e.Instance.GetType();

        // Convention to find attachments from a ViewModel
        // This can be done better.
        var attachmentType = Type.GetType(
        	vmType.FullName.ReplaceAll("ViewModel", "Attachment"));

        if (attachmentType == null || 
        	!e.Context.IsRegistered(attachmentType))
        	return;

        var attachment = (IAttachment)e.Context.Resolve(attachmentType);

        attachment.AttachTo(e.Instance);
    }
}
```

Attachments allows for the separation of parts of of a ViewModel that cannot otherwise be broken up with sub-ViewModels.

We can test the View-ViewModel binding without worrying about triggering an interaction in the ViewModel's implementation.

We can also test the ViewModel-Attachment interaction without worrying about whether our bindings are correct. And with each logical part being in a separate Attachment we can test them in isolation without side-effect.
