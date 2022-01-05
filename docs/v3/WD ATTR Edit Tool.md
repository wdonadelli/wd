# WD ATTR Edit Tool

The purpose of the attribute is to assign actions for formatting text in editable HTML fields.

__It is a delicate tool to use, as its obsolescence in browsers can occur at any time__. See the [Mozilla Page](https://developer.mozilla.org/en-US/docs/Web/API/document/execCommand) for more details.

## Linked Methods

_No associated method_.

## Sensitivity

- [Click event](WD-Attributes-Tools#click-event)

## Target

HTML elements that can receive the `contenteditable` attribute.

## Configuration

- [Multiple Actions](WD-Attributes-Tools#multiple-actions)

## Attribute

```html
<a href="#" data-wd-edit="action¹{value¹}action²{value²}" >My Formatting</a>
	...
```

- `action`: Name of the command to be executed.
- `value`: Argument value for commands that require it.
