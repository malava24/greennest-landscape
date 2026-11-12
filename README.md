# GreenNest Landscape Design — One-Page Website

A responsive one-page website for a fictional landscape design company. It includes a hero section, a services list, three project examples (photo placeholders), client reviews, and a quote request form that sends real submissions through [Formspree](https://formspree.io).

## Features

- Sections: hero, services, recent projects, reviews, contact form
- Contact form fields: name, phone, email, message
- Real form delivery via Formspree (no backend needed)
- Success message: "Thank you, we’ll contact you within 24 hours"; a clear error message if sending fails
- Spam protection: hidden honeypot field (`_gotcha`)
- Client-side validation: name, phone, email and message, with length limits (60 / 20 / 100 / 1000 characters) and a live character counter
- Mobile-friendly layout (CSS grid + media query)
- No frameworks, no build step: plain HTML, CSS and JavaScript

## Project structure

```
index.html   # page content and the form
style.css    # all styling, including the mobile layout
script.js    # form validation, honeypot check, sending to Formspree
README.md    # this file
```

## How to run

No installation is required.

1. Download or copy the project folder.
2. Double-click `index.html` to open it in your browser.

Optional: serve it locally (requires Python):

```
python -m http.server 8000
```

Then open http://localhost:8000.

To test mobile layout, open browser DevTools (F12) and enable the device toolbar, or simply narrow the window.

> **Formspree note:** the first time a form endpoint receives a submission, Formspree may ask the account owner to confirm their email. Until then, submissions may not be delivered. Submitting the form during testing sends a real message to the form's owner.

## How to change the texts

All visible text lives in `index.html`. Open it in any text editor and edit the text between the tags:

- **Company name:** `<span class="logo">` and `<title>`
- **Headline and subtitle:** inside `<header class="hero">`
- **Services:** the `<article class="card">` blocks in `<section id="services">`
- **Projects:** the `<figure class="project">` blocks in `<section id="work">`
- **Reviews:** the `<blockquote class="review">` blocks in `<section id="reviews">`
- **Success and error messages:** in `script.js`, inside the `showStatus(...)` calls
- **Colors:** the variables at the top of `style.css` (`:root`)

### Replacing a photo placeholder with a real image

Replace this:

```html
<div class="placeholder" role="img" aria-label="...">Photo coming soon</div>
```

with:

```html
<img src="images/my-photo.jpg" alt="Describe the photo" style="aspect-ratio: 4 / 3; object-fit: cover; width: 100%;">
```

## How to change the form address

The form endpoint is set in one place: the `action` attribute of the form in `index.html`.

```html
<form id="quote-form" class="form" action="https://formspree.io/f/mnpdqbyb" method="POST" novalidate>
```

To receive submissions at your own address:

1. Create a free account at https://formspree.io and create a new form.
2. Copy its endpoint URL (it looks like `https://formspree.io/f/xxxxxxxx`).
3. Paste it into the `action` attribute above. `script.js` reads this value automatically, so nothing else needs to change.

## Changing the field limits

The limits are defined in three places, so change them together:

- `maxlength` attributes on the inputs in `index.html`
- The counter text (`0 / 1000`) in `index.html`
- The `rules` object and `updateCounter()` in `script.js`

## Limitations

- Validation and the honeypot run in the browser, so they stop casual spam and typos but are not a full security solution. Formspree provides additional server-side filtering; enable its reCAPTCHA option if spam becomes a problem.
- All names, reviews and projects are fictional placeholders.
