# WD ATTR Action Tool

The purpose of the attribute is to define the behavior of a certain group of elements.

## Linked Methods

- [action](WD-JS-DOM-Tools#action)

## Sensitivity

- [Click event](WD-Attributes-Tools#click-event)

## Target

Elements defined in the attribute.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<button type="button" data-wd-action="action¹{value¹}action²{value²}...">Action</button>
```

`action`: Argument value of the [action](WD-JS-DOM-Tools#action) method.

`value`: CSS selector that defines the group of elements to be applied to the specified behavior. If undefined, it will be applied to the element itself.
