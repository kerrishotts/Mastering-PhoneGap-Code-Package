A Pen created at CodePen.io. You can find this one at http://codepen.io/kerrishotts/pen/Wbaygb.

 This example demonstrates using the flexbox layout module in a responsive manner to create user interface layouts. In this example, the navigation bar is no longer pinned absolutely to the container, but rather it is a non-flexing element at the two of a vertical flex box. The scrolling container, OTH, can flex based on the remaining size of the parent.

The navigation bar is also using flex box -- there are three groups within that are positioned appropriately within. If the width of the bar is too small, the bar can expand as necessary to fit the content.

The list also uses flex box -- as you resize the view, the list items will expand, but they will also group themselves into a grid layout if they can fit. Internal to each list item is also several flex boxes. This simplifies layout dramatically.