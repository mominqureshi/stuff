# stuff

A personal portfolio site, plus a few small Python games I wrote along the way.

## The portfolio

A static photo portfolio — no build step, no framework, no dependencies. Open
`index.html` in a browser and it works.

```
index.html    markup — edit your name, bio, and contact details here
styles.css    all the styling, light + dark themes
app.js        filters, grid reveal, lightbox
photos.js     ← the list of your photos (this is the file you'll edit most)
photos/       ← put your image files in here
```

### Adding a photo

1. Drop the image file into `photos/`.
2. Add an entry to the top of the list in `photos.js`:

```js
{
  src: "photos/my-picture.jpg",
  title: "Crosswalk, 7am",
  collection: "Street",     // becomes a filter chip automatically
  place: "Shoreditch",
  year: "2025",
  w: 1200, h: 1500          // roughly the image's pixel size
}
```

That's the whole workflow. New `collection` values turn into new filter chips on
their own, and `w`/`h` stop the grid from jumping around while images load.

The nine `photos/*.svg` files are placeholders so the grid isn't empty — delete
them once you have real pictures in there.

### Things worth knowing

- **Image sizes.** Export at roughly 1600px on the long edge and save as JPEG or
  WebP. Straight-off-the-camera files are 10–20 MB each and will make the page
  crawl.
- **Themes.** Follows the visitor's system light/dark setting; the button in the
  header overrides it and the choice is remembered.
- **Keyboard.** In the photo viewer: `←` `→` to move, `Esc` to close. Swipe works
  on touch screens.
- **Placeholders to replace.** `hello@example.com` and the Instagram link in
  `index.html` are dummies.

### Putting it online

GitHub Pages will serve it as-is: **Settings → Pages → Deploy from a branch**,
pick the branch and the `/ (root)` folder. Netlify, Vercel, or Cloudflare Pages
also work with no configuration — there is nothing to build.

To preview locally:

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## The games

`flappy bird.py`, `pong.py`, and `snakegame` are small pygame experiments,
unrelated to the site.
