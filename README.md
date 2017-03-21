# Angular 2 Spreadsheet-Style Analytics

This example illustrates loading and analyzing two-dimenstional tablular data in an Angular 2 micro-application.  As with similar examples, a Flux-Redux style architecture is employed and this micro-app uses the same core classes as the Leaflet example.  This illustrates code re-use and consistency with other applications that brings an element of  uniformity to Angular 2 application deelopment.  

This particular example uses automobile data featured in the book 'Machine Learning in R' by Lantz (chapter 2).  The Typescript Math Toolkit _TSMT$DataStats_ and _TSMT$Table_ classes are used for the same analytics that would normally be performed with R or perhaps inside a spreadsheet such as Excel.

And, as always, I attempt to answer 'how to' questions in the context of an actual application.

Okay, I admit, I wanted an excuse to test out the Angular2 CLI release candidate.  You got me :)

Goals for this demo include:


```sh
- Adhere to concepts from Flux and Redux w/o 3rd party software
- Consume an actual back-end service to obtain application data
- Use the Typescript Math Toolkit for 2D data analysis
- Show how to initialize a 2D table in an Angular 2 template
- Show how to create a custom attribute Directive
- Show how to implement a flyout panel to display the result of 2D table analysis
```

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Angular: 2.4.0

Angular CLI: 1.0.0-rc.2


### Version

1.0.0


### Background

The script for this application is simple.  First, obtain header and 2D table data from a service.  Display that information in a 2D table or datagrid.  Perform requested analytics on the data and allow that information to be displayed in a flyout panel.  The panel is opened or closed by clicking on an 'open' or 'close' element at the bottom of the table display.


### Implementation

Automobile sales data is hardcoded in a PHP file with a CORS header that allows the file to be hosted on a server while exeucting the appliation locally.

A combination of two tables and some CSS is used to 'fake' a datagrid for demo purposes.

A textual element, i.e. "> Show Summary Statistics" or "> Hide Summary Statistics" is used as the clickable element for the flyout panel.  The panel is implemented using Angular 2 Animation with custom start/end handlers.  This implementation provides an opportunity to illustrate the _make clickable_ Directive, an attribute Directive that transforms tags such as paragraph or H1 into clickable elements.  This allows existing styling and markup to be maintained in a template without having to substitute anchors or add additional script to Components.  Refer to the _clickable.directive.ts_ file in the app/directives folder.  An additional advantage of an attribute directive is that intent is clearly and directly displayed in the relevant Component's template, not isolated in code-behind where more effort is required for someone else to track.


### Instructions

The PHP file that returns application data is in the src/php folder included with the distribution.  It is possible to place the PHP file on a server and test locally provided a CORS header is returned from the PHP script.  The example included in this repo has such a header and you will need to install the PHP file on a server in order to run the application.  Locate the _AutoModel.ts_ file in the app/model folder and search for the code segment

```
  this._service.getData("http://algorithmist.net/sse/services/autodata.php")
                        .subscribe( data  => this.__onAutoData(data),
                                    error => console.log(<any>error) );
```

Replace the above URL with the new location.

You may now build and serve using the CLI.

The display after data loading appears as follows:

![Image of 2D Table Demo]
(http://algorithmist.net/image/table1.png)


Click on the text '> Show Summary Statistics' to observe the flyout panel, which displays the following:

![Image of 2D Table Flyout Panel]
(http://algorithmist.net/image/table2.png)


Click on the text '> Hide Summary Statistics' to return the display to its original state.

Then, deconstruct the code and have fun!  The application could use a bit of a visual overhaul to make it look nicer, so that might be a nice place to start.

And, again, I apologize for no e2e, but like so many applications, this one is highly visual and best validated with interaction testing.


## CLI help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>
[https://github.com/haoliangyu/angular2-leaflet-starter]: <https://github.com/haoliangyu/angular2-leaflet-starter>
