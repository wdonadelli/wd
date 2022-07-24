# WD ATTR Load Tool

The purpose of the attribute is to load an external page.

## Linked Methods

- [send](WD-JS-Shared-Tools#send)
- [load](WD-JS-DOM-Tools#load)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)

## Target

Element content.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<div data-wd-load="action{value}${css}"></div>
```

`action`: Request method:

- get
- post

`value`: External page path.

`$`: (Optional) If a CSS selector is informed that indicates form elements, the data contained in the fields will be sent in the request. (see [The Action $](WD-Attributes-Tools#the-action-)).
