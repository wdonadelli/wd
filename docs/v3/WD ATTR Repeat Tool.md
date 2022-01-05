# WD ATTR Repeat Tool

It is a method that clones the children of an HTML element from a JSON or CSV file.

To use the CSV file, the columns must be separated by the character `\t` and the lines by the character `\n`.

## Linked Methods

- [send](WD-JS-Shared-Tools#send)
- [repeat](WD-JS-DOM-Tools#repeat)
- [json](WD-JS-Text-Tools#json)
- [csv](WD-JS-Text-Tools#csv)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)

## Target

Children of the element.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

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

`$`: (Optional) If a CSS selector is informed that indicates form elements, the data contained in the fields will be sent in the request. (see [The Action $](WD-Attributes-Tools#the-action-)).

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
