# WD Style Sheet

The __WD Style Sheet__ consists of a library written in CSS whose purpose is to provide the styling of the developing application by means of basic class attributes.

The tool relates **slightly** to the JavaScript tools resulting in integration between the two libraries.

## Structure

For the style to be enabled, an ancestral element must contain the value of the `wd` class. If not, the standard style or the one defined in the normalization will be applied. To apply the style effects to any HTML document, just insert it in the `html` tag.

```html
<!DOCTYPE html>
<html class="wd">
...
```

### Attributes

The class attribute begins with the prefix `wd` followed by the style name separated by a dash:

```html
<div class="wd-name">...</div>
```

### Parameters

Some styles can contain parameters that specify a certain behavior. The parameter is specified after the style name separated by a dash:

```html
<div class="wd-name-parmeter">...</div>
```

### Inheritances

Some styles have the suffix `child` aimed at applying the characteristics of the style to the children of the element indicated with the class. The suffix is added to the end of the attribute separated by a dash::

```html
<div class="wd-name-child">...</div>

<div class="wd-name-parmeter-child">...</div>

```

### Containers

Some styles require that their ancestor be contemplated with some specific configuration to function. In these cases, both the parent container and the child elements will need class attributes to achieve proper behavior.

### HTML Elements

Some styles, usually specified in the ancestral element, are applied directly from the use of natural HTML elements, it is not necessary to specify class attributes in the child elements to achieve the defined behavior.

Therefore, when preparing the HTML document it is important to use the elements (_tags_) for the purposes for which they were intended (preferential behavior) to achieve the expected result. For generic elements, use the `div` (block) and `span` (inline) tags.

### Complementary Attributes

Some class attributes have complementary attributes to change the default behavior.

## Normalize

Few elements are normalized by the library. Therefore, if it is necessary to establish a strict standardization to increase compatibility between browsers, an appropriate library should be linked for this purpose.

## Base

Some elements are styled by the library using the `wd` class attribute.

These stylizations act on the appearance of the elements (colors, font, alignment), their dimensions (padding, margin), display (display, position) and effects (shadow, opacity, border).

Among the elements that receive such stylizations, we highlight the browser (`nav`), headers/footers (`h1-6`, `header`, `footer`), blocks of text (`p`, `pre`, `blockquote`), image (`figure`, `figcaption`, `img`), lists (`ul`, `ol`, `dl`), table (`table`) and form elements (`input`, `textarea`, `select`, `fieldset`, `button`).

## Categories

The attributes that define the CSS classes have been divided into the following characteristics:

- [WD CSS Components Style](WD-CSS-Components-Style)
- [WD CSS Utilities Style](WD-CSS-Utilities-Style)
- [WD CSS Structural Style](WD-CSS-Structural-Style)
