# WD ATTR Data Tool

The purpose of the attribute is to define the value of the `data-` attribute of a given group of elements.

## Linked Methods

- [data](WD-JS-DOM-Tools#data)

## Sensitivity

- [Click event](WD-Attributes-Tools#click-event)

## Target

Elements defined in the attribute.

## Configuration

- [Multiple Configurations](WD-Attributes-Tools#multiple-configurations)

## Attribute

```html
<button type="button" data-wd-data="action¹{value¹}action²{value²}${css¹}&..." >Action</button>
```

`action`: Key name of the object defined as an argument of the [data](WD-JS-DOM-Tools#data) method.

`value`: The respective key value of the object defined as the argument of the [data](WD-JS-DOM-Tools#data) method.

`$`: CSS selector that defines the group of elements to be applied to the specified behavior. If undefined, it will be applied to the element itself (see [The Action $](WD-Attributes-Tools#the-action-)).
