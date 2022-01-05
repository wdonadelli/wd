# WD ATTR Filter Tool

The purpose of the attribute is to filter the children of the defined elements that contain the textual content informed.

## Linked Methods

- [filter](WD-JS-DOM-Tools#filter)

## Sensitivity

- [Attribute change](WD-Attributes-Tools#attribute-change)
- [Input event](WD-Attributes-Tools#input-event)
- [Loading page](WD-Attributes-Tools#loading-page)
- [Loading procedures](WD-Attributes-Tools#loading-procedures)
- [Typing action](WD-Attributes-Tools#typing-action)

## Target

Children of the elements defined in the attribute.

## Configuration

- [Multiple Configurations](WD-Attributes-Tools#multiple-configurations)

## Attribute

```html
<input type="search" data-wd-filter="action{value}${css}&..." />
```

`action`: value linked to the `show` argument of the [filter](WD-JS-DOM-Tools#filter) method:

- show (`true`)
- hide (`false`)

`value`: value linked to the `min` argument of the [filter](WD-JS-DOM-Tools#filter) method.

`$`: CSS selector that defines the group of elements to be applied to the specified behavior (see [The Action $](WD-Attributes-Tools#the-action-)).
