# rvnu brand fonts

Drop the following files into this directory to activate the rvnu brand font
stack. The site in `../../index.html` / `../../styles.css` already references
them by these exact names — no other wiring is required.

## Primary (Latin) — Season Sans TRIAL

| File                              | Weight | Use                                     |
|-----------------------------------|--------|-----------------------------------------|
| `SeasonSans-TRIAL-Regular.ttf`    | 400    | Body, captions, chrome                  |
| `SeasonSans-TRIAL-Medium.ttf`     | 500    | Card titles                             |
| `SeasonSans-TRIAL-SemiBold.ttf`   | 600    | Headlines, hero numbers, uppercase labels |

## Italic accent — Cormorant

| File                              | Weight | Use                                     |
|-----------------------------------|--------|-----------------------------------------|
| `Cormorant-SemiBoldItalic.ttf`    | 600 italic | Brand accent words only (_Growth_, _Grow_, _Sales_, _expertise_, _moved_, …) |

## Arabic — Expo Arabic

Wired up and applied automatically on `html[lang="ar"]` (see `ar.html`).

| File                                                   | Weight range | Use                     |
|--------------------------------------------------------|--------------|-------------------------|
| `alfont_com_AlFont_com_ExpoArabic-Light-1.ttf`         | 300–400      | Arabic body, chrome     |
| `alfont_com_AlFont_com_ExpoArabic-Medium-1.ttf`        | 500–600      | Arabic headlines, labels |

## Bundled but not wired up

- `InstrumentSans-VariableFont_wdthwght-BF645daa0fb3ead.ttf` — previous Season
  Sans surrogate; kept as a backup

## Licensing note

Season Sans is a trial/commercial face — do NOT redistribute the TTFs outside
of rvnu projects. Cormorant is SIL Open Font License. Expo Arabic is a
commercial face distributed via alfont.com.

## If the files are missing

`styles.css` declares the brand fonts with `font-display: swap` and fall-back
stacks (`Inter`, `Georgia`, system sans). The site will render cleanly on the
fallbacks until the TTFs are added.
