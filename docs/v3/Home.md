# WD Web Libraries Handbook v3

This project consists of the distribution of two libraries for web application development.

The **Web Development** tool consists of a library written in JavaScript whose purpose is to provide various tools to give dynamism and agility to the application in development. This tool is divided into two segments, one for creating JavaScript scripts ([WD JavaScript Tools](WD-JavaScript-Tools)) and another for defining actions using attributes of HTML elements ([WD Attributes Tools](WD-Attributes-Tools)).

The **Web Design** tool ([WD Style Sheet](WD-Style-Sheet)) consists of a library written in CSS whose purpose is to provide the styling of the developing application by means of basic class attributes.

Some tools may not work as expected in older browsers.

Links to the project:

- [GitHub Page](https://github.com/wdonadelli/wd)
- [License](https://github.com/wdonadelli/wd/blob/master/LICENSE)
- [Javascript](https://wdonadelli.github.io/wd/source/wd-3.2.0.js)
- [Style Sheet](https://wdonadelli.github.io/wd/source/wd-3.2.0.css)
- [Lab](https://wdonadelli.github.io/wd/v3)

## Inspirational References

- ZAKAS, Nicholas C. **Princípio de Orientação a Objetos em Javascript**. 1. ed. Novatec,2014.
- JARGAS, Aurelio Marinho. **Expressões Regulares**: uma abordagem divertida. 5. ed. Novatec, 2016.
- SILVA, Maurício Samy. **Fundamentos de HTML5 e CSS3**, 1. ed. Novatec, 2015.
- LINDSTROM, Steve. **Refatoração de CSS**: organize suas folhas de estilo com sucesso. 1. ed. Novatec, 2017.
- BASSETT, Lindsay. **Introdução ao JSON**: um guia para JSON que vai direto ao ponto. 1. ed. Novatec, 2015.
- SILVA, Maurício Samy. **JavaScript**: guia do programador. 4. ed. Novatec, 2015.
- MDN WEB DOCS, available at [https://developer.mozilla.org/]().
- W3SCHOOLS.COM, available at [https://www.w3schools.com/]().
- STACKOVERFLOW, available at [https://stackoverflow.com/]().

Among other inspiring and collaborative minds on the world wide web.

## Index

**[WD JavaScript Tools](#wd-javascript-tools)**

- [WD JS Shared Tools](#wd-js-shared-tools)
- [WD JS Array Tools](#wd-js-array-tools)
- [WD JS Date Tools](#wd-js-date-tools)
- [WD JS DOM Tools](#wd-js-dom-tools)
- [WD JS Number Tools](#wd-js-number-tools)
- [WD JS RegExp Tools](#wd-js-regexp-tools)
- [WD JS Text Tools](#wd-js-text-tools)
- [WD JS Time Tools](#wd-js-time-tools)

**[WD Attributes Tools](WD-Attributes-Tools)**

- [WD ATTR Action Tool](#wd-attr-action-tool)
- [WD ATTR Click Tool](#wd-attr-click-tool)
- [WD ATTR Config Tool](#wd-attr-config-tool)
- [WD ATTR Data Tool](#wd-attr-data-tool)
- [WD ATTR Device Tool](#wd-attr-device-tool)
- [WD ATTR Edit Tool](#wd-attr-edit-tool)
- [WD ATTR File Tool](#wd-attr-file-tool)
- [WD ATTR Filter Tool](#wd-attr-filter-tool)
- [WD ATTR Load Tool](#wd-attr-load-tool)
- [WD ATTR Mask Tool](#wd-attr-mask-tool)
- [WD ATTR Page Tool](#wd-attr-page-tool)
- [WD ATTR Repeat Tool](#wd-attr-repeat-tool)
- [WD ATTR Send Tool](#wd-attr-send-tool)
- [WD ATTR Set Tool](#wd-attr-set-tool)
- [WD ATTR Slide Tool](#wd-attr-slide-tool)
- [WD ATTR Sort Tool](#wd-attr-sort-tool)
- [WD ATTR Sort Column Tool](#wd-attr-sort-column-tool)

**[WD Style Sheet](WD-Style-Sheet)**

- [WD CSS Components Style](#wd-css-components-style)
- [WD CSS Utilities Style](#wd-css-utilities-style)
- [WD CSS Structural Style](#wd-css-structural-style)

# WD JavaScript Tools

The **WD JavaScript Tools** consists of a JavaScript function that, depending on the type and content of the passed argument, returns an object with specific attributes and methods. Its syntax is as follows:

```js
wd(input)
```

The function returns an object whose attributes and methods depend on the value informed in the optional `input` argument, whose content must be a valid JavaScript value.

The returned object has seven specific categories and a generic category whose attributes and methods are shared with the others. These categories are divided as follows:

- [WD JS Shared Tools](#wd-js-shared-tools)
- [WD JS Array Tools](#wd-js-array-tools)
- [WD JS Date Tools](#wd-js-date-tools)
- [WD JS DOM Tools](#wd-js-dom-tools)
- [WD JS Number Tools](#wd-js-number-tools)
- [WD JS RegExp Tools](#wd-js-regexp-tools)
- [WD JS Text Tools](#wd-js-text-tools)
- [WD JS Time Tools](#wd-js-time-tools)

# WD JS Shared Tools

This object is returned in cases where the value of the input argument has no specified behavior. Its methods and attributes are shared with all other objects.

## Attributes

### type

Returns a string that identifies the type of the value entered in the `input` argument. The following values ​​are possible:

- "array"
- "boolean"
- "date"
- "dom"
- "function"
- "null"
- "number"
- "object"
- "regexp"
- "text"
- "time"
- "undefined"

The definition above is slightly different from that specified by JavaScript. If the argument does not fit into any of the above categories, it returns the constructor name. And if there is no constructor, it will return "unknown".

### tools

Returns a list containing the names (string) of the methods and attributes of the returned object that are enumerable.

## Methods

### send

Tool to execute web requests. Returns the object itself.

```js
send(action, callback, method, async)
```

`action`: Defines the path/file for sending information.

`callback`: (optional) Defines the function to be performed during the request, the default value is null. The function accepts an argument that will receive the status of the request. The request status is sent through an object with the following characteristics:

- `closed`: Boolean attribute that informs if the request has already been closed. Being `true` for closed request and `false` for ongoing request.
- `status`: Attribute that informs the status of the request (string). The following values ​​are possible:
	* `UNSENT` - requisition not started;
	* `OPENED` - requisition initiated;
	* `HEADERS` - header reading performed;
	* `LOADING` - loading response;
	* `UPLOADING` - updating information;
	* `DONE` - successfully completed request;
	* `NOTFOUND` - path/file not found;
	* `ABORTED` - aborted request;
	* `ERROR` - an error occurred in the request; and
	* `TIMEOUT` - request waiting time ended.
- `time`: numeric attribute that returns the elapsed time of the request in milliseconds.
- `size`: numeric attribute that informs the total size, in bytes, of the request, if available..
- `loaded`: numeric attribute that informs the partial size, in bytes, of the request, if available.
- `progress`: numeric attribute that informs, when possible, the progress of the request during the "LOADING" or "UPLOADING" (initial value is zero and the final value is 1).
- `text`: attribute that returns the textual content of the request, if any, its default value being null.
- `xml`: attribute that returns the tree of the XML content of the request, if any, its default value being null.
- `json`: attribute that returns the JSON content of the request, if any, its default value being null.
- `csv`: attribute that returns the contents of an object csv file, if any, its default value being null.
- `request`: attribute that returns the request's constructor object (the expected object is XMLHttpRequest).
- `abort()`: method that causes the interruption of the request.

`method`: (optional) Defines the type of request to be made as a string ("POST", "GET" ...), the default value is "GET".

`async`: (optional) Boolean value that defines whether the request will be asynchronous (default) or synchronous. For synchronous requests, the value must be `true`.

The information to be sent depends on the content of the `input` attribute of the `wd` function:

#### dom

If the data type is "dom", the information sent will be the information available in the HTML form elements that have the `name` attribute defined.

If the submission method is `GET` (default), the information collected from the form elements will be sent by serialization, similar to `"key1=value1&key2=value2 ..."`.

If the sending method is `POST`, the collection will be stored in an `FormData` object and, if the browser does not include the aforementioned object, the information will be obtained in the same way obtained by the `GET` method.

**Note**: The behavior is slightly different from that applied to a form when submitting it. For the elements `select` and `file` (_input_), when empty, no information is captured. If there is multiple information, the first value will be assigned to its original `name` attribute. For the following information, the values ​​will be assigned to the name followed by an index that represents the sequence of the information:

```js
name=value01&name_1=value02&value_2=value03...
```

#### null/undefined

- If the type is "null" or "undefined", no information will be sent to the request, but this will happen.

#### Other types

- Otherwise, the information sent will be assigned to the key "value" whose value will correspond to the textual content of the information contained in the argument `input` in the format `"value=textual content"`.

### toString

Non-enumerable method that returns the textual content of the value informed in the `input` argument in the library view, which may be slightly different from that established by JavaScript.

```js
toString()
```

### valueOf

Non-enumerable method that returns the numeric content of the value informed in the `input` argument in the library view, which may be slightly different from that established by JavaScript.

```js
valueOf()
```

# WD JS Array Tools

This object is returned in cases where the value of the `input` argument corresponds to an array. The `type` attribute returns "array".

There is no reference to the original array, that is, the object will create a copy of the array informed in the input argument to perform its manipulations.


## Attributes

### items

Attribute that returns the length of the array.

## Methods

### add

Method for adding items to the array. The returned value is the new array.

```js
add(items...)
```

`items`: The method has a variable number of arguments. Each informed argument will be added to the array.

### count

Method that returns the number of times the item appears in the array.

```js
count(item)
```

`item`: value to be found in the array.


### del

Method for removing items from the array. The returned value is the new array.

```js
del(items...)
```

`items`: The method has a variable number of arguments. Each informed argument will be removed from the array, in all occurrences of the value.


### inside

Method that reports the existence of a value within the array, two results can be returned, boolean or array.

```js
inside(value, indexes)
```


`value`: value to be found in the array.

`indexes`: (optional) If its value is `true`, the function will return an array whose items indicate the position where the value was located in the array. Otherwise, the function will return `true` if the value was found within the array and `false` if it was not found.


### item

Method that returns the value of a specific index in the array.

```js
item(index)
```

`index`: (optional) Index of the array to be returned. When the argument is not an integer, only the entire part will be considered. When the number is negative, the search is returned from the last item in the array (-1 returns the last item, -2 the penultimate item ...). If the index does not exist, it returns undefined. The default value is zero.



### replace

Method that replaces all occurrences of one value with another within the array. The returned value is the new array.

```js
replace(item, value)
```

`item`: Value to be replaced.

`value`: New item value.


### sort

The method returns the array in ascending order, obeying the following sequence of data types: null values, numbers, time, date, text and other information. It does not change the object's array.

```js
unique(unique)
```

`unique`: (optional) if the value is `true`, the [`unique`](#unique) method is executed.


### toggle

Method that removes an item from the array, if the value exists, or adds an item if it does not exist (see the [add](#add) and [del](#del) methods). The returned value is the new array.

```js
toggle(items...)
```

`items`: The method has a variable number of arguments like the [add](#add) and [del](#del) methods.


### unique

The method returns an array with no repeated items. Do not change the object's array.

```js
unique(sort)
```

`sort`: (optional) if the value is `true`, the [`sort`](#sort) method is executed.


### toString

The method returns the value of the array in JSON format.

```js
toString()
```

### valueOf

The method returns the object's array.

```js
unique(sort)
```

# WD JS Date Tools

This object is returned in cases where the value of the `input` argument corresponds to a date value. The `type` attribute returns "date".

The time zone effects are disregarded and the value od the `input` argument take the following forms:

- "YYYY-MM-DD"
- "MM/DD/YYYY"
- "DD.MM.YYYY"
- "%today"
- JavaScript Date Object

#### Nomenclature

- **YYYY** - Four-digit year (integer from 0001 to 9999).
- **MM** - Month with two digits (integer from 01 to 12).
- **DD** - Day with two digits (integer from 01 to 31).

The special string "%today" specifies the current date. The textual representation of the date must be a valid date, otherwise it will not be treated as a date and a different object will be returned.

## Attributes

### countdown

It is a attribute that gets the number of days remaining for the end of the year (last day).

### day

It is a attribute that that gets/sets the value of the day (1-31). If you set a value beyond the limits, the date will be adapted.

You can use the shortcut attribute `d`.

### days

It is a attribute that gets the value of the day of the year (from 1).

### leap

It is a attribute that informs if it is leap year (true/false).

### month

It is a attribute that that gets/sets the value of the month from 1 (january) to 12 (december). If you set a value beyond the limits, the date will be adapted.

You can use the shortcut attribute `m`.

### week

It is a attribute that gets the value of the day of the week from 1 (sunday) to 7 (saturday).

### weeks

It is a attribute that gets the value of the week of the year (from 1).

### width

It is a attribute that gets the number of days in a month.

### year

It is a attribute that gets/sets the value of the year (1-9999). If you set a value beyond the limits, the date will be adapted.

You can use the shortcut attribute `y`.

### wDays

It is an attribute that returns the number of working days until the present date.

### wDaysYear

It is an attribute that returns the number of working days in the year.

## Methods

### format

It is a method that returns the data of the preformatted object.

```js
format(string, locale)
```
`string`: (optional) If not defined, will return the same object result with the toString method. The argument consists of a string where you can enter attributes of the object as format below:

- %d numerical value of the day.
- %D numerical value of the day (two digits).
- @d day of year.
- %m numerical value of the month.
- %M numerical value of the month (two digits).
- @m number of days in month.
- #m short name of the month.
- #M long name of the month.
- %y numerical value of year.
- %Y numerical value of year (four-digit).
- %w numerical value of day of week.
- @w numerical value of week of year.
- #w short name of the day of week.
- #W long name of the day of week.
- %l days in the year.
- %c days remaining for the end of the year.
- %b Business days in the year until the specified date.
- %B Business days in the year.

`locale`: (optional) Consists of a string representing the location (e.g. "pt-BR"). If not set, the location will be the one entered in the lang attribute of the html tag, the provided browser value or "en-US".

### longMonth

It is a method that returns the long name of the month.

```js
longMonth(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### longWeek

It is a method that returns the long name of the day of week.

```js
longWeek(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### shortMonth

It is a method that gets the short name of the month.

```js
shortMonth(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### shortWeek

It is a method that returns the short name of the day of week.

```js
shortWeek(locale)
```

`locale`: The definition of locale is the same as the [format](#format) method.

### toString

returns the date in "YYYY-MM-DD" format.

```js
toString()
```

### valueOf

Returns the number of days elapsed from 0001-01-01 (day 1) until day 9999-12-31 (last day), based on the projection of the Gregorian calendar. If the date limit is exceeded, the date will be set at the respective limit.

```js
valueOf()
```

# WD JS DOM Tools

This object is returned in cases where the value of the `input` argument corresponds to a DOM element or a list of those elements. The `type` attribute returns "dom".

The following primitive values ​​define the object:

- document
- window
- HTMLElement
- NodeList
- HTMLCollection
- HTMLAllCollection
- HTMLFormControlsCollection

#### self-return

Some methods of the object return themselves, so you can apply them in sequence (cascading).

#### querySelectorAll

There is a shortcut to using the querySelectorAll method. To do this, use the wd$ function:

```js
wd$(css, root);
```

The `css` argument must be a CSS selector and the `root` argument (optional) must be a parent element, its default value is `document`.

**Example**

the two procedures below produce the same effect:

```js
/* First procedure: */
var query = document.querySelectorAll("input");
var myObject1 = wd(query);

/* Second procedure: */
var myObject2 = wd$("input");
```

## Attributes

### items

It is an attributes that returns the number of elements contained in the set.

## Methods

### action

It is a method that defines actions for the element. **[Returns the object itself](#self-return)**.

```js
action(act)
```

**Note**: To increase compatibility, it is suggested that the name of the HTML element attributes be written in lower case.

`act`: It is a string that represents the behavior to be applied to the element, as shown below:

- _open_: If the element contains the open attribute, it will be set to true. Otherwise, the wd-open class will be added to the element becoming dependent on the style sheet.
- _close_: If the element contains the open attribute, it will be set to false. Otherwise, the wd-open class, if any, will be removed from the element.
- _toggle-open_: Toggles between "open" and "close".
- _tab_: Displays only the element informed, your brothers will be hidden.
- _next_: Similar to the "tab" action, but displays the next sibling element. The input element must be the parent element of the sibling elements.
- _prev_: Like the "next" action, but displays the previous sibling element.
- _show_: Shows the element.
- _hide_: Hides the element.
- _toggle-show_: Toggles between "show" and "hide".
- _check_: Check input elements of type radio or checkbox.
- _uncheck_: Uncheck input elements of type radio or checkbox.
- _toggle-check_: Toggles the check of the input elements of the type radio or checkbox.
- _enable_: Enables the form element.
- _disable_: Disables the form element.
- _toggle-enable_: Change the enabling of form elements.
- _clean_: Clears the content of the element.
- _del_: Removes the element from DOM.

### class

It is a method that manipulates the `class` attribute. **[Returns the object itself](#self-return)**.

```js
class(list)
```

`list`: It is an object that accepts three keys: "add", "del" and "toggle", executed in this order. The key values ​​are strings that represent the value to be added, removed, or toggled, respectively. If there are more than one attribute to set, the values ​​must be separated by white space. If the value is null the value of the class attribute will be empty.

```js
wd(document.body).class({
	add: "css1 css2",
	del: "css3"
});

wd$("div").class(null);
```

### data

It is a method that that manipulates the data attribute. **[Returns the object itself](#self-return)**.

```js
data(list)
```

`list`: It is an object whose keys and values ​​represent the names of the attributes and their values, respectively. Composite attributes can be represented by dashes or camelCase. If the key's value is null, the attribute's value is removed from the element and if the argument is null, all keys in the "dataset" attribute are cleared.

```js
wd(document.body).data({
	value:   "value 1", /* data-value="value 1"    */
	myValue: "value 2"  /* data-my-value="value 2" */
});

wd$("div").data(null);
```

### filter

It is a method that that displays only child elements that display the textual content entered in the argument. **[Returns the object itself](#self-return)**.

```js
filter(text, min, show)
```

`text`: It is the text to be located in the element.

`min`: (optional) It is the minimum number of characters for the method to be executed. The default value is zero.

`show`: (optional) It is a Boolean value and defines whether the elements to be found will be displayed as long as the minimum number of characters is not reached. The default value is true.

### getStyle

It is a method that returns an array with the style of the component elements of the object. To know the requested style of a certain element, it is necessary to reference it by the array index.

```js
getStyle(css)
```

`css`: It is the name of the style attribute to search. The function return is an array whose items correspond to the values ​​of the attribute indicated in the argument for each element. It does not have self-return behavior.

### handler

It is a method that sets triggers for events to elements defined in the input. **[Returns the object itself](#self-return)**.

```js
handler(input, remove)
```

`input`: It is the object that indicates the events (keys) and respective triggers/methods (values). Event names are not case sensitive and may or may not be prefixed with "on". For multiple triggers for the same event, the method must be called again in cascade form.

`remove`: (optional) If true, the methods entered will be removed from the events.

```js
wd(window).handler({
	click: function1,
	load:  function2
}).handler({
	click: function3
});
```

### item

It is a method that returns the element contained in the element set from its numeric reference information.

```js
item(index)
```

`index`: (optional) It is a argument that indicates the element to return. The elements are organized as a list, each index in the list has a respective element. The operation of the method is similar to the method of the same name as the [WD JS Array Tools](wd-js-array-tools#item). The default value is zero.

### load

It is a method that loads HTML text content into the element similar to the innerHTML attribute. **[Returns the object itself](#self-return)**.

```js
load(html)
```

`html`: (optional) It's HTML content.

### matrix

It is a method that obtains the data from tables (tag table) and converts them to the format of numbers or text, as the case may be.

```js
matrix()
```

The method returns a list of objects, the size of which depends on the number of tables entered in the input field, containing the following attributes:

- `title`: Records the name of the table.
- `header`: List containing the column names of the table.
- `matrix`: Two-dimensional list whose primary index identifies the rows and the secondary index identifies the columns (`[rows, columns]`).

### page

It is a method that divides the child elements into defined quantity groups and display a given group, leaving the others inhibited.  **[Returns the object itself](#self-return)**.

```js
page(page, size)
```

`page`: It is a integer that indicates the group to be displayed. Zero indicates the first group, 1 the second group, -1 the last group, -2 the penultimate group, and so on. If the reported value exceeds the number of groups, the threshold group is displayed, that is, the first or last group, as the case may be.

`size`: It is Integer that indicates the size of each group. If the number is greater than zero and less than or equal to one, the size of the group will be defined by percentage.

### repeat

It is a method that clones the children of an HTML element from an **array of objects** whose keys indicate the reference and the respective value, the information to be replaced. Cloning will be performed if "model child elements" are defined. The number of clones will be equal to the number of items in the matrix and the reference in the child elements must be enclosed in double keys as follows: `{{key}}`. **[Returns the object itself](#self-return)**.

```js
repeat(array)
```

`array`: (optional) It is the array of objects.

### run

It is a method that runs through all the elements of the object and executes a specified script. **[Returns the object itself](#self-return)**.

```js
run(method)
```

`method`: The argument is the function to be performed for each element of the object. The function accepts an argument that will reference the elements individually.

```js
wd$("div").run(function(x) {
	x.style.color = "#000000"
});
```

### sort

It is a method that sorts the child elements in ascending or descending order. **[Returns the object itself](#self-return)**.

```js
sort(order, col)
```

`order`: (optional) It is the number that indicates the order. If less than zero, decreasing, otherwise increasing. The default value is 1.

`col`: (optional) It is a positive integer indicating the column to use as a reference to define the sort order. If the child elements to be sorted also have children (columns), you can use these elements as a parameter for sorting (for example, td elements, children of tr, from a table). The value starts at zero (first child) and cannot be greater than the number of children of the element to be sorted.

### style

It is a method that manipulates the style attribute. **[Returns the object itself](#self-return)**.

```js
style(list)
```

`list`: It is an object whose keys and values ​​represent, respectively, CSS attributes and values. Keys can be in CSS or camelCase style. If the value is null the value of the style attribute will be empty. If the attribute does not exist, it can be ignored.

```js
wd$("div").style({
	backgroundColor: "#000000",
	color: "#FFFFFF"
});
```

### toString

It is a method that returns the browser default value.

```js
toString()
```

### valueOf

It is a method that returns an array of the reported elements.

```js
valueOf()
```

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

# WD JS Time Tools

This object is returned in cases where the value of the `input` argument corresponds to a time value. The `type` attribute returns "time".

The time zone effects are disregarded and the value od the `input` argument take the following forms:

- "H:MM"
- "H:MM:SS"
- "HhMM" *
- "H12:MM AM" **
- "H12:MM PM" **
- "%now"

<small>* _case insensitive_</small><br>
<small>** _case insensitive and with optional white space_</small>

#### Nomenclature

- **H** - Hour with one or two digits (integer from 0 to 24).
- **MM** - Minutes with two digits (integer from 00 to 59).
- **SS** - Seconds with two digits (integer from 00 to 59).
- **H12** - 12h clock (integer from 1 to 12).

The special string "%now" specifies the current time. The textual representation of the date must be a valid time, otherwise it will not be treated as a time and a different object will be returned.

## Attributes

### h12

This is a attribute that gets the time in 12-hour format.

### hour

It is a attribute that that gets/sets the value of the hours (0-24). If you set a value beyond the limits, the time will be adapted.

You can use the shortcut attribute `h`.

### minute

It is a attribute that that gets/sets the value of the minutes (00-59). If you set a value beyond the limits, the time will be adapted.

You can use the shortcut attribute `m`.

### second

It is a attribute that that gets/sets the value of the seconds (00-59). If you set a value beyond the limits, the time will be adapted.

You can use the shortcut attribute `s`.

## Methods

### format

It is a method that returns the time of the preformatted object.

```js
format(string, locale)
```

`string`: (optional) If not defined, will return the same object result with the toString method. The argument consists of a string where you can enter attributes of the object as format below:

- %h Numerical value of the hour.
- %H Numerical value of the hour (two digits).
- #h Time in 12-hour format.
- %m Numerical value of the minutes.
- %M Numerical value of the minutes (two digits).
- %s Numerical value of the seconds.
- %S Numerical value of the seconds (two digits)

`locale`: (optional) Consists of a string representing the location (e.g. "pt-BR"). If not set, the location will be the one entered in the lang attribute of the html tag, the provided browser value or "en-US".

### toString

The toString method returns the time in "HH:MM:SS" format.

```js
toString()
```

### valueOf

The valueOf method returns the number of seconds elapsed from 0 (00:00:00) until 86399 (23:59:59). If the time limit has been exceeded, plus or minus, the count will restart by observing the day cycle.

```js
valueOf()
```

# WD Attributes Tools

The **WD Attributes Tools** consists of a JavaScript library that incorporates in the HTML code some tools of the [WD JS DOM Tools](WD-JS-DOM-Tools) object through attributes informed in the body of the elements.

The tool gives HTML more power by enabling dynamism in the code itself, reducing the demand for scripts.

The following attributes are defined:

- [WD ATTR Action Tool](WD-ATTR-Action-Tool)
- [WD ATTR Click Tool](WD-ATTR-Click-Tool)
- [WD ATTR Config Tool](WD-ATTR-Config-Tool)
- [WD ATTR Data Tool](WD-ATTR-Data-Tool)
- [WD ATTR Device Tool](WD-ATTR-Device-Tool)
- [WD ATTR Edit Tool](WD-ATTR-Edit-Tool)
- [WD ATTR File Tool](WD-ATTR-File-Tool)
- [WD ATTR Filter Tool](WD-ATTR-Filter-Tool)
- [WD ATTR Load Tool](WD-ATTR-Load-Tool)
- [WD ATTR Mask Tool](WD-ATTR-Mask-Tool)
- [WD ATTR Page Tool](WD-ATTR-Page-Tool)
- [WD ATTR Repeat Tool](WD-ATTR-Repeat-Tool)
- [WD ATTR Send Tool](WD-ATTR-Send-Tool)
- [WD ATTR Sort Tool](WD-ATTR-Sort-Tool)
- [WD ATTR Sort Column Tool](WD-ATTR-Sort-Column-Tool)


## Attribute

To incorporate the methods in the code, the generic attribute `data` is used. The attribute structure has the prefix `data-wd-` followed by the name of the tool:

```html
<div data-wd-tool="configuration"></div>
```

Where `tool` represents the name of the tool and `configuration` the way to configure its behavior.

Each attribute is sensitive to one or more events and can affect the element itself that contains it or influence the behavior of other elements .

## Configuration

The way to set the attribute depends on the specified tool, and can be in the following ways:

### Simple Value

Occurs when the attribute's value is straightforward, without specific settings, the value is represented by its content. For example:

```html
<div data-wd-tool="1"></div>
```

### Simple Action

Occurs when the attribute's value needs to specify an action whose indication is defined by its name followed by the characters `{}`. For example:

```html
<div data-wd-tool="action{}"></div>
```
### Simple Action with Argument

It occurs when the action may require additional information, similar to a function argument. If necessary, information should be inserted between the characters `{value}`. For example:

```html
<div data-wd-tool="action{value}"></div>
```

### Multiple Actions

Occurs when the attribute's value can specify more than one action. For example:

```html
<div data-wd-tool="action¹{value¹}action²{value²}..."></div>
```

### Multiple Configurations

Occurs when the attribute value can contain multiple groups of actions. The groups of actions must be separated by the **&** character. For example:

```html
<div data-wd-tool="action¹{value¹}action²{value²}&action¹{value³}action²{value⁴}..."></div>
```

### The Action $

Some attributes require that a specific group of elements be specified, the targets of the action. This type of information is defined by the action `${}` whose value must be in the form of CSS selectors. For example:

```html
<div data-wd-tool="action{value}${css selectors}"></div>
```

## Sensitivity

The tools are executed when certain events occur, as shown below.

### Attribute change

Event linked to changing the attribute value using the [data](WD-JS-DOM-Tools#data) method.

### Click event

Event linked to the click action on the element.

### Input event

Event linked to the action of changing the value of forms.

### Loading page

Event linked to page loading.

### Loading procedures

Event linked to external data loading procedures.

### Screen resizing

Event linked to the resizing of the screen.

### Typing action

Event linked to the action of typing in forms.

### Value change

Event linked to change of value in the form element.



# WD ATTR Action Tool

The purpose of the attribute is to define the behavior of a certain group of elements.

## Linked Methods

- [action](#action)

## Sensitivity

- [Click event](#click-event)

## Target

Elements defined in the attribute.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<button type="button" data-wd-action="action¹{value¹}action²{value²}...">Action</button>
```

`action`: Argument value of the [action](#action) method.

`value`: CSS selector that defines the group of elements to be applied to the specified behavior. If undefined, it will be applied to the element itself.


# WD ATTR Click Tool

The purpose of the attribute is to trigger a click event.

## Linked Methods

_No associated method_.

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)

## Target

The element itself.

## Configuration

- [Simple Value](#simple-value)

## Attribute

```html
<button type="button" data-wd-click="">Clicked</button>
```

_It requires no value._


# WD ATTR Config Tool

The purpose of the attribute is to define some basic user interface settings.

## Linked Methods

_No associated method._.

## Sensitivity

- [Value change](#value-change)

## Target

The `body` element. The attribute must be inserted from the document's body tag.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<body data-wd-config="loading{value¹}bgcolor{value²}color{value³}fileSize{value⁴}fileTotal{value⁵}fileChar{value⁶}fileLen{value⁷}fileType{value⁸}" >
	...
```

`modalMsg`: Defines the phrase during the web request.

`modalFg`: Defines the font color during the web request.

`modalBg`: Defines the color of the window during the web request.

`fileTitle`: Sets the title of the message box (see [WD ATTR File Tool](#wd-attr-file-tool)).

`fileSize`: Defines the restriction phrase for the individual file size (see [WD ATTR File Tool](#wd-attr-file-tool)).

`fileTotal`: Defines the total file size restriction phrase (see [WD ATTR File Tool](#wd-attr-file-tool)).

`fileChar`: Defines the restriction phrase of the characters not allowed in the file name (see [WD ATTR File Tool](#wd-attr-file-tool)).

`fileLen`: Defines the restriction phrase for the total number of files (see [WD ATTR File Tool](#wd-attr-file-tool)).

`fileType`: Defines the restriction phrase for the file type (see [WD ATTR File Tool](#wd-attr-file-tool)).

**Note**: All settings are optional.


# WD ATTR Data Tool

The purpose of the attribute is to define the value of the `data-` attribute of a given group of elements.

## Linked Methods

- [data](#data)

## Sensitivity

- [Click event](#click-event)

## Target

Elements defined in the attribute.

## Configuration

- [Multiple Configurations](#multiple-configurations)

## Attribute

```html
<button type="button" data-wd-data="action¹{value¹}action²{value²}${css¹}&..." >Action</button>
```

`action`: Key name of the object defined as an argument of the [data](#data) method.

`value`: The respective key value of the object defined as the argument of the [data](#data) method.

`$`: CSS selector that defines the group of elements to be applied to the specified behavior. If undefined, it will be applied to the element itself (see [The Action $](#the-action-)).


# WD ATTR Device Tool

The purpose of the tribute is to make the element responsive by defining classes depending on screen size, without the need for specific CSS code.

## Linked Methods

- [class](#class)

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)
- [Screen resizing](#screen-resizing)

## Target

The element itself.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<div data-wd-device="action¹{value¹}action²{value²}...">...</div>
```

`action`: Screen reference:

- desktop
	- For screen sizes starting at 768px.
	- Eliminates classes defined on mobile, tablet and phone.
- mobile
	- For screen sizes smaller than 768px.
	- Eliminates classes defined on desktop.
- tablet
	- For screen sizes from 600 to 767px.
	- Eliminates classes defined on desktop and phone.
- phone
	- For screen sizes smaller than 600px.
	- Eliminates classes defined on desktop and tablet.

`value`: Class names separated by space.


# WD ATTR Edit Tool

The purpose of the attribute is to assign actions for formatting text in editable HTML fields.

__It is a delicate tool to use, as its obsolescence in browsers can occur at any time__. See the [Mozilla Page](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand) for more details.

## Linked Methods

_No associated method_.

## Sensitivity

- [Click event](#click-event)

## Target

HTML elements that can receive the `contenteditable` attribute.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<a href="#" data-wd-edit="action¹{value¹}action²{value²}" >My Formatting</a>
	...
```

- `action`: Name of the command to be executed.
- `value`: Argument value for commands that require it.


# WD ATTR File Tool

The purpose of the attribute is to define restrictions prior to the file type input element.

If any restrictions are broken, a message will be displayed and the element will be cleared.

## Linked Methods

- [message](#message)

## Sensitivity

- [Value change](#value-change)

## Target

The element itself. The attribute must be inserted inside the input tag of type file.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<input type="file" data-wd-file="size{value¹}type{value²}char{value³}len{value⁴}total{value⁵}" multiple="" />
```

`size`: Sets the maximum file size individually (in Bytes).

`type`: Defines the allowed _MIME Types_ separated by space.

`char`: Defines the characters not allowed in the file name.

`len`: Sets the maximum number of files.

`total`: Defines the maximum total file size (in Bytes).

**Note**: All settings are optional.


# WD ATTR Filter Tool

The purpose of the attribute is to filter the children of the defined elements that contain the textual content informed.

## Linked Methods

- [filter](#filter)

## Sensitivity

- [Attribute change](#attribute-change)
- [Input event](#input-event)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)
- [Typing action](#typing-action)

## Target

Children of the elements defined in the attribute.

## Configuration

- [Multiple Configurations](#multiple-configurations)

## Attribute

```html
<input type="search" data-wd-filter="action{value}${css}&..." />
```

`action`: value linked to the `show` argument of the [filter](#filter) method:

- show (`true`)
- hide (`false`)

`value`: value linked to the `min` argument of the [filter](#filter) method.

`$`: CSS selector that defines the group of elements to be applied to the specified behavior (see [The Action $](#the-action-)).


# WD ATTR Load Tool

The purpose of the attribute is to load an external page.

## Linked Methods

- [send](#send)
- [load](#load)

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)

## Target

Element content.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<div data-wd-load="action{value}${css}"></div>
```

`action`: Request method:

- get
- post

`value`: External page path.

`$`: (Optional) If a CSS selector is informed that indicates form elements, the data contained in the fields will be sent in the request. (see [The Action $](#the-action-)).


# WD ATTR Mask Tool

The purpose of the tribute is to apply a mask to the textual content of the element if its value matches the defined regular expression.

## Linked Methods

- [mask](#mask)

## Sensitivity

- [Attribute change](#attribute-change)
- [Input event](#input-event)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)
- [Typing action](#typing-action)

## Target

Textual content of the element.

## Configuration

- [Simple Value](#simple-value)

## Attribute

```html
<input type="text" data-wd-mask="value" />
```

`value`: Regular expression that defines the mask format or the following shortcuts:

- `YYYYMMDD`: Date in "9999-12-31" format.
- `MMDDYYYY`: Date in "12/31/9999" format.
- `DDMMYYYY`: Date in "31.12.9999" format.
- `HHMMSS`: Time in "24:59:59" format.
- `HHMM`: Time in "24h59" format.
- `AMPM`: Time in "12:59am"/"12:59pm" format.

**Note**: It is just a mask, the attribute will not check the value. In form elements (_input, textarea, select, button_), masks can only be applied to text input elements (_textarea, text, email, search, tel, url_) and buttons, except the "submit" type.


# WD ATTR Page Tool

The purpose of the attribute is splits the children of the element into groups and display only a certain group.

## Linked Methods

- [page](#page)

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)

## Target

Children of the element.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<div data-wd-page="size{value¹}page{value²}">
	<div>Item 1</div>
	<div>Item 2</div>
	<div>Item 3</div>
	...
</div>
```

`value¹`: value linked to the `size` argument of the [page](#page) method.

`value²`: value linked to the `page` argument of the [page](#page) method.


# WD ATTR Repeat Tool

It is a method that clones the children of an HTML element from a JSON or CSV file.

To use the CSV file, the columns must be separated by the character `\t` and the lines by the character `\n`.

## Linked Methods

- [send](#send)
- [repeat](#repeat)
- [json](#json)
- [csv](#csv)

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)

## Target

Children of the element.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<ul data-wd-load="action{value}${css}">
	<li>{{name}}, {{age}}</li>
</ul>
```

`action`: Request method:

- get
- post

`value`: JSON or CSV file path.

`$`: (Optional) If a CSS selector is informed that indicates form elements, the data contained in the fields will be sent in the request. (see [The Action $](#the-action-)).

### Example JSON file

```json
[
	{"name": "Name 1", "age": 12},
	{"name": "Name 2", "age": 21},
	{"name": "Name 3", "age": 34},
	{"name": "Name 4", "age": 43}
]
```

### Example CSV file

```csv
name	age
Name 1	12
Name 2	21
Name 3	34
Name 4	43
```


# WD ATTR Send Tool

The purpose of the attribute is to make a web request by sending the information contained in an HTML form or defined in the request path.

## Linked Methods

- [send](#send)

## Sensitivity

- [Click event](#click-event)

## Target

The element itself.

## Configuration

- [Multiple Actions](#multiple-actions)

## Attribute

```html
<button type="button" data-wd-send="action{path}${css}callback{function}">Send</button>
```

`action`: Request method:

- get
- post

`path`: path/file for sending information.


`css`: (optional) CSS selector that defines the form elements for obtaining information (see [The Action $](#the-action-)).

`function`: (optional) Defines the function to be performed during the request. The function must be within the scope of the `window` object.


# WD ATTR Set Tool

The purpose of the attribute is to define the textual content (`text`) or values of the `value` and `class` attributes of the specified element.

## Linked Methods

- [DOM](#wd-js-dom-tools)

## Sensitivity

- [Click event](#click-event)

## Target

Content of the elements defined in the attribute.

## Configuration

- [Multiple Configurations](#multiple-configurations)

## Attribute

```html
<div data-wd-set="attr¹{value¹}attr²{value²}${css¹}&...">Content</div>
```

`attr`: Content to be defined:

- text (set)
- value (set)
- class (set)
- join (add text)
- acss (adds class attributes)
- dcss (deletes class attributes)
- tcss (toggle class attributes)

`value`: Value of textual content or attribute, as appropriate.

`$`: CSS selector that defines the group of elements to be applied to the specified behavior. If undefined, it will be applied to the element itself (see [The Action $](#the-action-)).


# WD ATTR Slide Tool

The purpose of the attribute is to toggle the display of child elements within the defined time interval, such as an automatic slide transition.

## Linked Methods

- [action](#action)

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)

## Target

Children of the element.

## Configuration

- [Simple Value](#simple-value)

## Attribute

```html
<div data-wd-slide="time">
	<div>Slide 1</div>
	<div>Slide 2</div>
	<div>Slide 3</div>
</div>
```

`time`: Time interval of transitions between child elements. The value must be an integer greater than zero, the default value is 1000 milliseconds.


# WD ATTR Sort Column Tool

The purpose of the attribute is to sort table columns (`table` tag).

## Linked Methods

- [sort](#sort)

## Sensitivity

- [Click event](#click-event)

## Target

Columns contained within the `tbody` tag.

## Configuration

- [Simple Value](#simple-value)

## Attribute

```html
data-wd-sort-col=""
```

_It requires no value_.


## Note

The attribute must be contained in the elements `td` or `th`, children of `tr`, child of `thead`:

```html
<table>
	<thead>
		<tr>
			<th data-wd-sort-col="">Column 1</th>
			...
		</tr>
	</thead>
	<tbody>
	...
	</tbody>
</table>
```

When the element with the attribute is clicked, its column will be sorted in ascending order. If you click again, the sort order will be reversed.


# WD ATTR Sort Tool

The purpose of the attribute is splits the children of the element into groups and display only a certain group.

## Linked Methods

- [sort](#sort)

## Sensitivity

- [Attribute change](#attribute-change)
- [Loading page](#loading-page)
- [Loading procedures](#loading-procedures)

## Target

Children of the element.

## Configuration

- [Simple Value](#simple-value)

## Attribute

```html
<ul data-wd-sort="value">
	<li>Item 3</li>
	<li>Item 1</li>
	<li>Item 2</li>
</ul>
```

`value`: value linked to the `order` argument of the [sort](#sort) method.

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

- [WD CSS Components Style](#wd-css-components-style)
- [WD CSS Utilities Style](#wd-css-utilities-style)
- [WD CSS Structural Style](#wd-css-structural-style)


# WD CSS Components Style

Component styles are generally applied to containers, changing the behavior of the element or its children. The behavior is defined based on class attributes.

<!----------------------------------------------------------------------------->
## Block

Displays the children of the element as blocks that occupy the horizontal space.

### Parent Element

- `wd-block`: Defines the behavior.

```html
<nav class="wd-block">
	<span>Horizontal Block 1</span>
	<span>Horizontal Block 2</span>
	...
</nav>
```

<!----------------------------------------------------------------------------->
## Code

Defines a space for writing computational coding. The highlights of the code are stylized using the HTML elements `cite`,` em`, `kbd`,` q`, `samp` and` var`.

### Parent Element

- `wd-code`: Defines an element for defining the code.

### Child Elements

- `cite`: The HTML tag defines formatting for comments.
- `em`: The HTML tag defines formatting to emphasize reserved words in the code.
- `kbd`: The HTML tag defines formatting HTML tags.
- `q`: The HTML tag defines formatting for strings.
- `samp`: The HTML tag defines formatting for returns.
- `var`: The HTML tag define formatting for values.
- `span`: defines a numbered line (must be a direct child of the container and contain all the elements of that line)

```html
<pre class="wd-code">
	<cite>//comment text</cite>
	<em>reserved words</em>
	<kbd>html tag</kbd>
	<q>string</q>
	<samp>returns</samp>
	<var>values</var>
</pre>
```

<!----------------------------------------------------------------------------->
## Columns

These are buildings of horizontally aligned blocks.

### Parent Element

- `wd-row`: defines the parent container that will group the columns.

### Child Elements

- `wd-col-??`: defines the child container that will have the column behavior.

The characters `??` define the column size. The size is represented by an integer from 01 to 12 (two digits) that indicate the number of spaces occupied among 12 available.

```html
<div class="wd-row">
	<div class="wd-col-06">06/12</div>
	<div class="wd-col-03">03/12</div>
	<div class="wd-col-02">02/12</div>
	<div class="wd-col-01">01/12</div>
</div>
```

### Ancestral element

- `wd-col-center-??`: Centers the text of the indicated column.
- `wd-col-right-??`: Align the text of the indicated column to the right.
- `wd-col-left-??`: Left align the text of the indicated column.
- `wd-col-blue-??`: Sets blue as the font color of the indicated column
- `wd-col-red-??`: Defines red as the font color of the indicated column
- `wd-col-green-??`: Sets green as the font color of the indicated column
- `wd-col-mark-??`: Highlights the column of the indicated column

The class attributes above must be placed in an element immediately ancestral to the container that has the class attribute `wd-row`, whose objective will be to group the rows of the columns, similar to the function of the element `tbody` of the `table` element. The attributes can even be used in the element `thead`, `tbody` and `tfoot` to organize the columns of the table, observing the limit of 12 columns only.

The characters `??` indicate the column to have the behavior applied. The column is indicated by an integer from 01 to 12 (two digits) that represents its position in relation to the parent container, that is, "01" represents the first child, "02" the second child and so on.

```html
<table>
	...
	<tbody class="wd-col-center-02 wd-col-right-03 wd-col-left-04 wd-col-blue-05 wd-col-red-06 wd-col-green-07 wd-col-mark-08">
		<tr>
			<td>Col 1 (normal)</td>
			<td>Col 2 (center)</td>
			<td>Col 3 (right)</td>
			<td>Col 4 (left)</td>
			<td>Col 5 (blue)</td>
			<td>Col 6 (red)</td>
			<td>Col 7 (green)</td>
			<td>Col 8 (mark)</td>
		</tr>
		...
	</tbody>
</table>
```

<!----------------------------------------------------------------------------->
## Form Input Messages

Enables you to display an informational (`input`, `select`, `textarea`, `button`) or alert message (`input`, `select`, `textarea`) when the form element receives focus. The alert message has priority over the informational message and will be displayed if the value of the field does not comply with the specified (low compatibility).

### Parent Element

- `wd-form-msg`: Defines the characteristics of a message box for the form element.

The message container must be the __next sibling__ of the form element.

### Child Elements

- `wd-form-msg-info`: Defines the textual content of the informational message.
- `wd-form-msg-warn`: Defines the textual content of the alert message.

```html
<input type="text" required="" />
<div class="wd-form-msg">
	<span class="wd-form-msg-info">Informational message</span>
	<span class="wd-form-msg-warn">Alert message</span>
</div>
```

<!----------------------------------------------------------------------------->
## Grid

Sets the display of child elements as inline blocks aligned in the center.

### Parent Element

- `wd-grid`: Defines short title inline blocks.
- `wd-hgrid`: Defines inline blocks of the landscape type.
- `wd-sgrid`: Defines inline blocks of the square type.
- `wd-vgrid`: Defines inline portrait blocks.

```html
<div class="wd-grid">
	<span>Item 1</span>
	<span>Item 2</span>
	...
</div>
```

<!----------------------------------------------------------------------------->
## In Line

Sets the display of child elements as horizontally aligned inline blocks (without line break).

### Parent Element

- `wd-line`: Defines inline blocks in a generic way.
- `wd-hline`: Defines inline blocks of the landscape type.
- `wd-sline`: Defines inline blocks of the square type.
- `wd-vline`: Defines inline portrait blocks.

```html
<div class="wd-hline">
	<span>Item 1</span>
	<span>Item 2</span>
	...
</div>
```


<!----------------------------------------------------------------------------->
## Report

Formats textual content using predefined HTML tags.

### Parent Element

 - `wd-report`: Defines the container that will be formatted.
 - `wd-itemize`: It is optional and must be used in conjunction with the class attribute `wd-report`, its purpose is to itemize the paragraphs.

### Child Elements

- `h1`: Defines the report title.
- `h2`: Defines the subtitle of the report
- `h3`: Defines the numberable chapters of the report.
- `p`: Defines the report's paragraphs.
- `blockquote`: Defines the long quote.
- `ol`: Defines sub-items whose hierarchy is itemized as follows: Roman numbers, alphabetic characters and numeric characters.
- `ul`: Defines a list of items.
- `table`: Defines a table.
- `caption`: Defines the indication of the table.
- `figure`: Defines an image container.
- `figcaption`: Defines the indication of the figure.

__Note__: Use the `title` attribute to define the text that will be prefixed, before the number, in the chapters (`h3`), paragraphs (`p`) and table and image indicators (`caption` and `figcaption`).

```html
<section class="wd-report">
	<h1>Title</h1>
	<h2>Subtitle</h2>
	<h3>The First Chapter</h3>
	<p>Paragraph...</p>
	...
	<h3>The Second Chapter</h3>
	...
</section>
```

<!----------------------------------------------------------------------------->
## Tip Box

It allows the creation of a hidden box that is displayed when resting the mouse or clicking on the element.

### Parent Element

- `wd-tip`: Creates the hidden box container.

### Child Elements

#### Hover

- `wd-tip-hover-top`: Defines the content of the tip that will be displayed at the top when resting the mouse.
- `wd-tip-hover-right`: Defines the hint content that will be displayed on the right when resting the mouse.
- `wd-tip-hover-bottom`: Defines the content of the tip that will be displayed at the bottom when resting the mouse.
- `wd-tip-hover-left`: Defines the content of the tip that will be displayed on the left when resting the mouse.

```html
<div class="wd-tip">
	<button type="button" >Hover</button>
	<div class="wd-tip-hover-top">Hello!</div>
</div>
```

#### Click

- `wd-tip-click-top`: Defines the content of the tip that will be displayed at the top when clicking on the element.
- `wd-tip-click-right`: Defines the hint content that will be displayed on the right when clicking on the element.
- `wd-tip-click-bottom`: Defines the content of the tip that will be displayed at the bottom clicking on the element.
- `wd-tip-click-left`: Defines the content of the tip that will be displayed on the left clicking on the element.

To display the contents of the box with the click event, the parent container (`wd-tip`) will need to receive the class attribute `wd-open`.

See [action method](#action) and [action attribute](#wd-attr-action-tools).

```html
<div class="wd-tip" id="tip">
	<button type="button" data-wd-action="toggle-open{#tip}">Click</button>
	<div class="wd-tip-click-top">Hello!</div>
</div>
```

<!----------------------------------------------------------------------------->
## Window

Define resources for creating dialog boxes.

### Dialog Box

- `wd-window`: Defines a centralized dialog box.
- `wd-window-full`: Defines a full-screen dialog.
- `wd-window-top`: Defines a top dialog box.
- `wd-window-right`: Defines a dialog box on the right.
- `wd-window-bottom`: Defines a lower dialog box.
- `wd-window-left`: Defines a dialog box on the left.


__Note__: The element will open when it receives the class value `wd-open`. See [action method](#action) and [action attribute](#wd-attr-action-tool). When it is inserted in a container with the value `wd-modal`, who should receive the value `wd-open` is the parent container only.

```html
<aside class="wd-window wd-open">
	<h3>Hello!</h3>
</aside>
```

### Background

- `wd-modal`: Sets a background for displaying the dialog box, preventing the elements of the main window from being manipulated while the window is open.

The element will open when it receives the class value `wd-open`. See [action method](#action) and [action attribute](#wd-attr-action-tool).

```html
<div class="wd-modal wd-open">
	<aside class="wd-window">
		<h3>Hello!</h3>
	</aside>
</div>
```

## Flyer

Defines a block of elements that fits the child elements `header`, `footer` and `nav`.

- `wd-flyer`: defines the behavior in the container

```html
<section class="wd-flyer">
	<header>
		<h2>Header</h2>
	</header>

	<p>Paragraph...</p>
	...
</section>
```


# WD CSS Structural Style

Defines the behavior of the HTML document focused on the `body` element. The `main` element is considered as the element that concentrates the content of the document.

## Center

Defines the margins of the `main` element, if any.

- `wd-center`: Horizontally centers the `main` element, leaving the page content separate from the borders.
- `wd-left`: Aligns the `main` element to the left, leaving the page content separate from this border.
- `wd-right`: Aligns the `main` element to the right, leaving the page content separate from this border.

```html
<body class="wd-center">
	<header>
		<h1>Header</h1>
	</header>

	<main>
		...
	</main>
</body>
```

## Fixed

Sets the elements `header` and` footer`, children of `body`, at the top and bottom of the page, respectively.

- `wd-fixed`: defines the behavior.

```html
<body class="wd-fixed">
	<header>
		<h1>Header</h1>
	</header>

	<main>
		...
	</main>
</body>
```


# WD CSS Utilities Style

Utility styles are those with a more specific configuration and greater power, which can overlap more generic styles.

<!----------------------------------------------------------------------------->
## Align

Sets the text alignment. The suffix [`-child`](#inheritances) applies.

- `wd-align-left`: left
- `wd-align-center`: center
- `wd-align-right`: right
- `wd-align-justify`: justify
- `wd-align-middle`: in the middle
- `wd-align-top`: on the top
- `wd-align-bottom`: at the bottom

<!----------------------------------------------------------------------------->
## Attributes

Displays the content of the attribute after its textual content.

- `wd-attr-cite`: displays the cite
- `wd-attr-href`: displays the link
- `wd-attr-title`: displays the title

<!----------------------------------------------------------------------------->
## Background Color

Sets the background color. The suffix [`-child`](#inheritances) applies.

- `wd-bg-black`: black
- `wd-bg-white`: white
- `wd-bg-grey`: grey
- `wd-bg-red`: red
- `wd-bg-green`: green
- `wd-bg-blue`: blue
- `wd-bg-yellow`: yellow
- `wd-bg-orange`: orange
- `wd-bg-brown`: brown
- `wd-bg-pink`: pink
- `wd-bg-purple`: purple
- `wd-bg-none`: transparent
- `wd-bg-basic`: black and white

<!----------------------------------------------------------------------------->
## Background Image

Sets an image as the background.

- `wd-bg-image`: the image will occupy the entire container
- `wd-bg-photo`: the image will fit into the container
- `wd-bg-paper`: a still image will be defined
- `wd-bg-figures`: the image will multiply side by side

To define the image it is necessary to use the attribute `style`:

```html
<div style="background-image: url(image path); height: 200px;" class="wd-bg-image">Image</div>
```

<!----------------------------------------------------------------------------->
## Border

Sets the container border. The suffix [`-child`](#inheritances) applies.

### Quantitative behavior

- `wd-border`: border (level 1)
- `wd-xborder`: border (level 2)
- `wd-xxborder`: border (level 3)
- `wd-border-none`: without border.

### Qualitative behavior

- `wd-border-top`: top border (level 1)
- `wd-border-right`: right border (level 1)
- `wd-border-bottom`: bottom border (level 1)
- `wd-border-left`: left border (level 1)
- `wd-border-length`: left and right border (level 1)
- `wd-border-height`: top and bottom border (level 1)
- `wd-xborder-top`: top border (level 2)
- ...
- `wd-xxborder-top`: top border (level 3)
- ...

### Closing the block

- `wd-border-box`: Adds a thin transparent border to close the block in situations where the dimensions of the child element exceed the limits of the parent element due to the `box-sizing` attribute being set to `border-box`.


<!----------------------------------------------------------------------------->
## Buddy

Makes the element follow the vertical movement of the page within the boundaries of the parent container. It has low compatibility.

- `wd-buddy-top`: stuck at the top
- `wd-buddy-bottom`: stuck at the bottom

<!----------------------------------------------------------------------------->
## Case

Defines about the font (uppercase / lowercase). The suffix [`-child`](#inheritances) applies.

- `wd-case-upper`: uppercase
- `wd-case-normal`: Cancels the effects of other
- `wd-case-lower`: lowercase
- `wd-case-title`: the first letter of each word is capitalized
- `wd-case-caps`: it is the union of the `wd-case-upper` and `wd-case-title` attributes

<!----------------------------------------------------------------------------->
## Cloud

Sets cloud on the element.

- `wd-cloud`: defines behavior*
- `wd-cloud-enter`: behavior defined when entering the element with the mouse*
- `wd-cloud-leave`: defined behavior when removing the mouse from the element*
- `wd-cloud-in`: behavior defined when entering the mouse into the parent container.
- `wd-cloud-out`: behavior defined when exiting with the mouse from the parent container.
- `wd-cloud-none`: without cloud/shadow.

\* The suffix [`-child`](#inheritances) applies.

```html
<div class="wd-cloud-enter">
	<span>...</span>
	<span>Parent element gains effect when hovering.</span>
	<span>...</span>
</div>

<div>
	<span>...</span>
	<span class="wd-cloud-in">I gain the effect by hovering the mouse over the parent element.</span>
	<span>...</span>
</div>
```

<!----------------------------------------------------------------------------->
## Color

Sets the font color. The suffix [`-child`](#inheritances) applies.

- `wd-fg-black`: black
- `wd-fg-white`: white
- `wd-fg-grey`: grey
- `wd-fg-red`: red
- `wd-fg-green`: green
- `wd-fg-blue`: blue
- `wd-fg-yellow`: yellow
- `wd-fg-orange`: orange
- `wd-fg-brown`: brown
- `wd-fg-pink`: pink
- `wd-fg-purple`: purple
- `wd-fg-none`: basic black

<!----------------------------------------------------------------------------->
## Icon

Defines a pre-positioned icon in the textual content. As they are HTML symbols, the icons may be different in different browsers as well as they may not be properly implemented.

### Math

- `wd-icon-plus`: Icon representing an addition.
- `wd-icon-minus`: Icon representing a subtraction.
- `wd-icon-times`: Icon representing a multiplication.
- `wd-icon-divide`: Icon representing a division.

### Media

- `wd-icon-play`: Icon representing a start.
- `wd-icon-stop`: Icon representing a stop.
- `wd-icon-forward`: Icon representing an advance.
- `wd-icon-backward`: Icon representing a setback.
- `wd-icon-rec`: Icon representing a recording.
- `wd-icon-music`: Icon representing something musical.
- `wd-icon-video`: Icon representing something audiovisual.
- `wd-icon-image`: Icon representing some image.
- `wd-icon-www`: Icon representing web browsing.
- `wd-icon-voice`: Icon representing a voice.
- `wd-icon-news`: Icon representing news.

### Alerts

- `wd-icon-info`: Icon representing an information.
- `wd-icon-warn`: Icon representing an alert.
- `wd-icon-doubt`: Icon representing a question.
- `wd-icon-ok`: Icon representing a success.
- `wd-icon-error`: Icon representing an error.

### Actions

- `wd-icon-copy`: Icon representing a copy action.
- `wd-icon-cut`: Icon representing a cutout action.
- `wd-icon-paste`: Icon representing a collage action.
- `wd-icon-open`: Icon representing an open action.
- `wd-icon-new`: Icon representing a new action.
- `wd-icon-file`: Icon representing a file.
- `wd-icon-save`: Icon representing a registration action.
- `wd-icon-attach`: Icon representing an attach action.
- `wd-icon-search`: Icon representing a search action.
- `wd-icon-download`: Icon representing a get action.
- `wd-icon-upload`: Icon representing a send action.
- `wd-icon-link`: Icon representing a link action.
- `wd-icon-bookmark`: Icon representing something favorite.
- `wd-icon-bell`: Icon representing an alert action.
- `wd-icon-help`: Icon representing a reminder action.
- `wd-icon-home`: Icon representing a start action.
- `wd-icon-target`: Icon representing a goal.
- `wd-icon-door`: Icon representing an exit action.
- `wd-icon-close`: Icon representing a close action.
- `wd-icon-reload`: Icon representing an reload action.
- `wd-icon-config`: Icon representing an action to configure.
- `wd-icon-menu`: Icon representing a menu.
- `wd-icon-list`: Icon representing a list.
- `wd-icon-key`: Icon representing something restricted.
- `wd-icon-unlocked`: Icon representing something open.
- `wd-icon-locked`: Icon representing something closed.
- `wd-icon-battery`: Icon representing a level.
- `wd-icon-sound`: Icon representing a sound action.
- `wd-icon-network`: Icon representing an action.
- `wd-icon-user`: Icon representing an user.

### Genre

- `wd-icon-he`: Icon representing a male intention.
- `wd-icon-she`: Icon representing a female intention.

### Arrows

- `wd-icon-n`: Icon representing the north.
- `wd-icon-ne`: Icon representing the northeast.
- `wd-icon-e`: Icon representing the east.
- `wd-icon-se`: Icon representing the southeast.
- `wd-icon-s`: Icon representing the south.
- `wd-icon-sw`: Icon representing the southwest.
- `wd-icon-w`: Icon representing the west.
- `wd-icon-nw`: Icon representing the northwest.
- `wd-icon-soon`: Icon representing that coming soon.
- `wd-icon-back`: Icon representing the return.
- `wd-icon-top`: Icon representing the top.
- `wd-icon-right`: Icon representing the right side.
- `wd-icon-left`: Icon representing anthe left side.

### Devices

- `wd-icon-email`: Icon representing an email.
- `wd-icon-mail`: Icon representing a mail.
- `wd-icon-phone`: Icon representing a phone.
- `wd-icon-mobile`: Icon representing a mobile device.
- `wd-icon-clock`: Icon representing a clock.
- `wd-icon-date`: Icon representing a date.
- `wd-icon-time`: Icon representing a time.
- `wd-icon-chart`: Icon representing a chart.
- `wd-icon-increase`: Icon representing a positive results.
- `wd-icon-decrease`: Icon representing a negative results.
- `wd-icon-money`: Icon representing money.
- `wd-icon-radio`: Icon representing a radio.
- `wd-icon-tv`: Icon representing a TV.
- `wd-icon-cam`: Icon representing a camera.

### Custom

- `wd-icon-custom`: It allows the definition of an icon from an image (`img` object).

```html
<h1><img src="image path" class="wd-icon-custom" /> My Icon</h1>
```

<!----------------------------------------------------------------------------->
## Margin

Sets the container margin. The suffix [`-child`](#inheritances) applies.

### Quantitative behavior

- `wd-margin`: margin (level 1)
- `wd-xmargin`: margin (level 2)
- `wd-xxmargin`: margin (level 3)
- `wd-margin-none`: without margin.

### Qualitative behavior

- `wd-margin-top`: top margin (level 1)
- `wd-margin-right`: right margin (level 1)
- `wd-margin-bottom`: bottom margin (level 1)
- `wd-margin-left`: left margin (level 1)
- `wd-margin-length`: left and right margin (level 1)
- `wd-margin-height`: top and bottom margin (level 1)
- `wd-xmargin-top`: top margin (level 2)
- ...
- `wd-xxmargin-top`: top margin (level 3)
- ...

<!----------------------------------------------------------------------------->
## Opaque

Sets opacity on the element.

- `wd-opaque`: defines behavior*
- `wd-opaque-enter`: behavior defined when entering the element with the mouse*
- `wd-opaque-leave`: defined behavior when removing the mouse from the element*
- `wd-opaque-in`: behavior defined when entering the mouse into the parent container.
- `wd-opaque-out`: behavior defined when exiting with the mouse from the parent container.
- `wd-opaque-none`: without opacity.

\* The suffix [`-child`](#inheritances) applies.

See the example of the [`cloud`](#cloud) section.

<!----------------------------------------------------------------------------->
## Padding

Sets the container padding. The suffix [`-child`](#inheritances) applies.

### Quantitative behavior

- `wd-padding`: padding (level 1)
- `wd-xpadding`: padding (level 2)
- `wd-xxpadding`: padding (level 3)
- `wd-padding-none`: without padding.

### Qualitative behavior

- `wd-padding-top`: top padding (level 1)
- `wd-padding-right`: right padding (level 1)
- `wd-padding-bottom`: bottom padding (level 1)
- `wd-padding-left`: left padding (level 1)
- `wd-padding-length`: left and right padding (level 1)
- `wd-padding-height`: top and bottom padding (level 1)
- `wd-xpadding-top`: top padding (level 2)
- ...
- `wd-xxpadding-top`: top padding (level 3)
- ...

<!----------------------------------------------------------------------------->
## Place

Specifies the placement of the child element within the container (parent). Specifies the placement of the child element within the container (parent). The parent element cannot contain the placement set to `static`.

- `wd-place-n`: north
- `wd-place-ne`: northeast
- `wd-place-e`: east
- `wd-place-se`: southeast
- `wd-place-s`: south
- `wd-place-sw`: southwest
- `wd-place-w`: west
- `wd-place-nw`: northwest
- `wd-place-ctr`: center

```html
<div style="position: relative; height: 200px;">
	<span class="wd-place-ctr">Center</span>
</div>
```

<!----------------------------------------------------------------------------->
## Radius

Sets the container border radius. The suffix [`-child`](#inheritances) applies.

- `wd-radius-top`: top border radius (nw and ne)
- `wd-radius-right`: right border radius (ne and se)
- `wd-radius-bottom`: bottom border radius (se and sw)
- `wd-radius-left`: left border radius (sw and nw)
- `wd-radius-none`: without border radius.

<!----------------------------------------------------------------------------->
## Shadow

Sets shadow on the element.

- `wd-shadow`: defines behavior*
- `wd-shadow-enter`: behavior defined when entering the element with the mouse*
- `wd-shadow-leave`: defined behavior when removing the mouse from the element*
- `wd-shadow-in`: behavior defined when entering the mouse into the parent container.
- `wd-shadow-out`: behavior defined when exiting with the mouse from the parent container.
- `wd-shadow-none`: without cloud/shadow.

\* The suffix [`-child`](#inheritances) applies.

See the example of the [`cloud`](#cloud) section.

<!----------------------------------------------------------------------------->
## Show/Hide

- `wd-show`: leaves the element visible
- `wd-hide`: leaves the element invisible
- `wd-overlook`: neglects the element in the HTML document
- `wd-show-box`: leaves the element visible when the mouse enters the parent element
- `wd-hide-box`: leaves the element invisible when the mouse enters the parent element
- `wd-show-print`: leaves the element visible during printing
- `wd-hide-print`: leaves the element invisible during printing
- `wd-overlook-print`: neglects the element in the HTML document when printing

<!----------------------------------------------------------------------------->
## Size

Sets the font size. The suffix [`-child`](#inheritances) applies.

- `wd-size-xxsmall`: small (level 3)
- `wd-size-xsmall`: small (level 2)
- `wd-size-small`: small (level 1)
- `wd-size-smaller`: relatively small
- `wd-size-medium`: default
- `wd-size-larger`: relatively large
- `wd-size-large`: large (level 1)
- `wd-size-xlarge`: large (level 2)
- `wd-size-xxlarge`: large (level 3)

<!----------------------------------------------------------------------------->
## Text Formatting

Styles in order to apply textual formatting, meeting the need to use specific HTML elements. The suffix [`-child`](#inheritances) applies.

- `wd-b`: bold
- `wd-u`: italic
- `wd-i`: underlined
- `wd-s`: strikethrough
- `wd-mark`: highlighted

To cancel formatting:

- `wd-b-none`: bold
- `wd-i-none`: italic
- `wd-line-none`: underlined and strikethrough
- `wd-mark-none`: highlighted
- `wd-plain`: all

<!----------------------------------------------------------------------------->
## Upon

Defines highlighting for the element.

- `wd-upon`: defines behavior*
- `wd-upon-enter`: behavior defined when entering the element with the mouse*
- `wd-upon-in`: behavior defined when entering the mouse into the parent container.
- `wd-upon-toggle`: defines the behavior of the element's children alternately.

\* The suffix [`-child`](#inheritances) applies.

See the example of the [`cloud`](#cloud) section.

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

- [Manual](https://wdonadelli.github.io/wd/docs/v2)
- [Javascript](https://wdonadelli.github.io/wd/v2/wd/source/wd-2.1.4.js)
- [Style Sheet](https://wdonadelli.github.io/wd/v2/wd/source/wd-2.0.4.css)

Links to version 1 (deprecated):

- [Manual](https://wdonadelli.github.io/wd/docs/v1/)
- [Javascript](https://wdonadelli.github.io/wd/v1/wd/source/wd-1.3.2.js)
- [Style Sheet](https://wdonadelli.github.io/wd/v1/wd/source/wd-1.3.2.css)

_Willian Donadelli_ (<wdonadelli@gmail.com>), 2020-11-11


