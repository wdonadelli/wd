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
