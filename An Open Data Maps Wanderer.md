## (Open) Data Maps Wanderer ##

Introduction
-----------

It's been a while since I have been trying to make order among all the geography-related topics from the perspective of a technical and non-technical user.
During the past year I have encountered many tools and services that allow to fulfill the need for geographical data information. 

Here are some examples:

 - Viewing the map of a city you will be visiting in your next trip;
 - finding all restaurants/theaters/whatever around a certain location;
 - search for places, businesses and locations based on a name;
 - obtain directions between your location and a desired destination;
 - ...and much more.

Now, for the average user, all these actions are performed through a single website: [Google Maps][1] (yes you could also use [Bing Maps][2] but... why?). 

But, as usual, what is apparently simple is actually very complicated. While Google hides all the complexity behind a single application, to replicate the same features outside of Google Maps and the likes requires a lot of interoperable tools. Thankfully, those tools and data exist.

Let's make a step back: our goal, as users, is rarely that of "getting data" but it's most likely that of obtaining information. 

There are two sides of the matter: the *data* and the *tools* used to represent that data. Google and Microsoft own both the data and the tools, and they grant access to users under certain [License][3] (for developers) and [Terms of Use][4] (for end users), which we accept upon usage of such services. 

That is totally fine. After all, would you complain of such amazing service? There's another question, however. One day someone stepped ask and wondered "what if certain data was as publicly accessible as the air we breathe and as the water we drink?". 
This is the basis of Open Data (Public Domain) licensing initiative, which does not deny the existence of paid services, but encourages the publishing of the information under a license that grant absolute rights on that information. 

Just like water, you can access free and pure water on a mountain hike in the Alps, but you pay for the commodity of having tap water in your house: such is with data, where you pay for the services that allow you to access such data and not for the data itself. 

In the case of geographical data, we have two types of data:

 - *Tiles* contain the graphical representation of a map, with altitude curves, streets, water, grass, and so on. 
 - *Points of Interest* represent everything that was given a name by man. Buildings, tops of mountains, objects and much more.
 - The administrative information represents country borders and regions.

Let's move deeper in putting all the pieces on the board. I will cover the following:

 1. [Leaflet][5]
 2. [OpenStreetMap][6]
 3. [Overpass API][7]
 4. [OpenLayers][8]
 5. MapQuest
 6. [MapBox][9]

As the most knowledgeable people may have noticed, I am mixing up various kinds of tools and services, but they represent the pieces of the puzzle we need to put together in order to achieve our goals of obtaining the desired information, so please bear with me. 
  

Leaflet
-------
Leaflet is a Javascript library for displaying a map in a HTML page and working with it (such as adding menu, markers and shapes - called *polygons* - to it). that's it. Is a very generic piece of software (and this is good) and in fact not just it can handle different types of map sources (such as OpenStreetMap and others) but it can also be included in other products. 

OpenStreetMap
------------
OpenStreetMap is a project to create a "wiki" map of the world. This project is ran by the OpenStreetMap Foundation. The OpenStreetMap database is a source for both Points of Interest and tiles, and it is made accessible to end-users through the portal [OpenStreetMap.org.][10], but the entire database can be [downloaded][11] on your hard drive (if you know what to do with it). 
OpenStreetMap data is more useful if made available through certain APIs, such as OverPass API. 

Overpass API
-----------


 
Some conclusions
---------------

- Can Open Data and Google Maps co-exist?
Sure thing, in fact they can also play along well together. You can have geographical data (such as location of schools in a city) published under an open license and develop an application that displays such data on top of a map offered by Google. Why not? 

- Can Google data and open source maps co-exist?
This is harder. Say that you have information about locations provided by Google then some limitations apply:

> If your application displays Places API data on a map, that map must
> be provided by Google.
> 
> If your application displays Places API data on a page or view that
> does not also display a Google Map, you must show a "Powered by
> Google" logo with that data. For example, if your application displays
> a list of Places on one tab, and a Google Map with those Places on
> another tab, the first tab must show the "Powered by Google" logo.


----------


 
> Written with [StackEdit](https://stackedit.io/).


  [1]: http://maps.google.com
  [2]: http://maps.bing.com
  [3]: https://developers.google.com/maps/licensing
  [4]: https://developers.google.com/maps/terms?hl=en
  [5]: http://leafletjs.com/
  [6]: http://www.openstreetmap.org/
  [7]: http://overpass-api.de/
  [8]: http://openlayers.org/
  [9]: https://www.mapbox.com/
  [10]: www.OpenStreetMap.org.
  [11]: http://planet.openstreetmap.org/