# WD JS Array Tools

This object is returned in cases where the value of the `input` argument corresponds to an array. The `type` attribute returns "array".

There is no reference to the original array, that is, the object will create a copy of the array informed in the input argument to perform its manipulations.


## Attributes

### items

Attribute that returns the length of the array.

## Methods

### add

Method for adding items to the array. The returned value is the new array.

```js
add(items...)
```

`items`: The method has a variable number of arguments. Each informed argument will be added to the array.

### count

Method that returns the number of times the item appears in the array.

```js
count(item)
```

`item`: value to be found in the array.


### del

Method for removing items from the array. The returned value is the new array.

```js
del(items...)
```

`items`: The method has a variable number of arguments. Each informed argument will be removed from the array, in all occurrences of the value.


### inside

Method that reports the existence of a value within the array, two results can be returned, boolean or array.

```js
inside(value, indexes)
```


`value`: value to be found in the array.

`indexes`: (optional) If its value is `true`, the function will return an array whose items indicate the position where the value was located in the array. Otherwise, the function will return `true` if the value was found within the array and `false` if it was not found.


### item

Method that returns the value of a specific index in the array.

```js
item(index)
```

`index`: (optional) Index of the array to be returned. When the argument is not an integer, only the entire part will be considered. When the number is negative, the search is returned from the last item in the array (-1 returns the last item, -2 the penultimate item ...). If the index does not exist, it returns undefined. The default value is zero.



### replace

Method that replaces all occurrences of one value with another within the array. The returned value is the new array.

```js
replace(item, value)
```

`item`: Value to be replaced.

`value`: New item value.


### sort

The method returns the array in ascending order, obeying the following sequence of data types: null values, numbers, time, date, text and other information. It does not change the object's array.

```js
unique(unique)
```

`unique`: (optional) if the value is `true`, the [`unique`](#unique) method is executed.


### toggle

Method that removes an item from the array, if the value exists, or adds an item if it does not exist (see the [add](#add) and [del](#del) methods). The returned value is the new array.

```js
toggle(items...)
```

`items`: The method has a variable number of arguments like the [add](#add) and [del](#del) methods.


### unique

The method returns an array with no repeated items. Do not change the object's array.

```js
unique(sort)
```

`sort`: (optional) if the value is `true`, the [`sort`](#sort) method is executed.


### toString

The method returns the value of the array in JSON format.

```js
toString()
```

### valueOf

The method returns the object's array.

```js
unique(sort)
```
