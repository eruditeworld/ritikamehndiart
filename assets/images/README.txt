IMAGES — HOW TO REPLACE THEM
============================
Every image currently on this site is an ORIGINAL decorative illustration
made for this project (SVG line art). None of them are photographs, and
none of them are presented as Ritika's work. No stock or third-party
images are used anywhere on this site.

hero/       hero-mehndi-hand.svg
            Replace with a strong portrait photo (about 4:5) of bridal
            mehndi. Referenced once, in the hero section of index.html.

about/      artist-portrait-placeholder.svg
            Replace with a photo of Ritika (about 4:5).

gallery/    mehndi-01 ... mehndi-12
            Replace with real photos. Portrait shots around 900x1120 px
            work best in the masonry layout. In index.html, update the
            src, alt, width, height, data-cat and figcaption for each tile.

Tips
----
- Save photos as .jpg (quality ~75) or .webp and keep each under ~250 KB.
- Always set width and height on the <img> so the layout doesn't jump.
- Keep loading="lazy" on every image except the hero one.
- Write real alt text, e.g. alt="Bridal mehndi on both hands, floral design".
