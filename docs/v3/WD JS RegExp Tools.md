# WD JS RegExp Tools

This object is returned in cases where the value of the `input` argument corresponds to a regular expression. The `type` attribute returns "regexp".

In the case of String, to be considered a number, its content must be in numeric format and the values ​`​Infinite` and `-Infinite` must be accompanied by the respective signs (+/-).

## Methods

### mask

It is a method that returns the value of the string by applying mask from a regular expression. If the expression does not match the text, the method will return `false`.

```js
mask(value)
```

`value`: Value to be applied to the mask. String comparison characters must be inserted into groups "()". Punctuation elements, which model the mask, should be left out of groups. If the input value does not match the mask, the method returns false.

**Example**

```js
/* Mask for time in 24 hour format: HH:MM */
/* Projection: (HH):(MM) */
/* HH: [0-9]|[0-1][0-9]|2[0-4] */
/* MM: [0-5][0-9] */
/* Regular Expression: */
var re = /^([0-9]|[0-1][0-9]|2[0-4])\:([0-5][0-9])$/
wd(re).mask(1023);
/* The above expression will return "10:23" */
```

### toString

It is a method that returns source attribute of RegExp object.

```js
toString()
```

### valueOf

It is a method that returns the browser default value.

```js
valueOf()
```
