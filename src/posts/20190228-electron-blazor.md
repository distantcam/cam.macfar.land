---
title: "Electron ➕ Blazor = \U0001F499"
unsplash_id: tZc3vjPCk-Q
tags:
  - electron
  - blazor
  - dotnet
date: 2019-02-28 23:14:01
---

As a .NET desktop developer I've always felt confined to Windows if I wanted to make a C# desktop application. There have been other frameworks for creating cross platform C# applications, but they have still felt very Windows centric. Then I heard about Blazor.

---

### Blazor

[Blazor](https://blazor.net/) is a .NET web framework that runs a CLR inside a browser using WebAssembly (wasm). WebAssembly is an open web standard for running a virtual machine inside modern browsers. Blazor then creates a full .NET stack inside this virtual machine, allowing you to run .NET code inside a browser.

![Blazor diagram](/assets/blazor.png)

Like any good mad scientist I saw Blazor and thought, "Doesn't electron run a full Chrome browser as a desktop app? Can't we then run Blazor inside Electron?"

### Electron

[Electron](https://electronjs.org/) is a project from GitHub that bundles a web project inside an application, and runs Chromium (the Chrome browser engine) to display the web project as if it was a desktop app. Since websites and Chromium are multi-os compatible Electron apps can run on a variety of operating systems.

<hr />

### Inception

{% unsplash 902vnYeoWS4 %}

I took an electron skeleton app, and proceeded to create a Blazor template project inside it. First I had to modify the default CQRS settings to allow webasm to run. The other problem was that, because Blazor isn't technically running as a "server", it doesn't handle routing, so the default path wasn't working. I had to change all the default `/` paths to `/index.html`.

Once I had the app running the other part that wasn't working was the demo page to fetch data. Again, because the server wasn't technically running it couldn't fetch the data. So instead I changed it to fetch from a github file and voila, .NET running inside an electron app.

### Source

The results of this mad science experiment are on <i class="fab fa-github fa-lg" title="GitHub"></i>

https://github.com/distantcam/electron-blazor
