# targetbay-reviews-customizations
JS customizations made on TargetBay's BayReviews widgets

## Overview
* Uses MutationObserver to add missing unique IDs and classes to product reviews
* Uses MutationObserver to reposition some product review elements with jQuery's `appendTo()`

## Background
In April of 2021, a client wanted customizations made to the TargetBay Reviews widgets on their site. 
The changes were not possible due to incorrect markup in the TargetBay Reviews widgets (lack of unique element IDs).
TargetBay's engineering team refused to make the trivial changes on their end, so this code was created as a workaround.
