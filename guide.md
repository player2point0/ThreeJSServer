# Three js server

This project is essentialy a minimal data driven web game engine, built with the intention of displaying an AI chatbot avatar, virtual NI and data visualisation graphs.

The project has one main server that drives the front end, seperate servers (e.g. the ai chatbot, virtual ni) can send data to the main server that updates the main server's state and then updates the front end.

The front end is three.js and displays the data sent to it. This data is sent in an array of json objects, the json objects are in the general form:

```javascript
name: , //the name of the object, this should be unique
x: , //the x poision in the scene, relative to 0,0,0
y: , //the y poision in the scene, relative to 0,0,0
z: , //the z poision in the scene, relative to 0,0,0
xRotate: , //how much to rotate along the x axis, in degrees
yRotate: , //how much to rotate along the y axis, in degrees
zRotate: , //how much to rotate along the z axis, in degrees
xScale: , //how much to scale the object along the x axis
yScale: , //how much to scale the object along the y axis
zScale: , //how much to scale the object along the z axis
texture: , //the base64 encoded image texture
entityData:{
    indicies: , //the vertexes that make up each triangle
    uvs: , //the x and y position of the axes of the texture, used for texture mapping
    positions: , //the position of each point of the mesh
}
```

# sending data to be displayed

When creating a new application for the server, first create a new page on the main server with a new url. Implement a Start method that will send the initial data, this will be anything that update later on e.g. the AI chatbot avatar.

-todo add update from other servers method

# extending the front end 

If you want to extend the front end to for example be able to control the color of an object, first extend the "JavaEntity.js" file to perform the new functionality in the setup and in the update if needed. Next extend the main server's json object to include any new data.
