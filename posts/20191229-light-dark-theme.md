---
title: Light / Dark CSS Theming
unsplash_id: Eb-TL_Nxizg
tags: web
date: 2019-12-29 23:53:37
---

Allowing users to choose either a light or dark theme when viewing your website is great for accessibility. So naturally I wanted to add it to my blog. Unfortunately my blog doesn't use a framework like React or Vue, so I had to use CSS variables and JavaScript.

---

## The CSS {% simpleicon CSS3 %}

First off, we need to add some CSS variables to store settings for the different themes. CSS variables are a way of storing common values in CSS, and when they are changed, they change everywhere they are referenced.

By default, the values are set for light theme. They're added to the `:root` element so they're available everywhere.

```css
:root {
  --background-main: #f7fafc;
  --background-panel: #edf2f7;
  --text-main: #1a202c;
  --opacity-light: 1;
  --opacity-dark: 0;
}
```

Then, the dark theme versions are added. This css selector targets any element that has a `data-theme` attribute set to `dark`.

```css
[data-theme='dark'] {
  --background-main: #1a202c;
  --background-panel: #2d3748;
  --text-main: #f7fafc;
  --opacity-light: 0;
  --opacity-dark: 1;
}
```

Finally, in our CSS we can use the variables in various utility classes.

```css
.bg-main {
  background-color: var(--background-main);
}

.bg-panel {
  background-color: var(--background-panel);
}

.text-main {
  color: var(--text-main);
}

.theme-light {
  opacity: var(--opacity-light);
}

.theme-dark {
  opacity: var(--opacity-dark);
}
```

## The HTML {% simpleicon HTML5 %}

The theme toggle is an anchor tag that contains two svg images, a sun and a moon, to represent the different themes.

```html
<a id="toggle" href="#">

  <svg id="moon" class="theme-light" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>

  <svg id="sun" class="theme-dark" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>

</a>
```

By using the `theme-light` and `theme-dark` classes the icons swap depending on the theme using opacity. To make this work the two icons need to be overlaid.

## The JavaScript {% simpleicon javascript %}

So, let's handle the toggle click. We also want to store the value in local storage.

```js
document.getElementById('toggle').addEventListener('click', function(event) {
  event.preventDefault();

  // Get the current theme and calculate the new theme
  const currentTheme = localStorage.getItem('currentTheme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  // Store the theme in local storage
  localStorage.setItem('currentTheme', newTheme);

  ...

  // Set the theme attribute
  document.documentElement.setAttribute('data-theme', newTheme);
});
```

The site then needs to load the value when the page is reloaded.

```js
window.addEventListener('DOMContentLoaded', function(event) {
  // Load the current theme from storage
  const currentTheme = localStorage.getItem('currentTheme') || 'light';
  // Set the theme attribute
  document.documentElement.setAttribute('data-theme', currentTheme);
});
```

## The Transition

The last thing is to add a transition effect so the theme change is not so jarring. The transition is a CSS class that is temporarily added to the root element.

```css
html.transition,
html.transition *,
html.transition *:before,
html.transition *:after {
  transition-property: background-color color opacity !important;
  transition-duration: 750ms !important;
  transition-delay: 0 !important;
  transition-timing-function: linear !important;
}
```

```js
document.getElementById('toggle').addEventListener('click', function(event) {
  // Previous code
  ...

  // Store the theme in local storage
  ...

  // Temporarily set a transition style
  document.documentElement.classList.add('transition');
  setTimeout(() => {
    document.documentElement.classList.remove('transition')
  }, 750);

  // Set the theme attribute
  ...
});
```

## The Result

{% codepen distantcam, jOELKOr %}
