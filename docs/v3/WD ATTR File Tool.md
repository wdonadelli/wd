# WD ATTR File Tool

The purpose of the attribute is to define restrictions prior to the file type input element.

If any restrictions are broken, a message will be displayed and the element will be cleared.

## Linked Methods

- [message](WD-JS-Text-Tools#message)

## Sensitivity

- [Value change](WD-Attributes-Tools#value-change)

## Target

The element itself. The attribute must be inserted inside the input tag of type file.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

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
