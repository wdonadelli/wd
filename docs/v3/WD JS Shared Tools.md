# WD JS Shared Tools

This object is returned in cases where the value of the input argument has no specified behavior. Its methods and attributes are shared with all other objects.

## Attributes

### type

Returns a string that identifies the type of the value entered in the `input` argument. The following values ​​are possible:

- "array"
- "boolean"
- "date"
- "dom"
- "function"
- "null"
- "number"
- "object"
- "regexp"
- "text"
- "time"
- "undefined"

The definition above is slightly different from that specified by JavaScript. If the argument does not fit into any of the above categories, it returns the constructor name. And if there is no constructor, it will return "unknown".

### tools

Returns a list containing the names (string) of the methods and attributes of the returned object that are enumerable.

## Methods

### send

Tool to execute web requests. Returns the object itself.

```js
send(action, callback, method, async)
```

`action`: Defines the path/file for sending information.

`callback`: (optional) Defines the function to be performed during the request, the default value is null. The function accepts an argument that will receive the status of the request. The request status is sent through an object with the following characteristics:

- `closed`: Boolean attribute that informs if the request has already been closed. Being `true` for closed request and `false` for ongoing request.
- `status`: Attribute that informs the status of the request (string). The following values ​​are possible:
	* `UNSENT` - requisition not started;
	* `OPENED` - requisition initiated;
	* `HEADERS` - header reading performed;
	* `LOADING` - loading response;
	* `UPLOADING` - updating information;
	* `DONE` - successfully completed request;
	* `NOTFOUND` - path/file not found;
	* `ABORTED` - aborted request;
	* `ERROR` - an error occurred in the request; and
	* `TIMEOUT` - request waiting time ended.
- `time`: numeric attribute that returns the elapsed time of the request in milliseconds.
- `size`: numeric attribute that informs the total size, in bytes, of the request, if available..
- `loaded`: numeric attribute that informs the partial size, in bytes, of the request, if available.
- `progress`: numeric attribute that informs, when possible, the progress of the request during the "LOADING" or "UPLOADING" (initial value is zero and the final value is 1).
- `text`: attribute that returns the textual content of the request, if any, its default value being null.
- `xml`: attribute that returns the tree of the XML content of the request, if any, its default value being null.
- `json`: attribute that returns the JSON content of the request, if any, its default value being null.
- `csv`: attribute that returns the contents of an object csv file, if any, its default value being null.
- `request`: attribute that returns the request's constructor object (the expected object is XMLHttpRequest).
- `abort()`: method that causes the interruption of the request.

`method`: (optional) Defines the type of request to be made as a string ("POST", "GET" ...), the default value is "GET".

`async`: (optional) Boolean value that defines whether the request will be asynchronous (default) or synchronous. For synchronous requests, the value must be `true`.

The information to be sent depends on the content of the `input` attribute of the `wd` function:

#### dom

If the data type is "dom", the information sent will be the information available in the HTML form elements that have the `name` attribute defined.

If the submission method is `GET` (default), the information collected from the form elements will be sent by serialization, similar to `"key1=value1&key2=value2 ..."`.

If the sending method is `POST`, the collection will be stored in an `FormData` object and, if the browser does not include the aforementioned object, the information will be obtained in the same way obtained by the `GET` method.

**Note**: The behavior is slightly different from that applied to a form when submitting it. For the elements `select` and `file` (_input_), when empty, no information is captured. If there is multiple information, the first value will be assigned to its original `name` attribute. For the following information, the values ​​will be assigned to the name followed by an index that represents the sequence of the information:

```js
name=value01&name_1=value02&value_2=value03...
```

#### null/undefined

- If the type is "null" or "undefined", no information will be sent to the request, but this will happen.

#### Other types

- Otherwise, the information sent will be assigned to the key "value" whose value will correspond to the textual content of the information contained in the argument `input` in the format `"value=textual content"`.

### toString

Non-enumerable method that returns the textual content of the value informed in the `input` argument in the library view, which may be slightly different from that established by JavaScript.

```js
toString()
```

### valueOf

Non-enumerable method that returns the numeric content of the value informed in the `input` argument in the library view, which may be slightly different from that established by JavaScript.

```js
valueOf()
```
