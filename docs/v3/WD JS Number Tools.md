# WD JS Number Tools

This object is returned in cases where the value of the `input` argument corresponds to a numeric value. The `type` attribute returns "number".

In the case of String, to be considered a number, its content must be in numeric format and the values ​`​Infinite` and `-Infinite` must be accompanied by the respective signs (+/-). Percentage values are also considered numbers (`"10%"` is equal to `0.1`, e.g.).

## Attributes

### abs

It is an attribute that returns the absolute value of the number.

### decimal

It is an attribute that returns the fractional part of the number.

### integer

It is an attribute that returns the integer part of the number.

### number

It is an attribute that returns "integer" for integers (negative, positive, and zero), "real" for non-integer numbers, and "infinity" for `Infinity` and `-Infinity` values.

## Methods

### coin

It is a method that returns a string with currency formatting, in case the browser contemplates the tool. Otherwise, it returns a String in a generic currency format.

```js
coin(currency, locale)
```

`currency`: (optional) It consists of a string representing the currency (e.g. "USD" to US Dollar). If not defined or non-existent, the entered text will be added in front of the return string that will be formatted according to the locale method.

`locale`: (optional)  It consists of a string representing the location (e.g. "pt-BR"). If not set, the location will be the one entered in the lang attribute of the html tag, the value provided by the browser or "en-US"

### e10

It is a method that returns a string in scientific notation.

```js
e10(n, html)
```

`n`: (optional) It indicates the number of decimal places to be displayed in the notation.

`html`: (optional) If true, returns the value in html format, otherwise the return will be in text format.

### fixed

It is a method that sets the minimum number of integers and the number of characters without numerical approximation, returning a String.

```js
fixed(int, frac)
```

`int`: (optional) The minimum number of integer characters.

`frac`: (optional) The number of decimal characters.

### locale

It is a method that returns a string with local numeric formatting, in case the browser contemplates the tool. Otherwise, it will return the number entered in the string format.

```js
locale(locale)
```

`locale`: (optional) The argument serves the same purpose as the [`coin`](#coin) method of the same name.

### round

It is a method that returns the numeric value rounded.

```js
round(n)
```

`n`: (optional) It indicates the number of decimal places to be considered in the rounding. If the argument is omitted, the number will be rounded to the integer above.

### toString

It is a method that returns the number in the form "integer.decimal" and the infinity symbol when entered.

```js
toString()
```

### valueOf

It is a method that returns the browser default value.

```js
valueOf()
```
