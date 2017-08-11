Writing a component
===

### section
indicator of the section where call is made. Basically there are just a few possible values:
- `header`, `footer`, `sticky` for direct layout children.
- `document` is a top-level
- `container` is used for everything else, indicating inner elements.
The practical usage of this element is to prevent usage of elements designed to be top-level
containers from appearing in any other place.

### index
Index of element inside parent

### props
Properties of the element in the template, exactly as they it is described

### context
Set of execution context. Basic context can contain the following, but could be extended too:
- `context.globals` - all global variables
- `context.docs` - all documents loaded
- `context.queries` - collection of queries data loaded.
- `context.chunks` - collections of queries splitted into parts.
- `context.routing` - routing properties (not sure if used or can be used).
- `context.row` - properties, mapped to the element from the parents

### pos
A variable to pass to `getStyling` function.

Can keep a namespace of styling properties that are allowed because of element location.
I.e. all children of GridLayout will receive 'Grid' in this variable, therefore all items would

### childIndex
A variable to pass to `getStyling` function.

Can keep an index in repeatable group
