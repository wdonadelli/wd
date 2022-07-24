# WD ATTR Send Tool

The purpose of the attribute is to make a web request by sending the information contained in an HTML form or defined in the request path.

## Linked Methods

- [send](WD-JS-Shared-Tools#send)

## Sensitivity

- [Click event](WD-Attributes-Tools#click-event)

## Target

The element itself.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<button type="button" data-wd-send="action{path}${css}callback{function}">Send</button>
```

`action`: Request method:

- get
- post

`path`: path/file for sending information.


`css`: (optional) CSS selector that defines the form elements for obtaining information (see [The Action $](WD-Attributes-Tools#the-action-)).

`function`: (optional) Defines the function to be performed during the request. The function must be within the scope of the `window` object.
