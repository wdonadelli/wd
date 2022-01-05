# WD ATTR Set Tool

The purpose of the attribute is to define the textual content (`text`) or values of the `value` and `class` attributes of the specified element.

## Linked Methods

- [DOM](WD-JS-DOM-Tools)

## Sensitivity

- [Click event](WD-Attributes-Tools#click-event)

## Target

Content of the elements defined in the attribute.

## Configuration

- [Multiple Configurations](WD-Attributes-Tools#multiple-configurations)

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

`$`: CSS selector that defines the group of elements to be applied to the specified behavior. If undefined, it will be applied to the element itself (see [The Action $](WD-Attributes-Tools#the-action-)).
