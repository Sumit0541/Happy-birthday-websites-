# Yana's Little Birthday Universe 🎀

A mobile-first, animated birthday experience customized for Yana, based on the supplied Happy-Birthday project.

## Run it
- Open `index.html` in a modern browser, or upload the folder to GitHub Pages / Netlify / Cloudflare Pages.
- Internet is only needed for the optional Google Fonts. The layout, cat/cake illustrations, confetti, countdown, local photo picker, gift reveal and generated sound effects use local HTML/CSS/JavaScript.
- No build command, API key, database, or server is required.

## Personalize photos
1. Open the page and tap **Add Yana's photos**.
2. Select Yana's pictures. They appear in a local scrapbook grid in that browser session. The page does not upload them to a server.
3. For photos to appear automatically for everyone after hosting, add images you have permission to share to the project and update the HTML to use those file paths. Do not put private photos on a public site unless you are comfortable with anyone who has the link seeing them.

## Sound
The **Sound off/on** button starts a gentle, original synthesized melody, and interactions play short chimes. This avoids bundling copyrighted music. Sound starts only after a user taps the control because mobile browsers block autoplay. To use a specific song, only add an audio file you have permission to use and wire it to the audio element in `index.html`.

## Date
The countdown automatically targets the next **4 November**. No birth year or age is assumed.

## Main files
- `index.html` — content and page structure
- `style.css` — responsive design, cat/cake illustration and animations
- `script.js` — countdown, local photo picker, confetti, gift reveal, candles and sound

## Notes
- The page is frontend-only on purpose; no backend or database is needed for the current features.
- Uses browser APIs: Canvas, IntersectionObserver, Object URLs and Web Audio. Reduced-motion preferences are respected.


### Personal photos added
The `img/` folder contains the provided photos, used directly in the hero photo card and memory wall. Keep the `img/` folder beside `index.html`, `style.css`, and `script.js` when hosting.
