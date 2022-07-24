# WD JS Text Tools

This object is returned in cases where the value of the `input` argument corresponds to a text value. The `type` attribute returns "text".

To be considered as text type, the input value must be a String that does not meet the criteria for defining date, time, number or null (A String without a printable character is considered a null value).

## Attributes

### camel

It is an attribute that returns textual content in "camelCase" format.

### clear

It is an attribute that returns the textual content without accents of the alphabet.

### csv

It is an attribute that returns textual content in CSV format in a JavaScript object.

The columns of the CSV file must be separated by the character `\t` and the lines by the character `\n`. The column titles will be transformed into [dash values](#dash).

### dash

It is an attribute that returns textual content in "dash" case format (separated by a dash).

### json

It is an attribute that returns textual content in JSON format in a JavaScript object.

### lower

It is an attribute that returns textual content in lower case.

### title

It is an attribute that returns textual content in title case (the first letter of each word will be capitalized).

### trim

It is an attribute that returns textual content without unnecessary whitespace.

### upper

It is an attribute that returns textual content in upper case.

## Methods

### force

The method promotes the alteration of the internal content of the object through its attributes. Returns the new content value.

```js
force(attr...)
```

`attr`: Variable argument that accepts the strings "title", "upper", "lower", "trim" and "clear" that represent the object's attributes.

### message

The method displays a message box with the content of the "input" argument. It only works after the page loads and accepts HTML characters. The message is open for 6.5 seconds, to close it manually just click on the box.

```js
message(time, className)
```

`time`: (opicional) Time, in milliseconds, of message duration (default 6500). If the value is infinite or less than or equal to zero, the message will not close automatically, making it necessary to click on the element.

`className`: (optional) Defines the value of the `class` attribute of the box.

### replace

It is a method that replaces occurrences in the text with new information. **All** identical elements located in the text will be replaced and the new content will be returned.

```js
replace(oldValue, newValue, change)
```

`oldValue`: (opcional) value to be replaced, if it is null or undefined it will assume an empty string.

`newValue`: (opcional) substitution value, if it is null or undefined it will assume an empty string.

`change`: (opcional) if true, it will also change the content of the object **without changing its type**.

### toString

The method returns the default value of the browser.

```js
toString()
```

### valueOf

The method returns the default value of the browser.

```js
valueOf()
```
