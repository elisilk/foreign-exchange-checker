# Frontend Mentor - FX Checker solution

This is a solution to the [FX Checker challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
  - [AI Collaboration](#ai-collaboration)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Your users should be able to:

#### Converter

- Enter an amount to send and see it convert in real time as they type
- Pick the "send" and "receive" currencies from a searchable currency picker
- See the live exchange rate for the active pair (for example, `1 USD = 0.8530 EUR`)
- Swap the send and receive currencies with the swap button
- Favorite the active pair, and log a conversion to their history

#### Currency picker

- Search the full list of available currencies by code or name
- See currencies grouped into "Popular" and "Other currencies", each row showing the flag, code, and name
- See a check against the currency that's currently selected

#### Live markets ticker

- See a ticker of currency pairs, each with its current rate and 24-hour change (up or down)

#### Rate history

- View a line and area chart of the active pair's rate over time
- Switch the chart range between 1D, 1W, 1M, 3M, 1Y, and 5Y
- See the open, last, absolute change, and percentage change for the selected range

#### Compare

- See their send amount converted into a range of other currencies at once, each with its reference rate
- Pin or unpin any comparison row to their favorites

#### Favorites

- See their pinned pairs, each with its live rate and 24-hour change
- Load a pinned pair back into the converter by selecting its row
- Unpin a pair they no longer want to track

#### Conversion log

- See a log of conversions they've made, each showing the relative time, the pair, and the send and receive amounts
- Clear the whole log
- Delete an individual entry

#### UI & accessibility

- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page
- Navigate the entire app using only their keyboard

### Screenshots

|                 Mobile designed at 375px:                 |                Tablet designed at 1440px:                 | Desktop designed at 1440px:                                 |
| :-------------------------------------------------------: | :-------------------------------------------------------: | ----------------------------------------------------------- |
| ![Screenshot mobile](./screenshots/screenshot-mobile.png) | ![Screenshot tablet](./screenshots/screenshot-tablet.png) | ![Screenshot desktop](./screenshots/screenshot-desktop.png) |

### Links

- Solution URL: [https://github.com/elisilk/foreign-exchange-checker](https://github.com/elisilk/foreign-exchange-checker)
- Live Site URL: [https://foreign-exchange-checker-seven.vercel.app/](https://foreign-exchange-checker-seven.vercel.app/)

## My process

### Built with

- [GitHub](https://github.com/) - code repository
- [Nuxt](https://nuxt.com/) - full-stack web framework (built on Vue, Vite, and Nitro)
- [Vercel](https://vercel.com/) - web host deployment
- [Pinia](https://pinia.vuejs.org/) - state management
- [Pinia Plugin Persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) - persistent state storage

Other libraries I made use of:

For the styling and icons:

- [Nuxt UI](https://ui.nuxt.com/)
- [Nuxt Icon](https://nuxt.com/modules/icon)
  - [IonIcons](https://icones.js.org/collection/ion)
  - [Circle Flags](https://icones.js.org/collection/circle-flags)

For the workflow setup:

- [Husky](https://github.com/typicode/husky)
- [Lint-staged](https://github.com/lint-staged/lint-staged)
- [ESLint](https://eslint.org/)
  - [Nuxt ESLint](https://eslint.nuxt.com/)
  - [Anthony Fu's ESLint config preset](https://github.com/antfu/eslint-config)

### What I learned

As always, so many cool :sunglasses: things. Here are some of the key resources I used.

#### Building the App

#### Testing the App

Hmm 🤔 ... I still have to do this part!

### Continued development

Known issues - specific areas that the solution should be improved:

- [ ] All of the testing part!

Feature requests - specific enhancements to make:

### Useful resources

- [Example resource 1](https://www.example.com) - This helped me for XYZ reason. I really liked this pattern and will use it going forward.
- [Example resource 2](https://www.example.com) - This is an amazing article which helped me finally understand XYZ. I'd recommend it to anyone still learning this concept.

**Note: Delete this note and replace the list above with resources that helped you during the challenge. These could come in handy for anyone viewing your solution or for yourself when you look back on this project in the future.**

### AI Collaboration

Describe how you used AI tools (if any) during this project. This helps demonstrate your ability to work effectively with AI assistants.

- What tools did you use (e.g., ChatGPT, Claude, GitHub Copilot)?
- How did you use them (e.g., debugging, generating boilerplate, brainstorming solutions)?
- What worked well? What didn't?

My workflow with AI is purposely restrained at the moment, so I can learn and think through much of the challenge. However, I definitely do make use of Google searches regularly, along with the AI summaries that result. For example, when ... Googled ["javascript array of objects group by property"](https://www.google.com/search?q=javascript+array+of+objects+group+by+property), which did nicely lead me to the [`Object.groupBy()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy) function, which I would have been unlikely to have found otherwise.

I have also started to dabble with using ChatGPT as a helpful guide for thinking through various solution design options. For example, I ...

## Author

- Website - [Eli Silk](https://github.com/elisilk)
- Frontend Mentor - [@elisilk](https://www.frontendmentor.io/profile/elisilk)

## Acknowledgments

This is where you can give a hat tip to anyone who helped you out on this project. Perhaps you worked in a team or got some inspiration from someone else's solution. This is the perfect place to give them some credit.

**Note: Delete this note and edit this section's content as necessary. If you completed this challenge by yourself, feel free to delete this section entirely.**
