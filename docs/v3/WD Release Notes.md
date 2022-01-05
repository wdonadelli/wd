# WD Release Notes

## v3.4.0

### JS v3.2.0

- Creation of the `wDays` and `wDaysYear` attributes for the information framed as a date.
- Update of the `format` method for information framed as a date.
- Creation of the `matrix` method for objects framed as arrays.
- Creation of the `data-wd-edit` attribute.
- Creation of the `join`, `acss`, `dcss` and `tcss` attributes to the `data-wd-set` attribute.
- Percentage values are now considered numbers.
- Small repairs with less impact.

### CSS v3.2.0

- Creation of class attributes wd-plain, wd-plain-child, wd-b-none, wd-b-none-child, wd-i-none, wd-i-none-child, wd-line-none, wd-line-none-child, wd-mark-none, wd-mark-none-child, wd-fg-none, wd-padding-none, wd-padding-none-child, wd-margin-none, wd-margin-none-child, wd-border-none, wd-border-none-child, wd-radius-none, wd-radius-none-child, wd-shadow-none, wd-shadow-none-child, wd-cloud-none, wd-cloud-none-child, wd-shadow-none, wd-shadow-none-child, wd-cloud-none, wd-cloud-none-child, wd-opaque-none and wd-opaque-none-child.
- Changing color schemes.

_2021-04-28_

## v3.2.0

### CSS v3.1.0

- Created the class attribute `wd-border-box` (`wd-border-box-child`).
- The formatting of the child elements (`h1`, `h2` and `blockquote`) of the class attribute `wd-report` was changed.
- The formatting of the `code` element has been changed.
- The formatting of the class element `wd-attr-href` has been changed.
- The formatting of the class element `wd-icon-...` has been changed.
- The formatting of the textual content of the buttons has been changed to not allow line breaks.
- The display of the container formed by the class attribute `wd-code` has been changed to not allow line breaks and allow horizontal movement.
- Added the possibility of line numbering with the element `span` in `wd-code`.
- Created the `wd-icon-custom`, `wd-line`, `wd-hline`, `wd-sline`, `wd-vline`, `wd-sgrid`, `wd-bg-none` and `wd-bg-basic` class attributes.
- Removed the default margin for the class attribute `wd-grid` and related classes.
- Color palette has been changed.

### JS v3.1.0

- Changed the return of the `send` method, now the object itself is returned.
- Changed the return of web requests to incorporate treatment of known errors.

_2020-12-20_

## Versioning notes

The general version of the library is obtained from the sum of the innovations and corrections of the libraries individually.

For example, if the _wd.js_ library is at _v3.1.2_ and the _wd.css_ library is at _v3.0.1_, the general version is _v3.1.3_.

_2020-11-18_

## v3.0.0

After implementing changes in the names of the methods and attributes of the JavaScript library, as well as changes in behavior and simplification in the names of the attributes of the CSS library, there was a need to upgrade.

With the change in the version, it was decided to deactivate features from the previous version in order to eliminate duplicates and simplify the tools.

A new [manual](https://github.com/wdonadelli/wd/wiki) has been added to the GitHub wiki area as well as an area for demonstrating [examples](https://wdonadelli.github.io/wd/v3).

If you want to view previous versions, the links below can be used:

Links to version 2 (deprecated):

- [Manual](https://wdonadelli.github.io/wd/v2)
- [Javascript](https://wdonadelli.github.io/wd/v2/wd/wd.js)
- [Style Sheet](https://wdonadelli.github.io/wd/v2/wd/wd.css)

Links to version 1 (deprecated):

- [Manual](https://wdonadelli.github.io/wd/v1/)
- [Javascript](https://wdonadelli.github.io/wd/v1/wd/wd.js)
- [Style Sheet](https://wdonadelli.github.io/wd/v1/wd/wd.css)

_Willian Donadelli_ (<wdonadelli@gmail.com>), 2020-11-11
